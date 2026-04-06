"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.querySelector("canvas")) return;

    const size = 40;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x332255, 0.6));

    const keyLight = new THREE.DirectionalLight(0xccaaff, 2.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6633cc, 1.0);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa100ff, 4, 15);
    rimLight.position.set(-2, 2, -3);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0x4400aa, 2, 10);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    /* ── Logo group ── */
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    /* ── Material — metallic purple chrome ── */
    const logoMat = new THREE.MeshPhysicalMaterial({
      color: 0x8800dd,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      emissive: 0x330066,
      emissiveIntensity: 0.2,
      iridescence: 0.6,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 600],
    });

    /* ── Glow material (additive inner glow) ── */
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xa100ff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const depth = 0.35;

    /* ── "A" character — built from 3 box geometries ── */
    // Left leg of A
    const aLeftGeo = new THREE.BoxGeometry(0.2, 1.6, depth);
    const aLeft = new THREE.Mesh(aLeftGeo, logoMat);
    aLeft.position.set(-0.5, 0, 0);
    aLeft.rotation.z = 0.18;
    logoGroup.add(aLeft);

    // Right leg of A
    const aRightGeo = new THREE.BoxGeometry(0.2, 1.6, depth);
    const aRight = new THREE.Mesh(aRightGeo, logoMat);
    aRight.position.set(0.18, 0, 0);
    aRight.rotation.z = -0.18;
    logoGroup.add(aRight);

    // Crossbar of A
    const aCrossGeo = new THREE.BoxGeometry(0.55, 0.15, depth);
    const aCross = new THREE.Mesh(aCrossGeo, logoMat);
    aCross.position.set(-0.15, -0.1, 0);
    logoGroup.add(aCross);

    // Top peak of A (pyramid cap)
    const aTopGeo = new THREE.ConeGeometry(0.18, 0.25, 4);
    const aTop = new THREE.Mesh(aTopGeo, logoMat);
    aTop.position.set(-0.15, 0.9, 0);
    aTop.rotation.y = Math.PI / 4;
    logoGroup.add(aTop);

    /* ── "1" character ── */
    // Main vertical bar
    const oneBarGeo = new THREE.BoxGeometry(0.2, 1.6, depth);
    const oneBar = new THREE.Mesh(oneBarGeo, logoMat);
    oneBar.position.set(0.85, 0, 0);
    logoGroup.add(oneBar);

    // Top serif/flag
    const oneFlagGeo = new THREE.BoxGeometry(0.35, 0.15, depth);
    const oneFlag = new THREE.Mesh(oneFlagGeo, logoMat);
    oneFlag.position.set(0.72, 0.65, 0);
    oneFlag.rotation.z = 0.3;
    logoGroup.add(oneFlag);

    // Bottom base
    const oneBaseGeo = new THREE.BoxGeometry(0.5, 0.12, depth);
    const oneBase = new THREE.Mesh(oneBaseGeo, logoMat);
    oneBase.position.set(0.85, -0.8, 0);
    logoGroup.add(oneBase);

    /* ── Inner glow shell ── */
    const glowGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    logoGroup.add(glowMesh);

    /* ── Edge highlight lines ── */
    logoGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child !== glowMesh) {
        const edges = new THREE.EdgesGeometry(child.geometry);
        const edgeMat = new THREE.LineBasicMaterial({
          color: 0xcc77ff,
          transparent: true,
          opacity: 0.25,
        });
        const edgeLines = new THREE.LineSegments(edges, edgeMat);
        edgeLines.position.copy(child.position);
        edgeLines.rotation.copy(child.rotation);
        logoGroup.add(edgeLines);
      }
    });

    // Center the group slightly
    logoGroup.position.set(-0.25, 0, 0);
    logoGroup.scale.setScalar(0.85);

    /* ── Mouse hover tracking ── */
    let hoverX = 0, hoverY = 0;
    let targetHoverX = 0, targetHoverY = 0;
    const onMouseEnter = () => { targetHoverX = 0.3; };
    const onMouseLeave = () => { targetHoverX = 0; targetHoverY = 0; };
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetHoverX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetHoverY = ((e.clientY - rect.top) / rect.height - 0.5) * -0.6;
    };
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mousemove", onMouseMove);

    /* ── Animation ── */
    let frameId: number;
    const t0 = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - t0) * 0.001;

      hoverX += (targetHoverX - hoverX) * 0.08;
      hoverY += (targetHoverY - hoverY) * 0.08;

      // Gentle idle rotation + mouse influence
      logoGroup.rotation.y = Math.sin(t * 0.6) * 0.15 + hoverX;
      logoGroup.rotation.x = Math.sin(t * 0.4) * 0.05 + hoverY;

      // Subtle breathing scale
      const breathe = 1 + Math.sin(t * 1.2) * 0.015;
      logoGroup.scale.setScalar(0.85 * breathe);

      // Glow pulse
      glowMat.opacity = 0.05 + Math.sin(t * 2) * 0.03;

      // Rim light orbit
      rimLight.position.x = Math.cos(t * 0.8) * 3;
      rimLight.position.z = Math.sin(t * 0.8) * 3 - 1;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mousemove", onMouseMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      renderer.dispose();
      if (el && renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[40px] h-[40px] cursor-pointer"
      style={{ contain: "layout paint" }}
    />
  );
}
