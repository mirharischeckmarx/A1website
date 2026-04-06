"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════
   GLSL SHADERS — Cybernetic skin & glowing eye materials
   ═══════════════════════════════════════════════════════════════════════ */

const skinVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const skinFrag = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float circuit(vec2 uv, float scale) {
    vec2 id = floor(uv * scale);
    vec2 gv = fract(uv * scale);
    float h = hash(id);
    float lx = smoothstep(0.0, 0.05, gv.x) * smoothstep(1.0, 0.95, gv.x);
    float ly = smoothstep(0.0, 0.05, gv.y) * smoothstep(1.0, 0.95, gv.y);
    float grid = max(1.0 - lx, 1.0 - ly);
    if (h > 0.65) grid = max(grid, 1.0 - smoothstep(0.47, 0.53, gv.x));
    if (h > 0.82) grid = max(grid, 1.0 - smoothstep(0.47, 0.53, gv.y));
    // Animated pulse on some cells
    float pulse = step(0.9, h) * (0.5 + 0.5 * sin(uTime * 3.0 + h * 20.0));
    grid += pulse * 0.3;
    return grid;
  }

  void main() {
    // Base color — very dark with blue-purple tint
    vec3 base = vec3(0.015, 0.008, 0.035);

    // Fresnel edge glow (blue-cyan)
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.5);
    vec3 fresnelCol = mix(vec3(0.0, 0.3, 0.9), vec3(0.4, 0.0, 1.0), fresnel) * fresnel * 0.7;

    // Circuit board pattern — two scales
    float c1 = circuit(vUv, 14.0);
    float c2 = circuit(vUv + 0.5, 28.0);
    vec3 circuitCol = vec3(0.0, 0.45, 1.0) * c1 * 0.1 + vec3(0.3, 0.0, 0.8) * c2 * 0.04;

    // Horizontal scan line
    float scanY = fract(-vWorldPos.y * 0.25 + uTime * 0.12);
    float scan = smoothstep(0.0, 0.008, scanY) * smoothstep(0.025, 0.015, scanY);
    vec3 scanCol = vec3(0.0, 0.7, 1.0) * scan * 0.5;

    // Micro-cracks (thin bright lines at high-frequency hash)
    float crack = hash(floor(vUv * 90.0));
    vec3 crackCol = vec3(0.1, 0.4, 1.0) * step(0.975, crack) * 0.25;

    // Combine
    vec3 color = base + fresnelCol + circuitCol + scanCol + crackCol;
    float alpha = 0.94 + fresnel * 0.06;
    gl_FragColor = vec4(color, alpha);
  }
