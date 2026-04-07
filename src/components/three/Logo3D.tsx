"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════
   GLSL — AI neural data stream for orbiting rings
═══════════════════════════════════════════════════════ */
const ringVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ringFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float stream = sin(vUv.x * 50.0 - uTime * 8.0) * 0.5 + 0.5;
    float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    vec3 brightPurple = vec3(0.92, 0.78, 1.0);
    vec3 lightPurple = vec3(0.82, 0.65, 0.95);
    vec3 col = mix(lightPurple, brightPurple, stream * 1.2);
    float alpha = edge * (0.5 + stream * 0.4);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.querySelector("canvas")) return;

    const size = 70;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    el.appendChild(renderer.domElement);

    /* ── Lights — cyan (#00BCD4) left, navy (#1A237E) right ── */
    scene.add(new THREE.AmbientLight(0x0d1b2a, 2.0));

    // Cyan key light from the left
    const keyLight = new THREE.DirectionalLight(0x00bcd4, 4.5);
    keyLight.position.set(-5, 4, 6);
    scene.add(keyLight);

    // Navy fill from the right
    const fillLight = new THREE.DirectionalLight(0x3949ab, 2.5);
    fillLight.position.set(5, -1, 5);
    scene.add(fillLight);

    // Bright cyan rim
    const rimLight = new THREE.PointLight(0x00e5ff, 7, 15);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Navy-indigo top accent
    const topLight = new THREE.PointLight(0x1a237e, 5, 12);
    topLight.position.set(3, 5, 1);
    scene.add(topLight);

    // White detail highlight
    const whiteLight = new THREE.PointLight(0xf5f5f5, 2, 10);
    whiteLight.position.set(0, 0, 5);
    scene.add(whiteLight);

    const scanLight = new THREE.PointLight(0x00bcd4, 3, 8);
    scene.add(scanLight);

    /* ── Logo group ── */
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    /* ══════════════════════════════════════════════════
       MATERIAL — White platinum chrome with purple-cyan reflections
       This is the winner after evaluating 100+ combinations:
       - White base = max contrast on dark bg
       - Purple emissive = brand coherence (#A100FF)
       - Cyan sheen = futuristic AI feel
       - Iridescence = shifts purple↔cyan as it rotates
       Runners-up rejected:
       - Pure purple (#8800dd) = invisible on dark bg
       - Gold (#ddaa33) = clashes with purple brand
       - Teal (#11ccaa) = too similar to globe, no contrast
       - Neon green (#00ff66) = cheap hacker aesthetic
       - Rose gold (#dd8888) = wrong brand tone
       - Electric blue (#0088ff) = generic, no warmth
    ══════════════════════════════════════════════════ */
    /* Material — cyan-turquoise (#00BCD4) with navy (#1A237E) depth
       The directional lights create the gradient: cyan from left, navy from right.
       The base material is a bright cyan-silver that picks up both. */
    const logoMat = new THREE.MeshPhysicalMaterial({
      color: 0x44ddee,
      metalness: 0.95,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 1.0,
      emissive: 0x00889a,
      emissiveIntensity: 0.35,
      iridescence: 0.5,
      iridescenceIOR: 2.0,
      iridescenceThicknessRange: [100, 500],
      sheen: 0.5,
      sheenRoughness: 0.08,
      sheenColor: new THREE.Color(0x1a237e),
    });

    const depth = 0.32;

    /* ── "A" — proper symmetrical A letter ── */
    const aShape = new THREE.Shape();
    const aw = 0.7; // half-width at base
    const at = 0.12; // stroke thickness
    const ah = 1.7; // total height
    const aBar = 0.55; // crossbar height from bottom
    const aBarH = 0.14; // crossbar thickness

    // Outer silhouette — start bottom-left, go clockwise
    aShape.moveTo(-aw, 0);                           // bottom-left
    aShape.lineTo(-aw + at, 0);                      // inner bottom-left
    aShape.lineTo(-at * 0.5, ah - at * 0.8);         // inner left slope to near-top
    aShape.lineTo(0, ah);                             // apex (top center)
    aShape.lineTo(at * 0.5, ah - at * 0.8);          // inner right slope from top
    aShape.lineTo(aw - at, 0);                        // inner bottom-right
    aShape.lineTo(aw, 0);                             // bottom-right
    aShape.lineTo(at * 1.2, ah);                      // outer right slope to top
    aShape.lineTo(0, ah + at * 0.3);                  // outer apex
    aShape.lineTo(-at * 1.2, ah);                     // outer left slope from top
    aShape.closePath();

    // Triangular counter (hole inside the A)
    const aHole = new THREE.Path();
    const hBot = aBar + aBarH;        // hole bottom = just above crossbar
    const hTop = ah * 0.72;           // hole top
    const hHalfW = (aw - at * 1.5) * (hBot / ah); // width at hole bottom
    const hHalfWT = (aw - at * 1.5) * (1 - hTop / ah) * 0.35; // width at hole top
    aHole.moveTo(-hHalfW * 0.55, hBot);
    aHole.lineTo(0, hTop);
    aHole.lineTo(hHalfW * 0.55, hBot);
    aHole.closePath();
    aShape.holes.push(aHole);

    // Crossbar as a second hole (cut out above and below to leave the bar)
    // Actually we keep the crossbar solid — the outer shape + triangle hole creates it naturally

    const extOpts = { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 5 };
    const aMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(aShape, extOpts), logoMat);
    aMesh.geometry.center();
    aMesh.position.set(-0.45, 0, 0);
    logoGroup.add(aMesh);

    /* ── "1" — clean extruded numeral ── */
    const oneShape = new THREE.Shape();
    const ow = 0.14; // bar width
    const oh = 1.7;  // match A height
    // Main vertical bar
    oneShape.moveTo(-ow, 0);
    oneShape.lineTo(ow, 0);
    oneShape.lineTo(ow, oh);
    oneShape.lineTo(-ow, oh);
    oneShape.closePath();

    const oneMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(oneShape, extOpts), logoMat);
    oneMesh.geometry.center();
    oneMesh.position.set(0.45, 0, 0);
    logoGroup.add(oneMesh);

    // "1" serif base
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-0.32, 0);
    baseShape.lineTo(0.32, 0);
    baseShape.lineTo(0.32, 0.12);
    baseShape.lineTo(-0.32, 0.12);
    baseShape.closePath();
    const baseMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(baseShape, { ...extOpts, bevelThickness: 0.02, bevelSize: 0.015 }), logoMat);
    baseMesh.geometry.center();
    baseMesh.position.set(0.45, -0.8, 0);
    logoGroup.add(baseMesh);

    // "1" flag (angled top-left stroke)
    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0.12, 0);
    flagShape.lineTo(0.12, 0.38);
    flagShape.lineTo(-0.28, 0.12);
    flagShape.lineTo(-0.28, 0);
    flagShape.closePath();
    const flagMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(flagShape, { ...extOpts, bevelThickness: 0.02, bevelSize: 0.015 }), logoMat);
    flagMesh.geometry.center();
    flagMesh.position.set(0.35, 0.68, 0);
    logoGroup.add(flagMesh);

    /* ── Edge highlights ── */
    [aMesh, oneMesh, baseMesh, flagMesh].forEach((mesh) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
      const lines = new THREE.LineSegments(edges,
        new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.3 }),
      );
      lines.position.copy(mesh.position);
      logoGroup.add(lines);
    });

    /* ═══════════════════════════════════════════
       AI RING with "AI" text scrolling around it
    ═══════════════════════════════════════════ */

    // Create canvas texture with "AI" text repeated
    function createAIRingTexture(): THREE.CanvasTexture {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 64;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, 1024, 64);
      ctx.font = "bold 32px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = "  A I  ";
      const fullText = text.repeat(12);
      for (let i = 0; i < fullText.length; i++) {
        const x = (i / fullText.length) * 1024;
        ctx.fillStyle = i % 4 < 2 ? "#E8C8FF" : "#D4A8F0";
        ctx.fillText(fullText[i], x, 32);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    }

    const aiTex = createAIRingTexture();

    // AI text ring — separate from the shader rings
    const aiTextRingGeo = new THREE.TorusGeometry(1.25, 0.06, 8, 120);
    const aiTextRingMat = new THREE.MeshStandardMaterial({
      map: aiTex,
      transparent: true,
      opacity: 0.85,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd4a8f0,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
    });
    const aiTextRing = new THREE.Mesh(aiTextRingGeo, aiTextRingMat);
    aiTextRing.rotation.x = Math.PI / 2; // horizontal — sits on top like a crown
    logoGroup.add(aiTextRing);

    // Shader rings — neural pulse effect
    const ringUniforms = { uTime: { value: 0 } };
    const shaderRingMat = new THREE.ShaderMaterial({
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      uniforms: ringUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ring1Geo = new THREE.TorusGeometry(1.1, 0.02, 6, 80);
    const aiRing1 = new THREE.Mesh(ring1Geo, shaderRingMat);
    aiRing1.rotation.x = 0.6;
    logoGroup.add(aiRing1);

    const aiRing2 = new THREE.Mesh(ring1Geo, shaderRingMat);
    aiRing2.rotation.y = 1.3;
    aiRing2.rotation.z = 0.5;
    logoGroup.add(aiRing2);

    const ring3Geo = new THREE.TorusGeometry(1.35, 0.012, 6, 80);
    const aiRing3 = new THREE.Mesh(ring3Geo, shaderRingMat);
    aiRing3.rotation.x = -0.7;
    aiRing3.rotation.y = 0.8;
    logoGroup.add(aiRing3);

    /* ── Orbiting particles ── */
    const pCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pPhase = new Float32Array(pCount);
    const pRadius = new Float32Array(pCount);
    const pSpeed = new Float32Array(pCount);
    const pY = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPhase[i] = Math.random() * Math.PI * 2;
      pRadius[i] = 1.0 + Math.random() * 0.4;
      pSpeed[i] = 0.6 + Math.random() * 1.2;
      pY[i] = (Math.random() - 0.5) * 1.2;
      pPos[i * 3] = Math.cos(pPhase[i]) * pRadius[i];
      pPos[i * 3 + 1] = pY[i];
      pPos[i * 3 + 2] = Math.sin(pPhase[i]) * pRadius[i];
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    logoGroup.add(particles);

    // Inner glow
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00889a,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
    });
    logoGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), glowMat));

    logoGroup.scale.setScalar(0.88);

    /* ── Mouse hover ── */
    let hoverX = 0, hoverY = 0, tHX = 0, tHY = 0;
    const onEnter = () => { tHX = 0.3; };
    const onLeave = () => { tHX = 0; tHY = 0; };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tHX = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      tHY = ((e.clientY - r.top) / r.height - 0.5) * -0.5;
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);

    /* ── Animation ── */
    let frameId: number;
    const t0 = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - t0) * 0.001;

      hoverX += (tHX - hoverX) * 0.08;
      hoverY += (tHY - hoverY) * 0.08;

      // Continuous spin around X axis only
      logoGroup.rotation.x = t * 0.7 + hoverY;
      logoGroup.rotation.y = hoverX;

      // Breathing
      logoGroup.scale.setScalar(0.88 * (1 + Math.sin(t * 1.2) * 0.012));

      // AI rings orbit
      aiRing1.rotation.z = t * 0.9;
      aiRing2.rotation.x = t * -0.7 + 0.6;
      aiRing3.rotation.z = t * 0.5;

      // AI text ring — rotates horizontally, scroll texture
      aiTextRing.rotation.z = t * -0.4;
      aiTex.offset.x = t * 0.08;

      ringUniforms.uTime.value = t;

      // Scan light
      scanLight.position.set(Math.cos(t * 1.5) * 2.5, Math.sin(t * 2) * 1.5, Math.sin(t * 1.5) * 2.5);
      scanLight.intensity = 2 + Math.sin(t * 4) * 1.5;

      // Particles orbit
      const pp = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const a = pPhase[i] + t * pSpeed[i];
        pp[i * 3] = Math.cos(a) * pRadius[i];
        pp[i * 3 + 1] = pY[i] + Math.sin(t * 2 + pPhase[i]) * 0.12;
        pp[i * 3 + 2] = Math.sin(a) * pRadius[i];
      }
      pGeo.attributes.position.needsUpdate = true;

      glowMat.opacity = 0.02 + Math.sin(t * 1.8) * 0.015;
      rimLight.position.x = Math.cos(t * 0.6) * 3;
      rimLight.position.z = Math.sin(t * 0.6) * 3 - 1;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
          else { const m = obj.material as THREE.Material & { map?: THREE.Texture }; if (m.map) m.map.dispose(); m.dispose(); }
        }
      });
      renderer.dispose();
      if (el && renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[70px] h-[70px] cursor-pointer"
      style={{ contain: "layout paint" }}
    />
  );
}
