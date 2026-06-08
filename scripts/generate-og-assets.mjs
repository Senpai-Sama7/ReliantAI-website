#!/usr/bin/env node
/**
 * Generates brand image assets (Open Graph card, logo, favicons, apple-touch-icon)
 * deterministically from inline SVG using sharp. No external image model required.
 *
 * Run: node scripts/generate-og-assets.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');

const ORANGE = '#ff6e00';
const ORANGE_LIGHT = '#ff8c33';
const DARK = '#0a0a0a';
const FONT = "'DejaVu Sans','Liberation Sans','Arial',sans-serif";

/** Orange rounded-square "N" monogram drawn as vector paths (font-independent). */
function monogram(size, radius) {
  const stroke = size * 0.16;
  const inset = size * 0.26;
  const top = inset;
  const bottom = size - inset;
  const left = inset;
  const right = size - inset;
  return `
    <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="${ORANGE}"/>
    <path d="M ${left} ${bottom} L ${left} ${top} L ${right} ${bottom} L ${right} ${top}"
      fill="none" stroke="#ffffff" stroke-width="${stroke}"
      stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="78%" cy="42%" r="60%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.35"/>
      <stop offset="55%" stop-color="${ORANGE}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${DARK}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ORANGE}"/>
      <stop offset="100%" stop-color="${ORANGE_LIGHT}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${DARK}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- decorative orbit -->
  <circle cx="960" cy="300" r="240" fill="none" stroke="${ORANGE}" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="960" cy="300" r="160" fill="none" stroke="${ORANGE}" stroke-opacity="0.25" stroke-width="2"/>
  <circle cx="960" cy="140" r="8" fill="${ORANGE}"/>

  <!-- monogram -->
  <g transform="translate(90,96)">
    ${monogram(120, 26)}
  </g>

  <!-- wordmark -->
  <text x="232" y="186" font-family="${FONT}" font-size="64" font-weight="bold" fill="#ffffff" letter-spacing="2">RELIANT</text>
  <text x="232" y="186" font-family="${FONT}" font-size="64" font-weight="bold" fill="#ffffff" letter-spacing="2" opacity="0"> </text>
  <text x="${232 + 312}" y="186" font-family="${FONT}" font-size="64" font-weight="bold" fill="${ORANGE}" letter-spacing="2">AI</text>

  <!-- headline -->
  <text x="92" y="356" font-family="${FONT}" font-size="78" font-weight="bold" fill="#ffffff">Luxury Web Design</text>
  <text x="92" y="446" font-family="${FONT}" font-size="78" font-weight="bold" fill="${ORANGE}">Redefined.</text>

  <!-- divider -->
  <rect x="94" y="486" width="120" height="6" rx="3" fill="url(#bar)"/>

  <!-- subline -->
  <text x="92" y="542" font-family="${FONT}" font-size="30" fill="#cfcfcf">Custom React &amp; TypeScript sites for Houston businesses</text>
  <text x="92" y="586" font-family="${FONT}" font-size="26" fill="#9a9a9a">150+ projects · 98% satisfaction · 90+ PageSpeed · reliantai.org</text>
</svg>`;

const logoSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${monogram(size, size * 0.2)}
</svg>`;

async function run() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const tasks = [
    { name: 'og-image.png', svg: ogSvg, w: 1200, h: 630 },
    { name: 'og-image.jpg', svg: ogSvg, w: 1200, h: 630, jpeg: true },
    { name: 'logo.png', svg: logoSvg(512), w: 512, h: 512 },
    { name: 'apple-touch-icon.png', svg: logoSvg(180), w: 180, h: 180 },
    { name: 'favicon-32.png', svg: logoSvg(32), w: 32, h: 32 },
    { name: 'favicon-16.png', svg: logoSvg(16), w: 16, h: 16 },
  ];

  for (const t of tasks) {
    const buf = Buffer.from(t.svg);
    let pipeline = sharp(buf, { density: 384 }).resize(t.w, t.h, { fit: 'contain' });
    pipeline = t.jpeg
      ? pipeline.jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
      : pipeline.png({ compressionLevel: 9 });
    await pipeline.toFile(resolve(PUBLIC_DIR, t.name));
    console.log(`generated public/${t.name} (${t.w}x${t.h})`);
  }

  // Crisp scalable favicon (modern browsers + AI crawlers).
  const { writeFile } = await import('node:fs/promises');
  await writeFile(resolve(PUBLIC_DIR, 'favicon.svg'), logoSvg(64).trim() + '\n', 'utf8');
  console.log('generated public/favicon.svg');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
