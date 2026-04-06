"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Prevent double-mounting from creating duplicate renderers (React Strict Mode)
    if (containerRef.current.querySelector("canvas")) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    // ── RENDERER ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030008, 0.02);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 300);
    camera.position.set(0, 2, 35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // ── LIGHTS (cinematic 3-point + volumetric) ──
    scene.add(new THREE.AmbientLight(0x0a0015, 0.3));

    const keyLight = new THREE.SpotLight(0xa100ff, 80, 80, Math.PI / 5, 0.5, 1);
    keyLight.position.set(-15, 20, 25);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00f0ff, 15, 60);
    fillLight.position.set(20, -8, 15);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x7500c0, 20, 50);
    rimLight.position.set(-5, -15, -10);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0x460073, 10, 40);
    topLight.position.set(0, 25, 0);
    scene.add(topLight);

    // Ground reflection plane (barely visible)
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x020005,
      metalness: 0.9,
      roughness: 0.4,
      transparent: true,
      opacity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -12;
    scene.add(ground);

    // ── CENTRAL ORB (hero piece — morphing crystalline sphere) ──
    const orbGeo = new THREE.IcosahedronGeometry(6, isMobile ? 16 : 32);
    const orbOriginal = Float32Array.from(orbGeo.attributes.position.array);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a0035,
      metalness: 0.4,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [100, 800],
      sheen: 1.0,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color(0xa100ff),
      transparent: true,
      opacity: 0.7,
      envMapIntensity: 2.0,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(10, 0, -5);
    scene.add(orb);

    // Glass outer shell
    const shellGeo = new THREE.IcosahedronGeometry(6.5, 6);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0xa100ff,
      metalness: 0,
      roughness: 0,
      transmission: 0.95,
      thickness: 0.5,
      transparent: true,
      opacity: 0.15,
      ior: 1.4,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.copy(orb.position);
    scene.add(shell);

    // Inner glow core
    const coreGeo = new THREE.SphereGeometry(2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xa100ff,
      transparent: true,
      opacity: 0.08,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(orb.position);
    scene.add(core);

    // ── ORBITAL RINGS ──
    const rings: THREE.Mesh[] = [];
    const ringConfigs = [
      { r: 9, tube: 0.03, tilt: 0.6, speed: 0.003, color: 0xa100ff, opacity: 0.2 },
      { r: 11, tube: 0.02, tilt: -0.4, speed: -0.002, color: 0x00f0ff, opacity: 0.12 },
      { r: 13, tube: 0.015, tilt: 0.2, speed: 0.001, color: 0x7500c0, opacity: 0.08 },
      { r: 8, tube: 0.04, tilt: 1.2, speed: -0.004, color: 0xa100ff, opacity: 0.15 },
    ];
    ringConfigs.forEach((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.r, cfg.tube, 6, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.copy(orb.position);
      ring.rotation.x = cfg.tilt;
      ring.userData = { speed: cfg.speed };
      rings.push(ring);
      scene.add(ring);
    });

    // ── FLOATING OBJECTS (satellite shapes) ──
    interface Satellite {
      mesh: THREE.Mesh;
      orbit: number;
      orbitSpeed: number;
      orbitRadius: number;
      yAmp: number;
      phase: number;
      rotSpeed: THREE.Vector3;
    }
    const satellites: Satellite[] = [];

    const satConfigs: { geo: THREE.BufferGeometry; size: number; dist: number; color: number }[] = [
      { geo: new THREE.OctahedronGeometry(0.8), size: 0.8, dist: 16, color: 0xa100ff },
      { geo: new THREE.TetrahedronGeometry(0.6), size: 0.6, dist: 20, color: 0x00f0ff },
      { geo: new THREE.BoxGeometry(0.7, 0.7, 0.7), size: 0.7, dist: 14, color: 0x7500c0 },
      { geo: new THREE.DodecahedronGeometry(0.5), size: 0.5, dist: 22, color: 0xa100ff },
      { geo: new THREE.IcosahedronGeometry(0.6), size: 0.6, dist: 18, color: 0x00f0ff },
      { geo: new THREE.TorusKnotGeometry(0.4, 0.15, 48, 6), size: 0.4, dist: 25, color: 0x7500c0 },
    ];

    if (!isMobile) {
      satConfigs.forEach((cfg, i) => {
        const mat = new THREE.MeshPhysicalMaterial({
          color: cfg.color,
          metalness: 0.8,
          roughness: 0.15,
          clearcoat: 0.8,
          transparent: true,
          opacity: 0.6,
          emissive: cfg.color,
          emissiveIntensity: 0.15,
        });
        const mesh = new THREE.Mesh(cfg.geo, mat);

        // Edge glow
        const edgeGeo = new THREE.EdgesGeometry(cfg.geo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.3,
        });
        const edges = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(edges);

        const angle = (i / satConfigs.length) * Math.PI * 2;
        mesh.position.set(
          orb.position.x + Math.cos(angle) * cfg.dist,
          (Math.random() - 0.5) * 10,
          orb.position.z + Math.sin(angle) * cfg.dist
        );
        scene.add(mesh);

        satellites.push({
          mesh,
          orbit: angle,
          orbitSpeed: 0.001 + Math.random() * 0.002,
          orbitRadius: cfg.dist,
          yAmp: 1 + Math.random() * 3,
          phase: Math.random() * Math.PI * 2,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.01
          ),
        });
      });
    }

    // ── STAR FIELD ──
    const starCount = isMobile ? 500 : 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 150;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 2] = -20 - Math.random() * 80;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── PURPLE DUST PARTICLES ──
    const dustCount = isMobile ? 200 : 600;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 80;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xa100ff,
      size: 0.05,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── LIGHT BEAMS (volumetric rays) ──
    for (let i = 0; i < 5; i++) {
      const beamGeo = new THREE.PlaneGeometry(0.3, 60);
      const beamMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xa100ff : 0x00f0ff,
        transparent: true,
        opacity: 0.015,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(
        orb.position.x + (i - 2) * 3,
        0,
        orb.position.z - 2
      );
      beam.rotation.z = (i - 2) * 0.15;
      scene.add(beam);
    }

    // ── MOUSE + SCROLL ──
    let mx = 0, my = 0, scrollY = 0;
    let targetMx = 0, targetMy = 0;
    const onMouse = (e: MouseEvent) => {
      targetMx = (e.clientX / w - 0.5) * 2;
      targetMy = (e.clientY / h - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── ANIMATION ──
    let frameId: number;
    const startTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation
      mx += (targetMx - mx) * 0.04;
      my += (targetMy - my) * 0.04;

      // ── Morph orb with complex noise ──
      const posArr = orbGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < posArr.length; i += 3) {
        const ox = orbOriginal[i], oy = orbOriginal[i + 1], oz = orbOriginal[i + 2];
        const noise =
          Math.sin(ox * 0.5 + t * 0.4) * 0.4 +
          Math.sin(oy * 0.7 + t * 0.3) * 0.3 +
          Math.sin(oz * 0.3 + t * 0.5) * 0.35 +
          Math.sin((ox + oy) * 0.4 + t * 0.6) * 0.15;
        const scale = 1 + noise * 0.12;
        posArr[i] = ox * scale;
        posArr[i + 1] = oy * scale;
        posArr[i + 2] = oz * scale;
      }
      orbGeo.attributes.position.needsUpdate = true;
      orbGeo.computeVertexNormals();

      orb.rotation.y += 0.0015;
      orb.rotation.x = Math.sin(t * 0.2) * 0.1;
      shell.rotation.y -= 0.001;
      shell.rotation.x = Math.sin(t * 0.15) * 0.05;
      shell.position.copy(orb.position);
      core.position.copy(orb.position);

      // Core pulse
      const pulse = 0.06 + Math.sin(t * 1.5) * 0.04;
      coreMat.opacity = pulse;
      core.scale.setScalar(1 + Math.sin(t * 2) * 0.1);

      // Orb iridescence shift
      orbMat.iridescenceThicknessRange = [
        100 + Math.sin(t * 0.5) * 50,
        800 + Math.sin(t * 0.3) * 200,
      ];

      // ── Rings orbit ──
      rings.forEach((ring) => {
        ring.rotation.z += ring.userData.speed;
        ring.rotation.y += ring.userData.speed * 0.5;
      });

      // ── Satellites orbit ──
      satellites.forEach((sat) => {
        sat.orbit += sat.orbitSpeed;
        sat.mesh.position.x = orb.position.x + Math.cos(sat.orbit) * sat.orbitRadius;
        sat.mesh.position.z = orb.position.z + Math.sin(sat.orbit) * sat.orbitRadius;
        sat.mesh.position.y = Math.sin(t * 0.5 + sat.phase) * sat.yAmp;
        sat.mesh.rotation.x += sat.rotSpeed.x;
        sat.mesh.rotation.y += sat.rotSpeed.y;
        sat.mesh.rotation.z += sat.rotSpeed.z;
      });

      // ── Dust drift ──
      const dp = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dp[i * 3 + 1] += 0.006;
        if (dp[i * 3 + 1] > 30) {
          dp[i * 3 + 1] = -30;
          dp[i * 3] = (Math.random() - 0.5) * 80;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // ── Camera (cinematic smooth) ──
      camera.position.x += (mx * 4 - camera.position.x) * 0.02;
      camera.position.y += (2 - my * 2 - camera.position.y) * 0.02;
      camera.position.z = 35 - Math.min(scrollY * 0.003, 5);
      camera.lookAt(orb.position);

      // ── Lights follow mouse ──
      keyLight.position.x = -15 + mx * 8;
      keyLight.position.y = 20 + my * -5;
      fillLight.position.x = 20 + mx * -5;
      fillLight.position.y = -8 + my * 3;

      renderer.render(scene, camera);
    };
    animate();

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
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
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
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
