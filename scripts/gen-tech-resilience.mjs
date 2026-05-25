import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_WEBP = join(__dirname, "..", "public", "images", "content", "tech-resilience.webp");
const OUT_SVG = join(__dirname, "..", "public", "images", "content", "tech-resilience.svg");

const S = 1080;

function ringPath(cx, cy, r, eccentricity = 0, tilt = 0) {
  const rx = r;
  const ry = r * (1 - eccentricity);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${tilt} ${cx} ${cy})" fill="none" />`;
}

const cx = S / 2;
const cy = S / 2;

// Orbital ring layer — many semi-transparent concentric / tilted ellipses
const orbitalRings = [];
const ringCount = 28;
for (let i = 0; i < ringCount; i++) {
  const t = i / (ringCount - 1);
  const r = 130 + t * 240;
  const ecc = 0.05 + Math.random() * 0.35;
  const tilt = -45 + Math.random() * 90;
  const hue = i < ringCount / 2 ? "#00C8DC" : "#7ABF6F";
  const opacity = 0.18 + Math.random() * 0.25;
  const strokeW = 0.6 + Math.random() * 0.6;
  orbitalRings.push(
    `<g stroke="${hue}" stroke-opacity="${opacity}" stroke-width="${strokeW}">${ringPath(cx, cy, r, ecc, tilt)}</g>`
  );
}

// Inner dots — sparse "circuit" feel inside the center sphere
const innerNodes = [];
for (let i = 0; i < 22; i++) {
  const a = Math.random() * Math.PI * 2;
  const rr = Math.random() * 90;
  const nx = cx + Math.cos(a) * rr;
  const ny = cy + Math.sin(a) * rr;
  const size = 1 + Math.random() * 2.5;
  const hue = Math.random() > 0.4 ? "#00FFE0" : "#7CFC00";
  innerNodes.push(`<circle cx="${nx}" cy="${ny}" r="${size}" fill="${hue}" opacity="${0.5 + Math.random() * 0.4}" />`);
}

// Connect a few of them with thin lines for "circuit traces"
const traces = [];
for (let i = 0; i < 12; i++) {
  const a1 = Math.random() * Math.PI * 2;
  const a2 = a1 + (Math.random() - 0.5) * 1.5;
  const r1 = Math.random() * 80;
  const r2 = Math.random() * 80;
  const x1 = cx + Math.cos(a1) * r1;
  const y1 = cy + Math.sin(a1) * r1;
  const x2 = cx + Math.cos(a2) * r2;
  const y2 = cy + Math.sin(a2) * r2;
  traces.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00C8DC" stroke-opacity="0.35" stroke-width="0.6" />`);
}

// Stars in the outer black field
const stars = [];
for (let i = 0; i < 80; i++) {
  const sx = Math.random() * S;
  const sy = Math.random() * S;
  const sr = Math.random() * 1.1;
  const op = 0.2 + Math.random() * 0.5;
  stars.push(`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#ffffff" opacity="${op}" />`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#04141a"/>
      <stop offset="55%" stop-color="#020a10"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="core" cx="50%" cy="50%" r="22%">
      <stop offset="0%" stop-color="#001f1c" stop-opacity="1"/>
      <stop offset="60%" stop-color="#011a18" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rim" cx="50%" cy="50%" r="50%">
      <stop offset="80%" stop-color="rgba(0,200,220,0)" />
      <stop offset="98%" stop-color="rgba(0,200,220,0.35)" />
      <stop offset="100%" stop-color="rgba(0,200,220,0)" />
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>
  </defs>

  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <g>${stars.join("")}</g>

  <g filter="url(#soft)">${orbitalRings.join("")}</g>

  <circle cx="${cx}" cy="${cy}" r="105" fill="url(#core)" />
  <circle cx="${cx}" cy="${cy}" r="105" fill="none" stroke="#00C8DC" stroke-opacity="0.45" stroke-width="0.8"/>

  <g>${traces.join("")}</g>
  <g>${innerNodes.join("")}</g>

  <circle cx="${cx}" cy="${cy}" r="${S * 0.42}" fill="url(#rim)"/>
</svg>`;

writeFileSync(OUT_SVG, svg);

await sharp(Buffer.from(svg))
  .webp({ quality: 88 })
  .toFile(OUT_WEBP);

console.log("Wrote", OUT_WEBP);
console.log("Wrote", OUT_SVG);
