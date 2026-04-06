"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DataStreamBG() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    // ── VERTICAL DATA STREAMS ──
    const streamCount = isMobile ? 30 : 80;
    const streamGroup = new THREE.Group();

    for (let i = 0; i < streamCount; i++) {
      const height = 2 + Math.random() * 6;
      const geo = new THREE.PlaneGeometry(0.015, height);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.7 ? 0x0088ff : 0x00ff9c,
        transparent: true,
        opacity: 0.04 + Math.random() * 0.08,
        blending: THREE.AdditiveBlending,
      });
      const stream = new THREE.Mesh(geo, mat);
      stream.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        -3 - Math.random() * 8
      );
      stream.userData.speed = 0.01 + Math.random() * 0.03;
      streamGroup.add(stream);
    }
    scene.add(streamGroup);

    // ── ATTACK PULSES (expanding rings) ──
    const pulseGroup = new THREE.Group();
    scene.add(pulseGroup);

    const createPulse = () => {
      const geo = new THREE.RingGeometry(0.05, 0.08, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xff3355 : 0xff8800,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const pulse = new THREE.Mesh(geo, mat);
      pulse.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        -2 - Math.random() * 4
      );
      pulse.userData.age = 0;
      pulse.userData.maxAge = 2 + Math.random() * 3;
      pulseGroup.add(pulse);
    };

    // Initial pulses
    for (let i = 0; i < (isMobile ? 5 : 12); i++) createPulse();

    // ── HEX GRID (faint background) ──
    const hexGroup = new THREE.Group();
    const hexSize = 0.4;
    const cols = isMobile ? 10 : 20;
    const rows = isMobile ? 8 : 14;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * hexSize * 1.8 + (r % 2 === 0 ? 0 : hexSize * 0.9);
        const y = (r - rows / 2) * hexSize * 1.6;
        const geo = new THREE.CircleGeometry(hexSize * 0.4, 6);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x00ff9c,
          transparent: true,
          opacity: 0.01,
          wireframe: true,
        });
        const hex = new THREE.Mesh(geo, mat);
        hex.position.set(x, y, -10);
        hexGroup.add(hex);
      }
    }
    scene.add(hexGroup);

    // ── FLOATING NODES ──
    const nodeCount = isMobile ? 15 : 40;
    const nodeGroup = new THREE.Group();
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const geo = new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.3,
      });
      const node = new THREE.Mesh(geo, mat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        -1 - Math.random() * 5
      );
      node.position.copy(pos);
      nodePositions.push(pos);
      nodeGroup.add(node);
    }

    // Node connections
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 3) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          const mat = new THREE.LineBasicMaterial({
            color: 0x0066ff,
            transparent: true,
            opacity: 0.04,
          });
          nodeGroup.add(new THREE.Line(geo, mat));
        }
      }
    }
    scene.add(nodeGroup);

    // ── ANIMATION ──
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Data streams fall
      streamGroup.children.forEach((child) => {
        child.position.y -= child.userData.speed;
        if (child.position.y < -6) child.position.y = 6;
      });

      // Pulses expand and fade
      const toRemove: THREE.Mesh[] = [];
      pulseGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.userData.age += 0.016;
        const progress = mesh.userData.age / mesh.userData.maxAge;
        mesh.scale.setScalar(1 + progress * 8);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 * (1 - progress);
        if (progress >= 1) toRemove.push(mesh);
      });
      toRemove.forEach((m) => {
        pulseGroup.remove(m);
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });

      // Spawn new pulses
      if (Math.random() < 0.01) createPulse();

      // Hex grid subtle pulse
      hexGroup.children.forEach((child, i) => {
        (child as THREE.Mesh).material &&
          ((
            (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          ).opacity = 0.01 + Math.sin(t * 0.5 + i * 0.1) * 0.008);
      });

      // Nodes drift
      nodeGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(t + child.position.x) * 0.0005;
          child.position.x += Math.cos(t * 0.5 + child.position.y) * 0.0003;
        }
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
      renderer.dispose();
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
