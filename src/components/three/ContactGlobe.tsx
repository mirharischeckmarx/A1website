"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

/* ═══════════════════════════════════════════════════════════════════════
   OFFICE DATA — from A1tecno.com
   ═══════════════════════════════════════════════════════════════════════ */

const offices = [
  {
    region: "India",
    city: "Noida, Uttar Pradesh",
    address: "Platina Heights, A26, C Block Phase 2, Industrial Area, Sector 62, Noida, UP 201309",
    phone: "+91 1204365353",
    mobile: "+91 9796144420",
    lat: 28.6139,
    lng: 77.3726,
    countryId: "356",
  },
  {
    region: "UAE",
    city: "Dubai",
    address: "Rigga Business Centre 1001",
    phone: "+971 455 247 66",
    mobile: "+971 56 609 7324",
    lat: 25.2048,
    lng: 55.2708,
    countryId: "784",
  },
  {
    region: "South Africa",
    city: "Centurion, Gauteng",
    address: "1 Landmarks Avenue, Kosmosdaal Ext 11, Samrand, Centurion, Gauteng 0157",
    phone: "1-800-356-8933",
    mobile: "1-800-356-8933",
    lat: -25.8603,
    lng: 28.1894,
    countryId: "710",
  },
  {
    region: "Kenya",
    city: "Nairobi",
    address: "Reliance Centre, Nairobi",
    phone: "+254 001 0655",
    mobile: "+254 001 0655",
    lat: -1.2921,
    lng: 36.8219,
    countryId: "404",
  },
  {
    region: "USA",
    city: "Boston, MA",
    address: "224 Berkeley Street, 6th Floor, Boston, MA 02006",
    phone: "1-800-356-8933",
    mobile: "1-800-356-8933",
    lat: 42.3601,
    lng: -71.0589,
    countryId: "840",
  },
];

