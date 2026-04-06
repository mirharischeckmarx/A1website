"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface RobertAvatarProps {
  phase: "hidden" | "eyes" | "forming" | "idle";
  isSpeaking: boolean;
  mousePos: { x: number; y: number };
}

export default function RobertAvatar({
  phase,
  isSpeaking,
  mousePos,
}: RobertAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    head: THREE.Group;
    leftEye: THREE.Mesh;
    rightEye: THREE.Mesh;
    leftIris: THREE.Mesh;
    rightIris: THREE.Mesh;
    jawGroup: THREE.Group;
    particles: THREE.Points;
    glitchLines: THREE.Group;
    codeRain: THREE.Points;
    mirrorFaces: THREE.Group;
    frameId: number;
  } | null>(null);

  const initScene = useCallback(() => {
    if (!containerRef.current || sceneRef.current) return;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x4488ff, 0.8);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00aaff, 0.6);
    rimLight.position.set(-3, 1, -2);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0x00ff9c, 0.3, 10);
    bottomLight.position.set(0, -2, 3);
    scene.add(bottomLight);

    // ── HEAD GROUP ──
    const head = new THREE.Group();
    head.visible = false;
    scene.add(head);

    // Cranium — elongated sphere
    const craniumGeo = new THREE.SphereGeometry(1, 64, 64);
    craniumGeo.scale(0.85, 1.05, 0.9);
    const craniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a35,
      metalness: 0.7,
      roughness: 0.35,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.5,
    });
    const cranium = new THREE.Mesh(craniumGeo, craniumMat);
    cranium.position.y = 0.15;
    head.add(cranium);

    // Face plate — slightly flatter front
    const faceGeo = new THREE.SphereGeometry(0.88, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6);
    faceGeo.scale(0.82, 0.95, 0.6);
    const faceMat = new THREE.MeshPhysicalMaterial({
      color: 0x333340,
      metalness: 0.8,
      roughness: 0.25,
      clearcoat: 0.6,
    });
    const facePlate = new THREE.Mesh(faceGeo, faceMat);
    facePlate.position.set(0, 0, 0.25);
    facePlate.rotation.x = -0.1;
    head.add(facePlate);

    // Cheek ridges
    const ridgeGeo = new THREE.BoxGeometry(0.08, 0.5, 0.15);
    const ridgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x222230,
      metalness: 0.9,
      roughness: 0.2,
    });
    const leftRidge = new THREE.Mesh(ridgeGeo, ridgeMat);
    leftRidge.position.set(-0.6, -0.1, 0.4);
    leftRidge.rotation.z = 0.15;
    head.add(leftRidge);
    const rightRidge = leftRidge.clone();
    rightRidge.position.x = 0.6;
    rightRidge.rotation.z = -0.15;
    head.add(rightRidge);

    // Nose bridge
    const noseGeo = new THREE.BoxGeometry(0.08, 0.35, 0.2);
    const nose = new THREE.Mesh(noseGeo, ridgeMat);
    nose.position.set(0, -0.1, 0.65);
    head.add(nose);

    // Forehead panel lines
    for (let i = 0; i < 3; i++) {
      const lineGeo = new THREE.BoxGeometry(0.5 - i * 0.1, 0.015, 0.01);
      const lineMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.2,
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.55 + i * 0.08, 0.7);
      head.add(line);
    }

    // ── EYES ──
    const eyeSocketGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const eyeSocketMat = new THREE.MeshPhysicalMaterial({
      color: 0x000010,
      metalness: 1,
      roughness: 0.1,
    });

    // Left eye
    const leftEyeSocket = new THREE.Mesh(eyeSocketGeo, eyeSocketMat);
    leftEyeSocket.position.set(-0.3, 0.15, 0.6);
    leftEyeSocket.scale.set(1, 0.85, 0.5);
    head.add(leftEyeSocket);

    // Right eye
    const rightEyeSocket = leftEyeSocket.clone();
    rightEyeSocket.position.x = 0.3;
    head.add(rightEyeSocket);

    // Glowing eyes — the iconic blue swirling orbs
    const eyeGeo = new THREE.SphereGeometry(0.14, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0,
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    leftEye.position.set(-0.3, 0.15, 0.68);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    rightEye.position.set(0.3, 0.15, 0.68);
    head.add(rightEye);

    // Iris detail (inner bright core)
    const irisGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const irisMat = new THREE.MeshBasicMaterial({
      color: 0x44bbff,
      transparent: true,
      opacity: 0,
    });

    const leftIris = new THREE.Mesh(irisGeo, irisMat.clone());
    leftIris.position.set(-0.3, 0.15, 0.75);
    head.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeo, irisMat.clone());
    rightIris.position.set(0.3, 0.15, 0.75);
    head.add(rightIris);

    // Eye glow point lights
    const leftEyeLight = new THREE.PointLight(0x0088ff, 0, 3);
    leftEyeLight.position.copy(leftEye.position);
    head.add(leftEyeLight);

    const rightEyeLight = new THREE.PointLight(0x0088ff, 0, 3);
    rightEyeLight.position.copy(rightEye.position);
    head.add(rightEyeLight);

    // ── JAW (for speaking animation) ──
    const jawGroup = new THREE.Group();
    jawGroup.position.set(0, -0.45, 0.3);
    head.add(jawGroup);

    const jawGeo = new THREE.BoxGeometry(0.5, 0.12, 0.35);
    jawGeo.translate(0, -0.06, 0);
    const jawMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a35,
      metalness: 0.7,
      roughness: 0.35,
    });
    const jaw = new THREE.Mesh(jawGeo, jawMat);
    jawGroup.add(jaw);

    // Mouth slit glow
    const mouthGeo = new THREE.BoxGeometry(0.35, 0.02, 0.01);
    const mouthMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.4,
    });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.02, 0.18);
    jawGroup.add(mouth);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.5, 16);
    const neckMat = new THREE.MeshPhysicalMaterial({
      color: 0x222230,
      metalness: 0.8,
      roughness: 0.3,
    });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.set(0, -0.95, 0);
    head.add(neck);

    // Neck rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.27 + i * 0.02, 0.008, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, -0.75 - i * 0.12, 0);
      ring.rotation.x = Math.PI / 2;
      head.add(ring);
    }

    // ── FORMATION PARTICLES ──
    const particleCount = isMobile ? 500 : 1500;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pTargets = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random starting positions (scattered)
      pPositions[i * 3] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Target: head surface shape
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1 + Math.random() * 0.3;
      pTargets[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.85;
      pTargets[i * 3 + 1] = r * Math.cos(phi) * 1.05 + 0.15;
      pTargets[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.9;

      // Blue-cyan colors
      const brightness = 0.3 + Math.random() * 0.7;
      pColors[i * 3] = 0;
      pColors[i * 3 + 1] = brightness * 0.5;
      pColors[i * 3 + 2] = brightness;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    pGeo.userData.targets = pTargets;

    const pMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── GLITCH LINES ──
    const glitchLines = new THREE.Group();
    scene.add(glitchLines);

    for (let i = 0; i < 20; i++) {
      const lineGeo = new THREE.PlaneGeometry(
        0.3 + Math.random() * 2,
        0.02 + Math.random() * 0.03
      );
      const lineMat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x0088ff : 0x00ff9c,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        1 + Math.random() * 0.5
      );
      glitchLines.add(line);
    }

    // ── CODE RAIN (digital code falling in BG) ──
    const codeCount = isMobile ? 200 : 600;
    const codeGeo = new THREE.BufferGeometry();
    const codePos = new Float32Array(codeCount * 3);

    for (let i = 0; i < codeCount; i++) {
      codePos[i * 3] = (Math.random() - 0.5) * 14;
      codePos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      codePos[i * 3 + 2] = -2 - Math.random() * 5;
    }

    codeGeo.setAttribute("position", new THREE.BufferAttribute(codePos, 3));
    const codeMat = new THREE.PointsMaterial({
      color: 0x00ff9c,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const codeRain = new THREE.Points(codeGeo, codeMat);
    scene.add(codeRain);

    // ── HOLOGRAPHIC ENERGY RINGS around head ──
    const energyRings: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.TorusGeometry(1.3 + i * 0.2, 0.005, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x0088ff : 0x00ff9c,
        transparent: true,
        opacity: 0.12 - i * 0.02,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i - 2) * 0.15;
      ring.rotation.z = i * 0.3;
      ring.position.y = 0.1;
      head.add(ring);
      energyRings.push(ring);
    }

    // ── AURA GLOW (sphere around head) ──
    const auraGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x0044ff,
      transparent: true,
      opacity: 0.015,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.position.y = 0.1;
    head.add(aura);

    // ── CIRCUIT LINES on face ──
    const circuitGroup = new THREE.Group();
    head.add(circuitGroup);
    const circuitPaths = [
      [[-0.6, 0.3, 0.55], [-0.4, 0.3, 0.65], [-0.4, 0.0, 0.68]],
      [[0.6, 0.3, 0.55], [0.4, 0.3, 0.65], [0.4, 0.0, 0.68]],
      [[-0.15, 0.5, 0.7], [-0.15, 0.3, 0.72], [0.0, 0.2, 0.73]],
      [[0.15, 0.5, 0.7], [0.15, 0.3, 0.72], [0.0, 0.2, 0.73]],
      [[-0.5, -0.2, 0.5], [-0.3, -0.3, 0.6], [-0.1, -0.35, 0.62]],
      [[0.5, -0.2, 0.5], [0.3, -0.3, 0.6], [0.1, -0.35, 0.62]],
    ];
    circuitPaths.forEach((path) => {
      const points = path.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.15,
      });
      circuitGroup.add(new THREE.Line(geo, mat));
      // Dot at end of each circuit
      const dotGeo = new THREE.SphereGeometry(0.015, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.4,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(points[points.length - 1]);
      circuitGroup.add(dot);
    });

    // ── MIRROR FACES (faint copies in background) ──
    const mirrorFaces = new THREE.Group();
    scene.add(mirrorFaces);

    for (let i = 0; i < 4; i++) {
      const mirrorGeo = new THREE.SphereGeometry(0.6, 24, 24);
      mirrorGeo.scale(0.85, 1.05, 0.5);
      const mirrorMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0,
        wireframe: true,
      });
      const mirrorMesh = new THREE.Mesh(mirrorGeo, mirrorMat);
      const angle = (i / 4) * Math.PI * 2;
      mirrorMesh.position.set(
        Math.cos(angle) * 3.5,
        Math.sin(angle) * 1.5,
        -3 - Math.random() * 2
      );
      mirrorMesh.rotation.y = Math.random() * Math.PI;
      mirrorFaces.add(mirrorMesh);
    }

    const refs = {
      renderer,
      scene,
      camera,
      head,
      leftEye,
      rightEye,
      leftIris,
      rightIris,
      jawGroup,
      particles,
      glitchLines,
      codeRain,
      mirrorFaces,
      frameId: 0,
    };
    sceneRef.current = refs;

    // ── ANIMATION LOOP ──
    const clock = new THREE.Clock();

    const animate = () => {
      refs.frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Code rain fall
      const cp = codeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < codeCount; i++) {
        cp[i * 3 + 1] -= 0.015;
        if (cp[i * 3 + 1] < -5) cp[i * 3 + 1] = 5;
      }
      codeGeo.attributes.position.needsUpdate = true;

      // Glitch lines random flash
      glitchLines.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (Math.random() < 0.02) {
          mat.opacity = 0.3 + Math.random() * 0.5;
          child.position.x = (Math.random() - 0.5) * 4;
          child.position.y = (Math.random() - 0.5) * 3;
        } else {
          mat.opacity *= 0.92;
        }
      });

      // Energy rings rotation
      energyRings.forEach((ring, i) => {
        ring.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + i) * 0.1;
        (ring.material as THREE.MeshBasicMaterial).opacity =
          (0.1 - i * 0.015) + Math.sin(t * 2 + i) * 0.03;
      });

      // Aura pulse
      auraMat.opacity = 0.015 + Math.sin(t * 1.5) * 0.008;
      aura.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

      // Circuit dots pulse
      circuitGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity =
            0.3 + Math.sin(t * 3 + i * 0.5) * 0.3;
        }
      });

      // Mirror faces subtle pulse
      mirrorFaces.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.03 + Math.sin(t * 0.5 + i) * 0.02;
        child.rotation.y += 0.002;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Init scene
  useEffect(() => {
    const cleanup = initScene();
    return () => {
      cleanup?.();
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        sceneRef.current.renderer.dispose();
        if (
          containerRef.current &&
          sceneRef.current.renderer.domElement.parentNode === containerRef.current
        ) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current = null;
      }
    };
  }, [initScene]);

  // Phase transitions
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    let animId: number;
    const startTime = performance.now();

    const runPhase = () => {
      animId = requestAnimationFrame(runPhase);
      const elapsed = (performance.now() - startTime) / 1000;

      if (phase === "eyes") {
        // Show only eyes glowing from darkness
        s.head.visible = true;

        // Fade in eyes
        const eyeOpacity = Math.min(elapsed / 1.5, 1);
        (s.leftEye.material as THREE.MeshBasicMaterial).opacity = eyeOpacity * 0.9;
        (s.rightEye.material as THREE.MeshBasicMaterial).opacity = eyeOpacity * 0.9;
        (s.leftIris.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;
        (s.rightIris.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;

        // Eye point lights
        const lights = s.head.children.filter(
          (c) => c instanceof THREE.PointLight
        ) as THREE.PointLight[];
        lights.forEach((l) => {
          l.intensity = eyeOpacity * 1.5;
        });

        // Head barely visible
        s.head.children.forEach((child) => {
          if (
            child instanceof THREE.Mesh &&
            child !== s.leftEye &&
            child !== s.rightEye &&
            child !== s.leftIris &&
            child !== s.rightIris
          ) {
            const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
            if ("opacity" in mat) {
              mat.transparent = true;
              mat.opacity = Math.min(elapsed / 4, 0.1);
            }
          }
        });

        // Intense glitch during eyes phase
        s.glitchLines.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (Math.random() < 0.08) {
            mat.opacity = 0.5 + Math.random() * 0.5;
          }
        });
      }

      if (phase === "forming") {
        // Particles converge toward head
        const pArr = s.particles.geometry.attributes.position.array as Float32Array;
        const targets = s.particles.geometry.userData.targets as Float32Array;
        const progress = Math.min(elapsed / 3, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        for (let i = 0; i < pArr.length / 3; i++) {
          pArr[i * 3] += (targets[i * 3] - pArr[i * 3]) * eased * 0.03;
          pArr[i * 3 + 1] += (targets[i * 3 + 1] - pArr[i * 3 + 1]) * eased * 0.03;
          pArr[i * 3 + 2] += (targets[i * 3 + 2] - pArr[i * 3 + 2]) * eased * 0.03;
        }
        s.particles.geometry.attributes.position.needsUpdate = true;
        (s.particles.material as THREE.PointsMaterial).opacity = Math.max(
          0,
          0.8 - progress * 0.6
        );

        // Head materializes
        s.head.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
            if ("opacity" in mat) {
              mat.transparent = true;
              if (
                child === s.leftEye ||
                child === s.rightEye
              ) {
                mat.opacity = 0.9;
              } else if (
                child === s.leftIris ||
                child === s.rightIris
              ) {
                mat.opacity = 1;
              } else {
                mat.opacity = Math.min(progress * 1.5, 1);
              }
            }
          }
        });

        // Glitch reduces as face forms
        s.glitchLines.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity *= 0.95 - progress * 0.3;
        });
      }

      if (phase === "idle") {
        // Everything fully visible
        s.head.visible = true;
        (s.particles.material as THREE.PointsMaterial).opacity = 0.15;

        // Ensure full opacity
        s.head.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
            if ("opacity" in mat) {
              mat.transparent = true;
              if (child === s.leftEye || child === s.rightEye) {
                mat.opacity = 0.9;
              } else if (child === s.leftIris || child === s.rightIris) {
                mat.opacity = 1;
              } else {
                mat.opacity = 1;
              }
            }
          }
        });

        cancelAnimationFrame(animId);
      }
    };

    runPhase();
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Mouse parallax + eye tracking
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    let rafId: number;
    const track = () => {
      rafId = requestAnimationFrame(track);

      // Head subtle rotation following mouse
      const targetRotY = mousePos.x * 0.3;
      const targetRotX = -mousePos.y * 0.15;
      s.head.rotation.y += (targetRotY - s.head.rotation.y) * 0.05;
      s.head.rotation.x += (targetRotX - s.head.rotation.x) * 0.05;

      // Eye iris follow mouse
      const eyeTrackX = mousePos.x * 0.04;
      const eyeTrackY = mousePos.y * 0.03;
      s.leftIris.position.x = -0.3 + eyeTrackX;
      s.leftIris.position.y = 0.15 + eyeTrackY;
      s.rightIris.position.x = 0.3 + eyeTrackX;
      s.rightIris.position.y = 0.15 + eyeTrackY;

      // Eye color swirl effect
      const t = performance.now() * 0.001;
      const r = Math.sin(t * 2) * 0.05;
      const g = 0.4 + Math.sin(t * 1.5) * 0.2;
      const b = 0.8 + Math.sin(t * 3) * 0.2;
      (s.leftEye.material as THREE.MeshBasicMaterial).color.setRGB(r, g, b);
      (s.rightEye.material as THREE.MeshBasicMaterial).color.setRGB(r, g, b);

      // Idle head bob
      if (phase === "idle") {
        s.head.position.y = Math.sin(t * 0.8) * 0.03;
      }

      // Speaking jaw animation
      if (isSpeaking) {
        s.jawGroup.rotation.x = Math.sin(t * 8) * 0.06 + Math.sin(t * 13) * 0.03;
      } else {
        s.jawGroup.rotation.x *= 0.9;
      }

      // Camera parallax
      s.camera.position.x += (mousePos.x * 0.3 - s.camera.position.x) * 0.03;
      s.camera.position.y += (-mousePos.y * 0.2 - s.camera.position.y) * 0.03;
      s.camera.lookAt(0, 0, 0);
    };

    track();
    return () => cancelAnimationFrame(rafId);
  }, [mousePos, phase, isSpeaking]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