`;

const eyeVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const eyeFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float dist = length(c);
    float angle = atan(c.y, c.x);

    float iris = smoothstep(0.45, 0.32, dist);
    float innerRing = smoothstep(0.24, 0.21, dist) * smoothstep(0.17, 0.19, dist);
    float pupilR = 0.11 + 0.015 * sin(uTime * 1.8);
    float pupil = 1.0 - smoothstep(pupilR - 0.02, pupilR, dist);
    float rays = abs(sin(angle * 14.0 + uTime * 0.6)) * 0.25 * iris;
    float pulse = 0.75 + 0.25 * sin(uTime * 2.2);

    // Scan bar sweeping vertically
    float scanBar = 1.0 - smoothstep(0.0, 0.025, abs(c.y - 0.18 * sin(uTime * 2.8)));
    float scanEffect = scanBar * iris * 0.55;

    vec3 col = vec3(0.0, 0.4, 1.0) * iris * pulse;
    col += vec3(0.0, 0.85, 1.0) * innerRing * 0.9;
    col += vec3(0.15, 0.5, 1.0) * rays;
    col -= vec3(0.0, 0.15, 0.4) * pupil;
    col += vec3(0.2, 0.75, 1.0) * scanEffect;

    // Outer glow halo
    float halo = smoothstep(0.5, 0.0, dist) * 0.18;
    col += vec3(0.0, 0.3, 0.85) * halo;

    float a = max(smoothstep(0.48, 0.3, dist), halo);
    gl_FragColor = vec4(col, a);
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function ss(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function bump2D(nx: number, ny: number, cx: number, cy: number, r: number) {
  const d = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
  return 1 - ss(0, r, d);
}

/* ═══════════════════════════════════════════════════════════════════════
   FACE DISPLACEMENT — sculpts an icosahedron into a feminine robotic head
   ═══════════════════════════════════════════════════════════════════════ */

function displaceFace(pos: Float32Array, radius: number, isMobile: boolean) {
  const detail = isMobile ? 0.85 : 1.0; // scale displacement on mobile
  for (let i = 0; i < pos.length; i += 3) {
    let x = pos[i], y = pos[i + 1], z = pos[i + 2];
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len, ny = y / len, nz = z / len;
    const front = ss(-0.1, 0.4, nz); // 1 on front hemisphere

    // 1. Elongate — feminine head proportions
    y *= 1.18;

    // 2. Narrow jaw — tapers lower face
    if (ny < 0) {
      const jawFactor = 1 - ss(0, -0.55, ny) * 0.32;
      x *= jawFactor;
      z *= 1 - ss(0, -0.55, ny) * 0.1;
    }

    // 3. Feature displacements (world-space units)
    let d = 0;

    // Brow ridge
    d += bump2D(nx, ny, 0, 0.28, 0.35) * ss(0.3, 0.6, nz) * 0.18 * detail;

    // Eye sockets (two depressions)
    d -= bump2D(nx, ny, -0.22, 0.14, 0.11) * front * 0.45 * detail;
    d -= bump2D(nx, ny, 0.22, 0.14, 0.11) * front * 0.45 * detail;

    // Nose bridge
    const noseX = Math.abs(nx);
    if (noseX < 0.07 && ny > -0.08 && ny < 0.18 && nz > 0.55) {
      const noseProfile = ss(-0.08, 0.05, ny) * ss(0.18, 0.1, ny);
      d += ss(0.07, 0, noseX) * noseProfile * 0.22 * detail;
    }

    // Nose tip
    if (noseX < 0.09 && ny > -0.16 && ny < -0.04 && nz > 0.6) {
      d += bump2D(nx, ny, 0, -0.1, 0.08) * 0.16 * detail;
    }

    // Cheekbones
    d += bump2D(nx, ny, -0.38, 0.02, 0.13) * ss(0.15, 0.5, nz) * 0.18 * detail;
    d += bump2D(nx, ny, 0.38, 0.02, 0.13) * ss(0.15, 0.5, nz) * 0.18 * detail;

    // Lips area
    if (noseX < 0.13 && nz > 0.55) {
      const lipBump = bump2D(nx, ny, 0, -0.22, 0.1);
      d += lipBump * 0.1 * detail;
    }

    // Chin
    d += bump2D(nx, ny, 0, -0.46, 0.1) * ss(0.15, 0.45, nz) * 0.16 * detail;

    // Temple indents (mechanical insets)
    d -= bump2D(nx, ny, -0.52, 0.1, 0.09) * 0.2 * detail;
    d -= bump2D(nx, ny, 0.52, 0.1, 0.09) * 0.2 * detail;

    // Forehead — slight forward push
    if (ny > 0.35 && nz > 0.25) {
      d += ss(0.35, 0.6, ny) * ss(0.25, 0.5, nz) * 0.08 * detail;
    }

    // Flatten back of head
    if (nz < -0.35) d -= ss(-0.35, -1, nz) * 0.2;

    // Apply displacement along normal
    x += nx * d;
    y += ny * d * 1.18; // maintain Y-scale ratio
    z += nz * d;

    pos[i] = x;
    pos[i + 1] = y;
    pos[i + 2] = z;
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function AIFaceScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.querySelector("canvas")) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const mobile = w < 768;

    /* ── Renderer ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020008, 0.018);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 200);
    camera.position.set(0, 0.5, 13);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    /* ── Lights — cinematic 3-point + eye glow ── */
    scene.add(new THREE.AmbientLight(0x080020, 0.4));

    const keyLight = new THREE.SpotLight(0x3366ff, 60, 60, Math.PI / 5, 0.6, 1);
    keyLight.position.set(-10, 14, 18);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00c8ff, 12, 40);
    fillLight.position.set(12, -6, 10);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x6600cc, 25, 35);
    rimLight.position.set(-4, -10, -8);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0x2200aa, 8, 30);
    topLight.position.set(0, 18, 2);
    scene.add(topLight);

    // Eye glow lights (cyan point lights at each eye)
    const leftEyeLight = new THREE.PointLight(0x00aaff, 6, 8);
    leftEyeLight.position.set(-0.85, 0.65, 3.6);
    scene.add(leftEyeLight);

    const rightEyeLight = new THREE.PointLight(0x00aaff, 6, 8);
    rightEyeLight.position.set(0.85, 0.65, 3.6);
    scene.add(rightEyeLight);

    /* ── Face group (head + eyes + mechanical parts) ── */
    const faceGroup = new THREE.Group();
    faceGroup.position.set(0, -0.5, 0);
    scene.add(faceGroup);

    // Head geometry — displaced icosahedron
    const headDetail = mobile ? 28 : 48;
    const headGeo = new THREE.IcosahedronGeometry(4, headDetail);
    const posArr = headGeo.attributes.position.array as Float32Array;
    displaceFace(posArr, 4, mobile);
    headGeo.attributes.position.needsUpdate = true;
    headGeo.computeVertexNormals();

    // Skin material — custom shader
    const skinUniforms = { uTime: { value: 0 } };
    const skinMat = new THREE.ShaderMaterial({
      vertexShader: skinVert,
      fragmentShader: skinFrag,
      uniforms: skinUniforms,
      transparent: true,
      side: THREE.FrontSide,
    });
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    faceGroup.add(headMesh);

    // Wireframe overlay — subtle structural lines
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1a3366,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const wireOverlay = new THREE.Mesh(headGeo, wireMat);
    wireOverlay.scale.setScalar(1.002);
    faceGroup.add(wireOverlay);

    /* ── Eyes — glowing discs with custom shader ── */
    const eyeUniforms = { uTime: { value: 0 } };
    const eyeMat = new THREE.ShaderMaterial({
      vertexShader: eyeVert,
      fragmentShader: eyeFrag,
      uniforms: eyeUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const eyeGeo = new THREE.CircleGeometry(0.38, 64);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.85, 0.65, 3.55);
    leftEye.lookAt(-1.7, 1.3, 8);
    faceGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.85, 0.65, 3.55);
    rightEye.lookAt(1.7, 1.3, 8);
    faceGroup.add(rightEye);

    // Eye socket rim — thin glowing torus around each eye
    const rimGeo = new THREE.TorusGeometry(0.42, 0.02, 8, 48);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const leftRim = new THREE.Mesh(rimGeo, rimMat);
    leftRim.position.copy(leftEye.position);
    leftRim.lookAt(-1.7, 1.3, 8);
    faceGroup.add(leftRim);

    const rightRim = new THREE.Mesh(rimGeo, rimMat);
    rightRim.position.copy(rightEye.position);
    rightRim.lookAt(1.7, 1.3, 8);
    faceGroup.add(rightRim);

    /* ── Mechanical details — cybernetic implants ── */
    // Temple hexagonal plates
    const hexGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 6);
    const mechMat = new THREE.MeshPhysicalMaterial({
      color: 0x111133,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0033aa,
      emissiveIntensity: 0.15,
    });

    const leftTemple = new THREE.Mesh(hexGeo, mechMat);
    leftTemple.position.set(-2.5, 0.5, 2.2);
    leftTemple.rotation.z = Math.PI / 2;
    leftTemple.lookAt(-4, 0.5, 4);
    faceGroup.add(leftTemple);

    const rightTemple = new THREE.Mesh(hexGeo, mechMat);
    rightTemple.position.set(2.5, 0.5, 2.2);
    rightTemple.rotation.z = Math.PI / 2;
    rightTemple.lookAt(4, 0.5, 4);
    faceGroup.add(rightTemple);

    // Forehead crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.18, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0066ff,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x0044cc,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(0, 2.8, 3.0);
    faceGroup.add(crystal);

    // Neural wiring — lines from temples to eyes to forehead
    const wirePts = [
      [new THREE.Vector3(-2.5, 0.5, 2.2), new THREE.Vector3(-1.5, 0.6, 3.0), new THREE.Vector3(-0.85, 0.65, 3.55)],
      [new THREE.Vector3(2.5, 0.5, 2.2), new THREE.Vector3(1.5, 0.6, 3.0), new THREE.Vector3(0.85, 0.65, 3.55)],
      [new THREE.Vector3(-0.85, 0.65, 3.55), new THREE.Vector3(-0.3, 1.8, 3.2), new THREE.Vector3(0, 2.8, 3.0)],
      [new THREE.Vector3(0.85, 0.65, 3.55), new THREE.Vector3(0.3, 1.8, 3.2), new THREE.Vector3(0, 2.8, 3.0)],
      // Jaw wires
      [new THREE.Vector3(-2.5, 0.5, 2.2), new THREE.Vector3(-1.8, -1.2, 2.8), new THREE.Vector3(-0.6, -2.2, 3.0)],
      [new THREE.Vector3(2.5, 0.5, 2.2), new THREE.Vector3(1.8, -1.2, 2.8), new THREE.Vector3(0.6, -2.2, 3.0)],
    ];
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    wirePts.forEach((pts) => {
      const curve = new THREE.QuadraticBezierCurve3(pts[0], pts[1], pts[2]);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const line = new THREE.Line(geo, wireMaterial);
      faceGroup.add(line);
    });

    /* ── Side profiles — ghostly duplicates ── */
    if (!mobile) {
      const ghostMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a2a,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.1,
        emissive: 0x000844,
        emissiveIntensity: 0.3,
      });

      // Lower-detail geometry for side profiles
      const sideGeo = new THREE.IcosahedronGeometry(4, 20);
      const sidePos = sideGeo.attributes.position.array as Float32Array;
      displaceFace(sidePos, 4, true);
      sideGeo.attributes.position.needsUpdate = true;
      sideGeo.computeVertexNormals();

      const leftProfile = new THREE.Mesh(sideGeo, ghostMat);
      leftProfile.position.set(-8, -0.5, -4);
      leftProfile.rotation.y = 0.9;
      leftProfile.scale.setScalar(0.9);
      scene.add(leftProfile);

      const rightProfile = new THREE.Mesh(sideGeo, ghostMat);
      rightProfile.position.set(8, -0.5, -4);
      rightProfile.rotation.y = -0.9;
      rightProfile.scale.setScalar(0.9);
      scene.add(rightProfile);

      // Side profile edge glow
      const sideEdgeMat = new THREE.MeshBasicMaterial({
        color: 0x1133aa,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
      });
      const leftWire = new THREE.Mesh(sideGeo, sideEdgeMat);
      leftWire.position.copy(leftProfile.position);
      leftWire.rotation.copy(leftProfile.rotation);
      leftWire.scale.copy(leftProfile.scale);
      scene.add(leftWire);

      const rightWire = new THREE.Mesh(sideGeo, sideEdgeMat);
      rightWire.position.copy(rightProfile.position);
      rightWire.rotation.copy(rightProfile.rotation);
      rightWire.scale.copy(rightProfile.scale);
      scene.add(rightWire);
    }

    /* ── Neural network grid (background) ── */
    const nodeCount = mobile ? 30 : 60;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        -10 - Math.random() * 15,
      ));
    }

    // Dots at each node
    const nodeGeo = new THREE.BufferGeometry();
    const nodePosArr = new Float32Array(nodeCount * 3);
    nodes.forEach((n, i) => { nodePosArr[i * 3] = n.x; nodePosArr[i * 3 + 1] = n.y; nodePosArr[i * 3 + 2] = n.z; });
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePosArr, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x3366ff,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // Lines connecting nearby nodes
    const gridLineMat = new THREE.LineBasicMaterial({
      color: 0x1a33aa,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const threshold = 10;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          const lg = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
          scene.add(new THREE.Line(lg, gridLineMat));
        }
      }
    }

    /* ── Floating particles ── */
    const pCount = mobile ? 400 : 1200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 60;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 3;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x4488ff,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Volumetric light beams ── */
    for (let i = 0; i < 4; i++) {
      const bGeo = new THREE.PlaneGeometry(0.4, 40);
      const bMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x2244cc : 0x0088ff,
        transparent: true,
        opacity: 0.012,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(bGeo, bMat);
      beam.position.set((i - 1.5) * 3, 0, -2);
      beam.rotation.z = (i - 1.5) * 0.12;
      scene.add(beam);
    }

    /* ── Ground reflection plane ── */
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x010008,
      metalness: 0.95,
      roughness: 0.35,
      transparent: true,
      opacity: 0.4,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
    scene.add(ground);

    /* ── Mouse tracking + scroll ── */
    let mx = 0, my = 0, targetMx = 0, targetMy = 0, scrollY = 0;
    const onMouse = (e: MouseEvent) => {
      targetMx = (e.clientX / w - 0.5) * 2;
      targetMy = (e.clientY / h - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Animation loop ── */
    let frameId: number;
    const t0 = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - t0) * 0.001;

      // Update shader time
      skinUniforms.uTime.value = t;
      eyeUniforms.uTime.value = t;

      // Smooth mouse interpolation
      mx += (targetMx - mx) * 0.035;
      my += (targetMy - my) * 0.035;

      // Idle micro-movements (slow, organic)
      const idleX = Math.sin(t * 0.3) * 0.02 + Math.sin(t * 0.17) * 0.01;
      const idleY = Math.cos(t * 0.25) * 0.015 + Math.sin(t * 0.13) * 0.008;

      // Face group rotation (mouse parallax + idle)
      faceGroup.rotation.y = mx * 0.15 + idleX;
      faceGroup.rotation.x = -my * 0.08 + idleY;

      // Breathing effect (subtle Y-scale oscillation)
      const breath = 1 + Math.sin(t * 0.8) * 0.006;
      faceGroup.scale.set(1, breath, 1);

      // Eye glow intensity variation
      const eyeIntensity = 5 + Math.sin(t * 1.5) * 2 + Math.sin(t * 3.7) * 0.5;
      leftEyeLight.intensity = eyeIntensity;
      rightEyeLight.intensity = eyeIntensity;

      // Forehead crystal rotation
      crystal.rotation.y = t * 0.5;
      crystal.rotation.x = Math.sin(t * 0.7) * 0.3;

      // Particle drift
      const pp = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pp[i * 3 + 1] += 0.005;
        if (pp[i * 3 + 1] > 20) {
          pp[i * 3 + 1] = -20;
          pp[i * 3] = (Math.random() - 0.5) * 60;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      // Camera — cinematic parallax following mouse
      camera.position.x += (mx * 2.5 - camera.position.x) * 0.02;
      camera.position.y += (0.5 - my * 1.2 - camera.position.y) * 0.02;
      camera.position.z = 13 - Math.min(scrollY * 0.002, 3);
      camera.lookAt(0, -0.3, 0);

      // Lights follow mouse for dramatic shadow shifts
      keyLight.position.x = -10 + mx * 6;
      keyLight.position.y = 14 + my * -4;
      fillLight.position.x = 12 + mx * -3;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize handler ── */
    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup — dispose everything to prevent GPU leaks ── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      renderer.dispose();
      if (el && renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
