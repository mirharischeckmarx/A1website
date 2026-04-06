"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CyberGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for mobile - simplified rendering
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe wireframe
    const globeGeometry = new THREE.SphereGeometry(
      1.5,
      isMobile ? 24 : 48,
      isMobile ? 24 : 48
    );
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff9c,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Inner glow sphere
    const innerGeometry = new THREE.SphereGeometry(1.48, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff9c,
      transparent: true,
      opacity: 0.02,
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(inner);

    // Network nodes on globe surface
    const nodeCount = isMobile ? 40 : 80;
    const nodes: THREE.Vector3[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.012, 6, 6);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff9c,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const pos = new THREE.Vector3(
        1.52 * Math.cos(theta) * Math.sin(phi),
        1.52 * Math.sin(theta) * Math.sin(phi),
        1.52 * Math.cos(phi)
      );
      nodes.push(pos);
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.copy(pos);
      scene.add(nodeMesh);
    }

    // Connection lines between nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff9c,
      transparent: true,
      opacity: 0.1,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.0) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i],
            nodes[j],
          ]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        }
      }
    }

    // Attack lines (animated arcs)
    const attackLines: {
      line: THREE.Line;
      progress: number;
      speed: number;
    }[] = [];

    const createAttackLine = () => {
      const startIdx = Math.floor(Math.random() * nodes.length);
      let endIdx = Math.floor(Math.random() * nodes.length);
      if (endIdx === startIdx) endIdx = (endIdx + 1) % nodes.length;

      const start = nodes[startIdx];
      const end = nodes[endIdx];
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.2);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(30);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.6,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);

      attackLines.push({ line, progress: 0, speed: 0.005 + Math.random() * 0.01 });
    };

    // Create initial attack lines
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
      createAttackLine();
    }

    // Particle system
    const particleCount = isMobile ? 200 : 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ff9c,
      size: 0.015,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Outer ring
    const ringGeometry = new THREE.RingGeometry(2.0, 2.02, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff9c,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.5;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(2.3, 2.32, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00ff9c,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      })
    );
    ring2.rotation.x = Math.PI * 0.35;
    ring2.rotation.z = Math.PI * 0.25;
    scene.add(ring2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      globe.rotation.y += 0.002;
      globe.rotation.x = mouseY * 0.3;
      inner.rotation.y += 0.002;
      ring.rotation.z += 0.001;
      ring2.rotation.z -= 0.0015;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Animate particles
      const positions = particleGeometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.002;
        if (positions[i * 3 + 1] < -4) {
          positions[i * 3 + 1] = 4;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Animate attack lines
      attackLines.forEach((attack, idx) => {
        attack.progress += attack.speed;
        if (attack.progress > 1) {
          scene.remove(attack.line);
          attack.line.geometry.dispose();
          (attack.line.material as THREE.Material).dispose();
          attackLines.splice(idx, 1);
          createAttackLine();
        } else {
          (attack.line.material as THREE.LineBasicMaterial).opacity =
            Math.sin(attack.progress * Math.PI) * 0.6;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
