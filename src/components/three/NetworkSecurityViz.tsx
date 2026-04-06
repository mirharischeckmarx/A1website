"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NetworkSecurityViz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("canvas")) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Nodes
    const nodeCount = isMobile ? 30 : 60;
    const hubCount = 5;
    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const isHub = i < hubCount;
      const size = isHub ? 0.2 : 0.06 + Math.random() * 0.08;
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: isHub ? 0x0088ff : 0x00ff9c,
        transparent: true, opacity: isHub ? 0.8 : 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      );
      mesh.position.copy(pos);
      nodePositions.push(pos);
      nodeMeshes.push(mesh);
      graphGroup.add(mesh);
    }

    // Connection lines
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 4) {
          const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          const mat = new THREE.LineBasicMaterial({
            color: 0x00ff9c, transparent: true, opacity: 0.04,
          });
          graphGroup.add(new THREE.Line(geo, mat));
        }
      }
    }

    // Data packets traveling between nodes
    const packetCount = isMobile ? 12 : 25;
    interface Packet { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number; }
    const packets: Packet[] = [];

    for (let i = 0; i < packetCount; i++) {
      const geo = new THREE.SphereGeometry(0.04, 4, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      graphGroup.add(mesh);
      packets.push({
        mesh,
        start: nodePositions[Math.floor(Math.random() * nodeCount)],
        end: nodePositions[Math.floor(Math.random() * nodeCount)],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
      });
    }

    // Scan wave ring
    const scanGeo = new THREE.RingGeometry(0.1, 0.15, 32);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0xff3355, transparent: true, opacity: 0, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const scanRing = new THREE.Mesh(scanGeo, scanMat);
    graphGroup.add(scanRing);
    let scanActive = false;
    let scanProgress = 0;
    let scanCenter = new THREE.Vector3();
    let scanTimer = 0;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      graphGroup.rotation.y += 0.001;

      // Node pulse
      nodeMeshes.forEach((mesh, i) => {
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          (i < hubCount ? 0.6 : 0.3) + Math.sin(t * 2 + i) * 0.2;
      });

      // Packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.start = nodePositions[Math.floor(Math.random() * nodeCount)];
          p.end = nodePositions[Math.floor(Math.random() * nodeCount)];
        }
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

      // Scan wave
      scanTimer += 0.016;
      if (!scanActive && scanTimer > 4) {
        scanActive = true;
        scanProgress = 0;
        scanTimer = 0;
        const hubIdx = Math.floor(Math.random() * hubCount);
        scanCenter.copy(nodePositions[hubIdx]);
        scanRing.position.copy(scanCenter);
      }

      if (scanActive) {
        scanProgress += 0.015;
        const scale = 1 + scanProgress * 40;
        scanRing.scale.setScalar(scale);
        scanMat.opacity = 0.3 * (1 - scanProgress);

        // Color nearby nodes red during scan
        nodeMeshes.forEach((mesh, i) => {
          if (i >= hubCount) {
            const dist = mesh.position.distanceTo(scanCenter);
            if (dist < scanProgress * 12 && dist > (scanProgress - 0.05) * 12) {
              (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xff3355);
              setTimeout(() => {
                (mesh.material as THREE.MeshBasicMaterial).color.setHex(0x00ff9c);
              }, 300);
            }
          }
        });

        if (scanProgress > 1) {
          scanActive = false;
          scanMat.opacity = 0;
          scanRing.scale.setScalar(1);
        }
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
