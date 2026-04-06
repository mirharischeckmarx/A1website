"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AppSecurityViz() {
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

    // Central shield — icosahedron wireframe
    const shieldGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, wireframe: true, transparent: true, opacity: 0.12,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);

    // Inner solid core
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c, transparent: true, opacity: 0.04,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Orbiting torus rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.TorusGeometry(2.5, 0.02, 8, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, transparent: true, opacity: 0.2,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = i === 0 ? Math.PI / 3 : -Math.PI / 4;
      ring.rotation.z = i * Math.PI / 2;
      rings.push(ring);
      group.add(ring);
    }

    // Code blocks orbiting
    const blockCount = isMobile ? 20 : 40;
    interface CodeBlock { mesh: THREE.Mesh; angle: number; radius: number; yOffset: number; speed: number; }
    const blocks: CodeBlock[] = [];
    for (let i = 0; i < blockCount; i++) {
      const size = 0.06 + Math.random() * 0.06;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc, transparent: true, opacity: 0.4 + Math.random() * 0.3,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      const yOffset = (Math.random() - 0.5) * 3;
      mesh.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );
      blocks.push({ mesh, angle, radius, yOffset, speed: 0.002 + Math.random() * 0.003 });
      group.add(mesh);
    }

    // Background dust particles
    const pCount = isMobile ? 100 : 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00ff9c, size: 0.02, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pGeo, pMat));

    // Scan pulse timer
    let pulseTimer = 0;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Shield rotation
      shield.rotation.x += 0.002;
      shield.rotation.y += 0.003;
      core.rotation.x -= 0.001;
      core.rotation.y -= 0.002;

      // Rings
      rings[0].rotation.z += 0.004;
      rings[1].rotation.z -= 0.003;
      rings[0].rotation.y += 0.001;

      // Code blocks orbit
      blocks.forEach((block) => {
        block.angle += block.speed;
        block.mesh.position.x = Math.cos(block.angle) * block.radius;
        block.mesh.position.z = Math.sin(block.angle) * block.radius;
        block.mesh.position.y = block.yOffset + Math.sin(t + block.angle) * 0.3;
        block.mesh.rotation.x += 0.01;
        block.mesh.rotation.y += 0.01;
      });

      // Scan pulse — shield brightens periodically
      pulseTimer += 0.016;
      if (pulseTimer > 3) {
        pulseTimer = 0;
      }
      if (pulseTimer < 0.5) {
        const p = pulseTimer / 0.5;
        shieldMat.opacity = 0.12 + Math.sin(p * Math.PI) * 0.2;
        coreMat.opacity = 0.04 + Math.sin(p * Math.PI) * 0.06;
      } else {
        shieldMat.opacity = 0.12;
        coreMat.opacity = 0.04;
      }

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
