"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InfoSecurityViz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("canvas")) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Lock body — wireframe box
    const lockBodyGeo = new THREE.BoxGeometry(1.5, 1.2, 0.3);
    const lockBodyMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.2,
    });
    const lockBody = new THREE.Mesh(lockBodyGeo, lockBodyMat);
    lockBody.position.y = -0.5;
    group.add(lockBody);

    // Lock body solid inner
    const lockInnerGeo = new THREE.BoxGeometry(1.4, 1.1, 0.25);
    const lockInnerMat = new THREE.MeshBasicMaterial({
      color: 0x0044aa, transparent: true, opacity: 0.03,
    });
    const lockInner = new THREE.Mesh(lockInnerGeo, lockInnerMat);
    lockInner.position.y = -0.5;
    group.add(lockInner);

    // Lock shackle — torus
    const shackleGeo = new THREE.TorusGeometry(0.6, 0.1, 8, 32, Math.PI);
    const shackleMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, transparent: true, opacity: 0.3,
    });
    const shackle = new THREE.Mesh(shackleGeo, shackleMat);
    shackle.position.y = 0.2;
    shackle.rotation.z = Math.PI;
    group.add(shackle);

    // Keyhole — small torus
    const keyholeGeo = new THREE.TorusGeometry(0.12, 0.03, 6, 16);
    const keyholeMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, transparent: true, opacity: 0.5,
    });
    const keyhole = new THREE.Mesh(keyholeGeo, keyholeMat);
    keyhole.position.set(0, -0.5, 0.16);
    group.add(keyhole);

    // Keyhole slot
    const slotGeo = new THREE.PlaneGeometry(0.04, 0.2);
    const slotMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
    });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.set(0, -0.6, 0.16);
    group.add(slot);

    // Orbiting keys (octahedrons)
    const keyCount = 3;
    interface Key { mesh: THREE.Mesh; angle: number; speed: number; docking: boolean; dockProgress: number; }
    const keys: Key[] = [];
    for (let i = 0; i < keyCount; i++) {
      const geo = new THREE.OctahedronGeometry(0.15);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / keyCount) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 0.5, 0);
      keys.push({ mesh, angle, speed: 0.008, docking: false, dockProgress: 0 });
      group.add(mesh);
    }

    // Outer ring
    const outerRingGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, transparent: true, opacity: 0.08,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    group.add(outerRing);

    // Encryption data rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1.8 + i * 0.5, 0.008, 4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, transparent: true, opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.3;
      group.add(ring);
    }

    // Spiral particles
    const pCount = isMobile ? 80 : 150;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 3;
      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;
      pSpeeds[i] = 0.005 + Math.random() * 0.01;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0088ff, size: 0.025, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pGeo, pMat));

    // Dock timer
    let dockTimer = 0;
    let dockKeyIdx = 0;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Lock rotation
      group.rotation.y = Math.sin(t * 0.3) * 0.3;

      // Outer ring pulse
      outerRingMat.opacity = 0.05 + Math.sin(t * 1.5) * 0.03;

      // Keys orbit
      keys.forEach((key) => {
        if (!key.docking) {
          key.angle += key.speed;
          key.mesh.position.x = Math.cos(key.angle) * 2.5;
          key.mesh.position.y = Math.sin(key.angle * 2) * 0.8;
          key.mesh.position.z = Math.sin(key.angle) * 2.5;
        } else {
          // Docking animation — move toward keyhole
          key.dockProgress += 0.02;
          const target = new THREE.Vector3(0, -0.5, 0.5);
          key.mesh.position.lerp(target, key.dockProgress * 0.1);
          if (key.dockProgress > 1) {
            key.docking = false;
            key.dockProgress = 0;
          }
        }
        key.mesh.rotation.x += 0.02;
        key.mesh.rotation.y += 0.015;
      });

      // Trigger dock every 4s
      dockTimer += 0.016;
      if (dockTimer > 4) {
        dockTimer = 0;
        keys[dockKeyIdx].docking = true;
        keys[dockKeyIdx].dockProgress = 0;
        dockKeyIdx = (dockKeyIdx + 1) % keyCount;
      }

      // Particles spiral
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        const angle = Math.atan2(z, x) + pSpeeds[i];
        const radius = Math.sqrt(x * x + z * z);
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
