"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DataSecurityViz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("canvas")) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    // Data pipes (cylindrical wireframes)
    const pipeCount = isMobile ? 4 : 8;
    const pipes: THREE.Mesh[] = [];
    for (let i = 0; i < pipeCount; i++) {
      const geo = new THREE.CylinderGeometry(0.4, 0.4, 8, 12, 1, true);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.04,
      });
      const pipe = new THREE.Mesh(geo, mat);
      pipe.position.set((i - pipeCount / 2 + 0.5) * 1.6, 0, (i % 2) * -1.5);
      pipes.push(pipe);
      scene.add(pipe);
    }

    // Data stream bars falling inside pipes
    const barCount = isMobile ? 80 : 200;
    interface DataBar { mesh: THREE.Mesh; pipeIdx: number; speed: number; }
    const bars: DataBar[] = [];

    for (let i = 0; i < barCount; i++) {
      const pipeIdx = Math.floor(Math.random() * pipeCount);
      const barH = 0.3 + Math.random() * 1.2;
      const geo = new THREE.PlaneGeometry(0.02, barH);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff9c, transparent: true,
        opacity: 0.05 + Math.random() * 0.08,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.3;
      mesh.position.set(
        pipes[pipeIdx].position.x + Math.cos(angle) * r,
        (Math.random() - 0.5) * 8,
        pipes[pipeIdx].position.z + Math.sin(angle) * r
      );
      mesh.rotation.z = Math.random() * 0.2;
      scene.add(mesh);
      bars.push({ mesh, pipeIdx, speed: 0.01 + Math.random() * 0.04 });
    }

    // Flowing particles inside pipes
    const particleCount = isMobile ? 200 : 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pPipeIdx = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const pi = Math.floor(Math.random() * pipeCount);
      pPipeIdx[i] = pi;
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.35;
      pPos[i * 3] = pipes[pi].position.x + Math.cos(a) * r;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = pipes[pi].position.z + Math.sin(a) * r;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00ffcc, size: 0.03, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Breach alert timer
    let breachTimer = 0;
    let breachPipe = -1;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Rotate pipes slowly
      pipes.forEach((p, i) => { p.rotation.y += 0.002; });

      // Bars fall
      bars.forEach((bar) => {
        bar.mesh.position.y -= bar.speed;
        if (bar.mesh.position.y < -4) bar.mesh.position.y = 4;
      });

      // Particles fall
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] -= 0.02 + Math.random() * 0.01;
        if (pos[i * 3 + 1] < -4) pos[i * 3 + 1] = 4;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Breach alert flash
      breachTimer += 0.016;
      if (breachTimer > 3) {
        breachTimer = 0;
        if (breachPipe >= 0) {
          (pipes[breachPipe].material as THREE.MeshBasicMaterial).color.setHex(0x0088ff);
          (pipes[breachPipe].material as THREE.MeshBasicMaterial).opacity = 0.04;
        }
        breachPipe = Math.floor(Math.random() * pipeCount);
        (pipes[breachPipe].material as THREE.MeshBasicMaterial).color.setHex(0xff3355);
        (pipes[breachPipe].material as THREE.MeshBasicMaterial).opacity = 0.12;
      }
      if (breachPipe >= 0 && breachTimer > 0.5) {
        (pipes[breachPipe].material as THREE.MeshBasicMaterial).color.setHex(0x0088ff);
        (pipes[breachPipe].material as THREE.MeshBasicMaterial).opacity = 0.04;
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
