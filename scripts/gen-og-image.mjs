import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const OG_DIR = join(PUBLIC, "og");
mkdirSync(OG_DIR, { recursive: true });

const W = 1200;
const H = 630;

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[c]));
}

function buildSvg({ eyebrow, line1, line2, tagline, badge }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#A100FF" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#A100FF" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="purpleLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A100FF" stop-opacity="0" />
      <stop offset="50%" stop-color="#A100FF" stop-opacity="1" />
      <stop offset="100%" stop-color="#A100FF" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#A100FF" stroke-width="1" stroke-opacity="0.05" />
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="#000000" />
  <rect width="${W}" height="${H}" fill="url(#grid)" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />

  <rect x="0" y="20" width="${W}" height="2" fill="url(#purpleLine)" opacity="0.6" />
  <rect x="0" y="${H - 22}" width="${W}" height="2" fill="url(#purpleLine)" opacity="0.6" />

  <g transform="translate(80, 100)">
    <rect x="0" y="0" width="6" height="36" fill="#A100FF" />
    <text x="22" y="28" font-family="-apple-system, system-ui, sans-serif"
          font-size="20" font-weight="500" fill="#A100FF"
          letter-spacing="6">${escapeXml(eyebrow)}</text>
  </g>

  <text x="80" y="290" font-family="-apple-system, system-ui, sans-serif"
        font-size="84" font-weight="700" fill="#ffffff" letter-spacing="-2">
    ${escapeXml(line1)}
  </text>
  <text x="80" y="390" font-family="-apple-system, system-ui, sans-serif"
        font-size="84" font-weight="700" fill="#A100FF" letter-spacing="-2">
    ${escapeXml(line2)}
  </text>

  <text x="80" y="470" font-family="-apple-system, system-ui, sans-serif"
        font-size="28" font-weight="400" fill="#A2A2A0">
    ${escapeXml(tagline)}
  </text>

  <g transform="translate(80, 530)">
    <circle cx="6" cy="6" r="6" fill="#A100FF" />
    <text x="22" y="12" font-family="-apple-system, system-ui, sans-serif"
          font-size="16" font-weight="500" fill="#ffffff" letter-spacing="3">
      ${escapeXml(badge)}
    </text>
  </g>

  <g transform="translate(${W - 280}, 100)" opacity="0.5">
    <circle cx="100" cy="100" r="80" fill="none" stroke="#A100FF" stroke-width="1" stroke-opacity="0.3" />
    <circle cx="100" cy="100" r="120" fill="none" stroke="#A100FF" stroke-width="1" stroke-opacity="0.2" />
    <circle cx="100" cy="100" r="160" fill="none" stroke="#A100FF" stroke-width="1" stroke-opacity="0.1" />
    <circle cx="100" cy="100" r="6" fill="#A100FF" />
    <circle cx="180" cy="100" r="3" fill="#A100FF" opacity="0.8" />
    <circle cx="100" cy="220" r="3" fill="#A100FF" opacity="0.8" />
    <circle cx="20" cy="100" r="3" fill="#A100FF" opacity="0.8" />
    <circle cx="100" cy="-20" r="3" fill="#A100FF" opacity="0.8" />
    <line x1="100" y1="100" x2="180" y2="100" stroke="#A100FF" stroke-width="1" stroke-opacity="0.4" />
    <line x1="100" y1="100" x2="100" y2="220" stroke="#A100FF" stroke-width="1" stroke-opacity="0.4" />
    <line x1="100" y1="100" x2="20" y2="100" stroke="#A100FF" stroke-width="1" stroke-opacity="0.4" />
    <line x1="100" y1="100" x2="100" y2="-20" stroke="#A100FF" stroke-width="1" stroke-opacity="0.4" />
  </g>
</svg>`;
}

const pages = [
  {
    slug: "home",
    out: join(PUBLIC, "og-image.png"),
    eyebrow: "A1 TECHNOLOGY",
    line1: "Enterprise",
    line2: "Cybersecurity.",
    tagline: "Cloud · Network · Application · Data — protected.",
    badge: "24/7 SOC · 5 COUNTRIES · 50+ CLIENTS",
  },
  {
    slug: "about",
    out: join(OG_DIR, "about.png"),
    eyebrow: "ABOUT A1",
    line1: "Global Cyber",
    line2: "Resilience.",
    tagline: "Building enterprise-grade defenses since 2020.",
    badge: "5 COUNTRIES · 30+ PARTNERS · 60+ PROJECTS",
  },
  {
    slug: "cases",
    out: join(OG_DIR, "cases.png"),
    eyebrow: "CASE STUDIES",
    line1: "Real Threats.",
    line2: "Real Defenses.",
    tagline: "Banking, government, healthcare — proven outcomes.",
    badge: "RANSOMWARE · ZERO TRUST · COMPLIANCE",
  },
  {
    slug: "contact",
    out: join(OG_DIR, "contact.png"),
    eyebrow: "CONTACT",
    line1: "Talk to the",
    line2: "Engineers.",
    tagline: "Direct access to certified security experts. No scripts.",
    badge: "NOIDA · DUBAI · CENTURION · NAIROBI · BOSTON",
  },
  {
    slug: "services",
    out: join(OG_DIR, "services.png"),
    eyebrow: "SERVICES",
    line1: "Full-Spectrum",
    line2: "Security.",
    tagline: "Network · Cloud · Application · Data · Managed SOC.",
    badge: "SIEM · SOAR · XDR · DLP · MSSP · NGFW",
  },
  {
    slug: "solutions",
    out: join(OG_DIR, "solutions.png"),
    eyebrow: "SOLUTIONS",
    line1: "Enterprise IT,",
    line2: "End to End.",
    tagline: "Managed services, cloud migration, AI, custom software.",
    badge: "AWS · AZURE · GCP · AI · AUTOMATION",
  },
  {
    slug: "technology",
    out: join(OG_DIR, "technology.png"),
    eyebrow: "PARTNERS",
    line1: "Best-in-Class",
    line2: "Stack.",
    tagline: "40+ industry-leading technology partners.",
    badge: "CROWDSTRIKE · FORTINET · PALO ALTO · CHECK POINT",
  },
];

for (const p of pages) {
  const svg = buildSvg(p);
  writeFileSync(p.out.replace(/\.png$/, ".svg"), svg);
  await sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(p.out);
  console.log("Wrote", p.out);
}
