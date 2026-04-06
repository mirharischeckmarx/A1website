"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Prevent double-mounting from creating duplicate renderers (React Strict Mode)
    if (containerRef.current.querySelector("canvas")) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create nodes
    const nodeCount = 50;
    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6
      );
      nodePositions.push(pos);

      const size = 0.08 + Math.random() * 0.12;
      const geometry = new THREE.SphereGeometry(size, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff9c,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      nodeMeshes.push(mesh);
      nodeGroup.add(mesh);
    }
    scene.add(nodeGroup);

    // Connections
    const lineGroup = new THREE.Group();
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 5) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          const material = new THREE.LineBasicMaterial({
            color: 0x00ff9c,
            transparent: true,
            opacity: 0.06,
          });
          lineGroup.add(new THREE.Line(geometry, material));
        }
      }
    }
    scene.add(lineGroup);

    // Data packets traveling along lines
    const packetCount = 20;
    const packets: {
      mesh: THREE.Mesh;
      start: THREE.Vector3;
      end: THREE.Vector3;
      progress: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < packetCount; i++) {
      const startIdx = Math.floor(Math.random() * nodeCount);
      let endIdx = Math.floor(Math.random() * nodeCount);
      if (endIdx === startIdx) endIdx = (endIdx + 1) % nodeCount;

      const geometry = new THREE.SphereGeometry(0.04, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      packets.push({
        mesh,
        start: nodePositions[startIdx],
        end: nodePositions[endIdx],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
      });
    }

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      nodeGroup.rotation.y += 0.001;
      lineGroup.rotation.y += 0.001;

      // Animate packets
      packets.forEach((packet) => {
        packet.progress += packet.speed;
        if (packet.progress > 1) {
          packet.progress = 0;
          packet.start =
            nodePositions[Math.floor(Math.random() * nodeCount)];
          packet.end =
            nodePositions[Math.floor(Math.random() * nodeCount)];
        }
        packet.mesh.position.lerpVectors(
          packet.start,
          packet.end,
          packet.progress
        );
      });

      // Pulse nodes
      const time = Date.now() * 0.001;
      nodeMeshes.forEach((mesh, i) => {
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 + Math.sin(time + i) * 0.3;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);

      // Dispose all geometries and materials to prevent WebGL context loss
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
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
