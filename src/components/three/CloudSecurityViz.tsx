"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CloudSecurityViz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 1, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Cloud spheres (wireframe)
    const clouds: THREE.Mesh[] = [];
    const cloudPositions = [
      new THREE.Vector3(0, 3, -2),
      new THREE.Vector3(-4, 2.5, -3),
      new THREE.Vector3(4, 3.5, -4),
    ];
    cloudPositions.forEach((pos) => {
      const geo = new THREE.SphereGeometry(1.5, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff9c, wireframe: true, transparent: true, opacity: 0.04,
      });
      const cloud = new THREE.Mesh(geo, mat);
      cloud.position.copy(pos);
      cloud.scale.set(1.3, 0.8, 1);
      clouds.push(cloud);
      group.add(cloud);

      // Shield ring orbiting each cloud
      const ringGeo = new THREE.TorusGeometry(2, 0.015, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, transparent: true, opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      cloud.userData.ring = ring;
      group.add(ring);
    });

    // Server racks
    const serverCount = isMobile ? 4 : 8;
    const servers: THREE.Mesh[] = [];
    for (let i = 0; i < serverCount; i++) {
      const geo = new THREE.BoxGeometry(0.4, 0.6, 0.2);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x0088ff, wireframe: true, transparent: true, opacity: 0.3,
      });
      const server = new THREE.Mesh(geo, mat);
      const col = i % 4;
      const row = Math.floor(i / 4);
      server.position.set((col - 1.5) * 2, -1.5 + row * 1.5, row * -1);
      servers.push(server);
      group.add(server);

      // LED indicators on servers
      for (let j = 0; j < 3; j++) {
        const ledGeo = new THREE.SphereGeometry(0.02, 4, 4);
        const ledMat = new THREE.MeshBasicMaterial({
          color: 0x00ff9c, transparent: true, opacity: 0.6,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(
          server.position.x - 0.12 + j * 0.12,
          server.position.y + 0.2,
          server.position.z + 0.11
        );
        group.add(led);
      }
    }

    // Connection lines from servers to nearest cloud
    servers.forEach((server) => {
      let nearest = cloudPositions[0];
      let minDist = server.position.distanceTo(nearest);
      cloudPositions.forEach((cp) => {
        const d = server.position.distanceTo(cp);
        if (d < minDist) { minDist = d; nearest = cp; }
      });
      const geo = new THREE.BufferGeometry().setFromPoints([server.position, nearest]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x0066ff, transparent: true, opacity: 0.06,
      });
      group.add(new THREE.Line(geo, mat));
    });

    // Upload particles (drifting upward)
    const pCount = isMobile ? 150 : 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00ffcc, size: 0.025, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pGeo, pMat));

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Clouds rotate
      clouds.forEach((cloud, i) => {
        cloud.rotation.y += 0.0005;
        const ring = cloud.userData.ring as THREE.Mesh;
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + i) * 0.2;
        ring.rotation.z += 0.005 * (i % 2 === 0 ? 1 : -1);
      });

      // Servers bob
      servers.forEach((server, i) => {
        server.position.y = (-1.5 + Math.floor(i / 4) * 1.5) + Math.sin(t + i * 0.8) * 0.08;
      });

      // Particles drift up
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += 0.008;
        if (pos[i * 3 + 1] > 5) {
          pos[i * 3 + 1] = -5;
          pos[i * 3] = (Math.random() - 0.5) * 12;
        }
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
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current)
        containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