const officeCountryIds = new Set(offices.map((o) => o.countryId));

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GLOBE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function ContactGlobe({
  onSelectOffice,
  focusOffice,
}: {
  onSelectOffice?: (index: number) => void;
  focusOffice?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIdxRef = useRef(-1);
  const focusRequestRef = useRef<number | null>(null);
  const [, forceUpdate] = useState(0);

  const triggerSelect = useCallback(
    (idx: number) => {
      activeIdxRef.current = idx;
      forceUpdate((n) => n + 1);
      onSelectOffice?.(idx);
    },
    [onSelectOffice],
  );

  // When parent sets focusOffice, store it for the animation loop to pick up
  useEffect(() => {
    if (focusOffice !== undefined && focusOffice >= 0) {
      focusRequestRef.current = focusOffice;
    }
  }, [focusOffice]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.querySelector("canvas")) return;

    const w = el.clientWidth;
    const h = el.clientHeight;
    const mobile = w < 600;
    const R = mobile ? 3.8 : 4.5;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    camera.position.set(0, 1, mobile ? 12 : 10.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    /* ── Lights — tuned for teal-cyan metallic globe ── */
    scene.add(new THREE.AmbientLight(0x082020, 0.8));
    const keyLight = new THREE.DirectionalLight(0x55ccbb, 2.0);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x226655, 0.6);
    fillLight.position.set(-6, -3, 8);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xa100ff, 6, 30);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);
    const topLight = new THREE.PointLight(0x00aa88, 4, 25);
    topLight.position.set(0, 12, 3);
    scene.add(topLight);

    /* ── Globe group ── */
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    /* ── Metallic teal-cyan globe sphere ── */
    const baseGeo = new THREE.SphereGeometry(R * 0.998, 64, 64);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x062a2a,
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.97,
    });
    globeGroup.add(new THREE.Mesh(baseGeo, baseMat));

    /* ── Subtle latitude/longitude grid — teal tinted ── */
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x0d4a42,
      transparent: true,
      opacity: 0.18,
    });
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 3) pts.push(latLngToVec3(lat, lng, R * 1.001));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(latLngToVec3(lat, lng, R * 1.001));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    /* ── Atmospheric glow — teal inner, purple outer fringe ── */
    const atmosGeo = new THREE.SphereGeometry(R * 1.06, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x0aaa88,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    const midGlow = new THREE.SphereGeometry(R * 1.12, 48, 48);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0x11ccaa,
      transparent: true,
      opacity: 0.018,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(midGlow, midMat));

    const outerGlow = new THREE.SphereGeometry(R * 1.22, 48, 48);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x7733bb,
      transparent: true,
      opacity: 0.01,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(outerGlow, outerMat));

    /* ═══════════════════════════════════════════════════════
       COUNTRY OUTLINES — fetched from TopoJSON world atlas
    ═══════════════════════════════════════════════════════ */

    // Materials for country outlines — teal/cyan palette
    const normalCountryMat = new THREE.LineBasicMaterial({
      color: 0x11aa88,
      transparent: true,
      opacity: 0.0,
    });
    const officeCountryMat = new THREE.LineBasicMaterial({
      color: 0x22ddaa,
      transparent: true,
      opacity: 0.0,
    });

    // Track all country line objects for fade-in
    const countryLines: THREE.Line[] = [];
    let countriesLoaded = false;

    // Helper to draw a GeoJSON geometry ring on the globe
    function drawRing(
      coords: number[][],
      material: THREE.LineBasicMaterial,
    ) {
      if (coords.length < 2) return;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < coords.length; i++) {
        const [lng, lat] = coords[i];
        points.push(latLngToVec3(lat, lng, R * 1.003));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, material);
      globeGroup.add(line);
      countryLines.push(line);
    }

    function drawCountry(
      geometry: GeoJSON.Geometry,
      material: THREE.LineBasicMaterial,
    ) {
      if (geometry.type === "Polygon") {
        (geometry as GeoJSON.Polygon).coordinates.forEach((ring) =>
          drawRing(ring, material),
        );
      } else if (geometry.type === "MultiPolygon") {
        (geometry as GeoJSON.MultiPolygon).coordinates.forEach((polygon) =>
          polygon.forEach((ring) => drawRing(ring, material)),
        );
      }
    }

    // Fetch and render world map
    fetch("/data/world-110m.json")
      .then((r) => r.json())
      .then((topology: Topology<{ countries: GeometryCollection }>) => {
        const countries = feature(topology, topology.objects.countries);
        if (countries.type === "FeatureCollection") {
          countries.features.forEach((f) => {
            const id = String(f.id);
            const isOffice = officeCountryIds.has(id);
            const mat = isOffice ? officeCountryMat : normalCountryMat;
            if (f.geometry) drawCountry(f.geometry, mat);
          });
        }
        countriesLoaded = true;
      })
      .catch(() => {
        /* silently fail — globe still works without outlines */
      });

    /* ═══════════════════════════════════════════════════════
       LANDMARK DRAWING FUNCTIONS
       Each draws a famous world heritage silhouette on canvas
    ═══════════════════════════════════════════════════════ */

    function drawTajMahal(ctx: CanvasRenderingContext2D, cx: number, by: number, s: number, color: string) {
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      // Main dome
      ctx.beginPath();
      ctx.arc(cx, by - s * 0.55, s * 0.28, Math.PI, 0);
      ctx.fill();
      // Dome tip (finial)
      ctx.beginPath();
      ctx.moveTo(cx, by - s * 0.83);
      ctx.lineTo(cx - s * 0.02, by - s * 0.76);
      ctx.lineTo(cx + s * 0.02, by - s * 0.76);
      ctx.closePath();
      ctx.fill();
      // Main body
      ctx.fillRect(cx - s * 0.35, by - s * 0.32, s * 0.7, s * 0.32);
      // Left minaret
      ctx.fillRect(cx - s * 0.48, by - s * 0.6, s * 0.06, s * 0.6);
      ctx.beginPath();
      ctx.arc(cx - s * 0.45, by - s * 0.6, s * 0.04, Math.PI, 0);
      ctx.fill();
      // Right minaret
      ctx.fillRect(cx + s * 0.42, by - s * 0.6, s * 0.06, s * 0.6);
      ctx.beginPath();
      ctx.arc(cx + s * 0.45, by - s * 0.6, s * 0.04, Math.PI, 0);
      ctx.fill();
      // Arch doorway
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.arc(cx, by - s * 0.18, s * 0.08, Math.PI, 0);
      ctx.fillRect(cx - s * 0.08, by - s * 0.18, s * 0.16, s * 0.18);
      ctx.fill();
      // Platform base
      ctx.fillStyle = color;
      ctx.fillRect(cx - s * 0.5, by, s * 1.0, s * 0.04);
    }

    function drawBurjKhalifa(ctx: CanvasRenderingContext2D, cx: number, by: number, s: number, color: string) {
      ctx.fillStyle = color;
      // Main tower body — tapered
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.12, by);
      ctx.lineTo(cx - s * 0.1, by - s * 0.3);
      ctx.lineTo(cx - s * 0.08, by - s * 0.55);
      ctx.lineTo(cx - s * 0.04, by - s * 0.75);
      ctx.lineTo(cx - s * 0.015, by - s * 0.88);
      ctx.lineTo(cx, by - s * 1.0);
      ctx.lineTo(cx + s * 0.015, by - s * 0.88);
      ctx.lineTo(cx + s * 0.04, by - s * 0.75);
      ctx.lineTo(cx + s * 0.08, by - s * 0.55);
      ctx.lineTo(cx + s * 0.1, by - s * 0.3);
      ctx.lineTo(cx + s * 0.12, by);
      ctx.closePath();
      ctx.fill();
      // Step-back wings left
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.12, by);
      ctx.lineTo(cx - s * 0.2, by);
      ctx.lineTo(cx - s * 0.15, by - s * 0.35);
      ctx.lineTo(cx - s * 0.1, by - s * 0.35);
      ctx.closePath();
      ctx.fill();
      // Step-back wings right
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.12, by);
      ctx.lineTo(cx + s * 0.2, by);
      ctx.lineTo(cx + s * 0.15, by - s * 0.35);
      ctx.lineTo(cx + s * 0.1, by - s * 0.35);
      ctx.closePath();
      ctx.fill();
      // Horizontal section lines
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 0.8;
      for (let y = 0.15; y < 0.85; y += 0.1) {
        const w = 0.12 * (1 - y * 0.8);
        ctx.beginPath();
        ctx.moveTo(cx - s * w, by - s * y);
        ctx.lineTo(cx + s * w, by - s * y);
        ctx.stroke();
      }
      // Base
      ctx.fillStyle = color;
      ctx.fillRect(cx - s * 0.25, by, s * 0.5, s * 0.03);
    }

    function drawTableMountain(ctx: CanvasRenderingContext2D, cx: number, by: number, s: number, color: string) {
      ctx.fillStyle = color;
      // Flat-topped mountain silhouette
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.5, by);
      ctx.lineTo(cx - s * 0.4, by - s * 0.4);
      ctx.lineTo(cx - s * 0.35, by - s * 0.55);
      ctx.lineTo(cx - s * 0.25, by - s * 0.6);
      // Flat top
      ctx.lineTo(cx + s * 0.25, by - s * 0.6);
      ctx.lineTo(cx + s * 0.35, by - s * 0.55);
      ctx.lineTo(cx + s * 0.4, by - s * 0.4);
      ctx.lineTo(cx + s * 0.5, by);
      ctx.closePath();
      ctx.fill();
      // Cloud/mist layer across the top
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.ellipse(cx, by - s * 0.58, s * 0.35, s * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
      // Lion's Head side peak
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.4, by - s * 0.4);
      ctx.lineTo(cx + s * 0.52, by - s * 0.42);
      ctx.lineTo(cx + s * 0.55, by - s * 0.3);
      ctx.lineTo(cx + s * 0.5, by);
      ctx.fill();
    }

    function drawMaasaiGiraffe(ctx: CanvasRenderingContext2D, cx: number, by: number, s: number, color: string) {
      ctx.fillStyle = color;
      // Giraffe silhouette (iconic Kenya wildlife)
      // Body
      ctx.beginPath();
      ctx.ellipse(cx + s * 0.05, by - s * 0.25, s * 0.2, s * 0.1, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Neck (long, slightly curved)
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.08, by - s * 0.3);
      ctx.quadraticCurveTo(cx - s * 0.12, by - s * 0.55, cx - s * 0.08, by - s * 0.75);
      ctx.lineTo(cx - s * 0.02, by - s * 0.73);
      ctx.quadraticCurveTo(cx - s * 0.05, by - s * 0.5, cx + s * 0.0, by - s * 0.3);
      ctx.closePath();
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.ellipse(cx - s * 0.05, by - s * 0.78, s * 0.06, s * 0.035, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Horns (ossicones)
      ctx.fillRect(cx - s * 0.07, by - s * 0.85, s * 0.015, s * 0.06);
      ctx.fillRect(cx - s * 0.03, by - s * 0.84, s * 0.015, s * 0.055);
      // Tip balls
      ctx.beginPath();
      ctx.arc(cx - s * 0.063, by - s * 0.855, s * 0.012, 0, Math.PI * 2);
      ctx.arc(cx - s * 0.023, by - s * 0.845, s * 0.012, 0, Math.PI * 2);
      ctx.fill();
      // Front legs
      ctx.fillRect(cx - s * 0.06, by - s * 0.17, s * 0.035, s * 0.17);
      ctx.fillRect(cx + s * 0.0, by - s * 0.17, s * 0.035, s * 0.17);
      // Back legs
      ctx.fillRect(cx + s * 0.12, by - s * 0.2, s * 0.035, s * 0.2);
      ctx.fillRect(cx + s * 0.2, by - s * 0.18, s * 0.035, s * 0.18);
      // Tail
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.24, by - s * 0.3);
      ctx.quadraticCurveTo(cx + s * 0.32, by - s * 0.2, cx + s * 0.3, by - s * 0.12);
      ctx.stroke();
      // Acacia tree behind
      ctx.fillStyle = color;
      ctx.fillRect(cx + s * 0.35, by - s * 0.35, s * 0.025, s * 0.35);
      ctx.beginPath();
      ctx.ellipse(cx + s * 0.36, by - s * 0.38, s * 0.12, s * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStatueOfLiberty(ctx: CanvasRenderingContext2D, cx: number, by: number, s: number, color: string) {
      ctx.fillStyle = color;
      // Pedestal base
      ctx.fillRect(cx - s * 0.15, by - s * 0.08, s * 0.3, s * 0.08);
      ctx.fillRect(cx - s * 0.12, by - s * 0.25, s * 0.24, s * 0.17);
      // Body/robe
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.1, by - s * 0.25);
      ctx.lineTo(cx - s * 0.12, by - s * 0.5);
      ctx.lineTo(cx - s * 0.08, by - s * 0.65);
      ctx.lineTo(cx - s * 0.06, by - s * 0.72);
      // Head
      ctx.lineTo(cx - s * 0.04, by - s * 0.78);
      ctx.lineTo(cx + s * 0.04, by - s * 0.78);
      ctx.lineTo(cx + s * 0.06, by - s * 0.72);
      ctx.lineTo(cx + s * 0.08, by - s * 0.65);
      ctx.lineTo(cx + s * 0.1, by - s * 0.5);
      ctx.lineTo(cx + s * 0.1, by - s * 0.25);
      ctx.closePath();
      ctx.fill();
      // Crown spikes
      const crownCx = cx;
      const crownCy = by - s * 0.78;
      for (let a = 0; a < 7; a++) {
        const angle = -Math.PI * 0.85 + (a / 6) * Math.PI * 0.7;
        ctx.beginPath();
        ctx.moveTo(crownCx + Math.cos(angle) * s * 0.04, crownCy + Math.sin(angle) * s * 0.04);
        ctx.lineTo(crownCx + Math.cos(angle) * s * 0.1, crownCy + Math.sin(angle) * s * 0.1);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
      // Torch arm (raised right)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.06, by - s * 0.65);
      ctx.lineTo(cx + s * 0.16, by - s * 0.88);
      ctx.lineTo(cx + s * 0.2, by - s * 0.88);
      ctx.lineTo(cx + s * 0.1, by - s * 0.62);
      ctx.closePath();
      ctx.fill();
      // Torch flame
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx + s * 0.18, by - s * 0.92, s * 0.035, s * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tablet arm (left)
      ctx.fillRect(cx - s * 0.14, by - s * 0.52, s * 0.06, s * 0.15);
    }

    const landmarkDrawers = [drawTajMahal, drawBurjKhalifa, drawTableMountain, drawMaasaiGiraffe, drawStatueOfLiberty];
    const landmarkNames = ["Taj Mahal", "Burj Khalifa", "Table Mountain", "Maasai Wildlife", "Statue of Liberty"];

    /* ═══════════════════════════════════════════════════════
       OFFICE MARKERS + LANDMARK SPRITES
    ═══════════════════════════════════════════════════════ */

    interface MarkerData {
      position: THREE.Vector3;
      dot: THREE.Mesh;
      ring: THREE.Mesh;
      beam: THREE.Mesh;
      pulseRing: THREE.Mesh;
      label: THREE.Sprite;
      landmark: THREE.Sprite;
    }
    const markers: MarkerData[] = [];

    const markerGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const ringGeoM = new THREE.TorusGeometry(0.2, 0.018, 8, 32);
    const beamGeo = new THREE.CylinderGeometry(0.012, 0.045, 1.4, 8);
    const pulseGeo = new THREE.TorusGeometry(0.28, 0.012, 4, 32);

    offices.forEach((office, i) => {
      const pos = latLngToVec3(office.lat, office.lng, R);

      // Glowing dot
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xa100ff, transparent: true, opacity: 0.9 });
      const dot = new THREE.Mesh(markerGeo, dotMat);
      dot.position.copy(pos);
      globeGroup.add(dot);

      // Rotating ring
      const ringMatM = new THREE.MeshBasicMaterial({ color: 0xa100ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
      const ring = new THREE.Mesh(ringGeoM, ringMatM);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      globeGroup.add(ring);

      // Beam shooting outward
      const beamMatM = new THREE.MeshBasicMaterial({ color: 0xa100ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
      const beam = new THREE.Mesh(beamGeo, beamMatM);
      const outDir = pos.clone().normalize();
      beam.position.copy(pos.clone().add(outDir.clone().multiplyScalar(0.7)));
      beam.lookAt(pos.clone().add(outDir.clone().multiplyScalar(5)));
      beam.rotateX(Math.PI / 2);
      globeGroup.add(beam);

      // Expanding pulse ring
      const pulseMatM = new THREE.MeshBasicMaterial({ color: 0xa100ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
      const pulseRing = new THREE.Mesh(pulseGeo, pulseMatM);
      pulseRing.position.copy(pos);
      pulseRing.lookAt(0, 0, 0);
      globeGroup.add(pulseRing);

      /* ── Landmark sprite — drawn silhouette of world heritage ── */
      const lmCanvas = document.createElement("canvas");
      lmCanvas.width = 200;
      lmCanvas.height = 200;
      const lmCtx = lmCanvas.getContext("2d")!;
      lmCtx.clearRect(0, 0, 200, 200);
      // Draw the landmark silhouette in glowing teal
      landmarkDrawers[i](lmCtx, 100, 160, 140, "rgba(17, 204, 170, 0.85)");
      // Landmark name below
      lmCtx.fillStyle = "rgba(17, 204, 170, 0.7)";
      lmCtx.font = "bold 11px sans-serif";
      lmCtx.textAlign = "center";
      lmCtx.fillText(landmarkNames[i], 100, 180);

      const lmTex = new THREE.CanvasTexture(lmCanvas);
      const lmSpriteMat = new THREE.SpriteMaterial({ map: lmTex, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
      const lmSprite = new THREE.Sprite(lmSpriteMat);
      const lmPos = pos.clone().normalize().multiplyScalar(R + 0.4);
      lmSprite.position.copy(lmPos);
      lmSprite.scale.set(1.1, 1.1, 1);
      globeGroup.add(lmSprite);

      /* ── Info label sprite — region + city + phone ── */
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 90;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 300, 90);
      ctx.fillStyle = "rgba(4, 12, 30, 0.88)";
      ctx.beginPath();
      ctx.roundRect(0, 0, 300, 90, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(17, 204, 170, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Left accent bar
      ctx.fillStyle = "#11ccaa";
      ctx.fillRect(0, 0, 3, 90);
      // Region
      ctx.fillStyle = "#A100FF";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(office.region, 14, 24);
      // Landmark name
      ctx.fillStyle = "#11ccaa";
      ctx.font = "11px sans-serif";
      ctx.fillText(landmarkNames[i], 14, 42);
      // City
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.fillText(office.city, 14, 60);
      // Phone
      ctx.fillStyle = "#6a8a9a";
      ctx.font = "10px sans-serif";
      ctx.fillText(office.phone, 14, 78);

      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos.clone().normalize().multiplyScalar(R + 2.0));
      sprite.scale.set(2.6, 0.8, 1);
      globeGroup.add(sprite);

      markers.push({ position: pos, dot, ring, beam, pulseRing, label: sprite, landmark: lmSprite });

      // Connecting line from surface to label
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        pos.clone().normalize().multiplyScalar(R + 0.15),
        pos.clone().normalize().multiplyScalar(R + 1.5),
      ]);
      const lineMatM = new THREE.LineBasicMaterial({ color: 0x11ccaa, transparent: true, opacity: 0.15 });
      const connLine = new THREE.Line(lineGeo, lineMatM);
      (sprite as unknown as { connLine: THREE.Line }).connLine = connLine;
      globeGroup.add(connLine);
    });

    /* ── Connection arcs between offices — teal with purple hint ── */
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x22aa88,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < offices.length; i++) {
      for (let j = i + 1; j < offices.length; j++) {
        const start = latLngToVec3(offices[i].lat, offices[i].lng, R);
        const end = latLngToVec3(offices[j].lat, offices[j].lng, R);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dist = start.distanceTo(end);
        mid.normalize().multiplyScalar(R + dist * 0.22);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        globeGroup.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
            arcMat,
          ),
        );
      }
    }

    /* ── Background stars ── */
    const starCount = mobile ? 300 : 800;
    const starGeo2 = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 2] = -15 - Math.random() * 30;
    }
    starGeo2.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo2,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.06,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    /* ── Mouse interaction ── */
    let mx = 0,
      my = 0,
      targetMx = 0,
      targetMy = 0;
    let isDragging = false;
    let dragStartX = 0;
    let autoRotateSpeed = 0.0018;
    let dragRotation = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMx = (e.clientX / w - 0.5) * 2;
      targetMy = (e.clientY / h - 0.5) * 2;
      if (isDragging) {
        dragRotation += (e.clientX - dragStartX) * 0.004;
        dragStartX = e.clientX;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      autoRotateSpeed = 0.0004;
    };
    const onMouseUp = () => {
      isDragging = false;
      autoRotateSpeed = 0.0018;
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    /* ── Animation loop ── */
    let frameId: number;
    const t0 = performance.now();
    let flashTimer = 0;
    let currentFlashIdx = 0;
    let countryFadeIn = 0;

    // Focus state — when user clicks an office card
    let isFocused = false;       // true = globe is locked on a country
    let focusTargetY = 0;        // target Y rotation to face the country
    let focusPauseTimer = 0;     // how long to stay focused before resuming auto
    const FOCUS_HOLD_SECONDS = 6; // hold focus for 6 seconds then resume

    // Compute the Y rotation needed to face a given office location
    function getTargetRotationY(officeIdx: number): number {
      const o = offices[officeIdx];
      // Convert longitude to globe rotation: globe rotates around Y axis
      // The globe's default orientation has lng=0 facing camera
      // To face a longitude, we need rotation.y = -lng * PI/180
      // But we also need to account for the current camera angle
      const lngRad = -(o.lng + 20) * (Math.PI / 180); // +20 offset so it's slightly left of center
      return lngRad;
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - t0) * 0.001;

      mx += (targetMx - mx) * 0.05;
      my += (targetMy - my) * 0.05;

      // Check for new focus request from parent
      if (focusRequestRef.current !== null) {
        const reqIdx = focusRequestRef.current;
        focusRequestRef.current = null;
        currentFlashIdx = reqIdx;
        triggerSelect(reqIdx);
        isFocused = true;
        focusPauseTimer = 0;
        focusTargetY = getTargetRotationY(reqIdx);
        autoRotateSpeed = 0; // stop auto-rotation immediately
      }

      if (isFocused) {
        // Smoothly rotate globe to face the target country
        let deltaY = focusTargetY - globeGroup.rotation.y;
        // Normalize to [-PI, PI] for shortest path
        while (deltaY > Math.PI) deltaY -= Math.PI * 2;
        while (deltaY < -Math.PI) deltaY += Math.PI * 2;
        globeGroup.rotation.y += deltaY * 0.04; // smooth interpolation

        // Hold timer
        focusPauseTimer += 0.016;
        if (focusPauseTimer > FOCUS_HOLD_SECONDS) {
          isFocused = false;
          autoRotateSpeed = 0.0018; // resume auto-rotation
          flashTimer = 0; // reset flash timer so it doesn't immediately switch
        }
      } else {
        // Normal auto-rotation
        globeGroup.rotation.y += autoRotateSpeed;
        globeGroup.rotation.y += dragRotation * 0.05;
        dragRotation *= 0.92;

        // Auto flash sequence — every 3.5 seconds
        flashTimer += 0.016;
        if (flashTimer > 3.5) {
          flashTimer = 0;
          currentFlashIdx = (currentFlashIdx + 1) % offices.length;
          triggerSelect(currentFlashIdx);
        }
      }

      globeGroup.rotation.x = my * 0.08 + 0.12;

      // Country outline fade-in after data loads
      if (countriesLoaded && countryFadeIn < 1) {
        countryFadeIn = Math.min(1, countryFadeIn + 0.015);
        normalCountryMat.opacity = countryFadeIn * 0.25;
        officeCountryMat.opacity = countryFadeIn * 0.6;
      }

      // Animate markers
      markers.forEach((m, i) => {
        const isActive = i === currentFlashIdx;

        // Dot
        const dotMat = m.dot.material as THREE.MeshBasicMaterial;
        const pScale = 1 + Math.sin(t * 3 + i) * 0.15;
        m.dot.scale.setScalar(isActive ? pScale * 1.6 : pScale);
        dotMat.opacity += ((isActive ? 1.0 : 0.6) - dotMat.opacity) * 0.1;

        // Ring
        m.ring.rotation.z = t * 0.5 + i;
        const rMat = m.ring.material as THREE.MeshBasicMaterial;
        rMat.opacity += ((isActive ? 0.8 : 0.25) - rMat.opacity) * 0.1;
        m.ring.scale.setScalar(isActive ? 1.4 + Math.sin(t * 2) * 0.1 : 1);

        // Beam
        const bMat = m.beam.material as THREE.MeshBasicMaterial;
        bMat.opacity += ((isActive ? 0.6 : 0.12) - bMat.opacity) * 0.1;

        // Pulse ring
        const pMat = m.pulseRing.material as THREE.MeshBasicMaterial;
        if (isActive) {
          const pulseT = (t * 0.7) % 1;
          m.pulseRing.scale.setScalar(1 + pulseT * 2.5);
          pMat.opacity = (1 - pulseT) * 0.45;
        } else {
          pMat.opacity *= 0.94;
        }

        // Label + connector line
        const lMat = m.label.material as THREE.SpriteMaterial;
        const targetLabelOpacity = isActive ? 1.0 : 0;
        lMat.opacity += (targetLabelOpacity - lMat.opacity) * 0.07;
        const connLine = (m.label as unknown as { connLine?: THREE.Line })
          .connLine;
        if (connLine) {
          (connLine.material as THREE.LineBasicMaterial).opacity =
            lMat.opacity * 0.3;
        }

        // Landmark sprite — always slightly visible, brighter when active
        const lmMat = m.landmark.material as THREE.SpriteMaterial;
        const targetLmOpacity = isActive ? 1.0 : 0.35;
        lmMat.opacity += (targetLmOpacity - lmMat.opacity) * 0.06;
        // Subtle floating animation
        const lmBaseScale = isActive ? 1.3 : 0.9;
        const lmPulse = 1 + Math.sin(t * 1.5 + i * 1.2) * 0.04;
        m.landmark.scale.setScalar(lmBaseScale * lmPulse);
      });

      // Camera parallax
      camera.position.x = mx * 0.8;
      camera.position.y = 1 - my * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);

      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Line ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.Sprite
        ) {
          if ("geometry" in obj && obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else if (obj.material) {
            const mat = obj.material as THREE.Material & {
              map?: THREE.Texture;
            };
            if (mat.map) mat.map.dispose();
            mat.dispose();
          }
        }
      });

      renderer.dispose();
      if (el && renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [triggerSelect]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { offices };
