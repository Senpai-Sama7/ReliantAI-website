#!/usr/bin/env node
/**
 * Generates the Reliant AI favicon set from an inline vector mark using sharp.
 *
 * Mark: chamfered steel-plate square in brand orange with an angular,
 * plasma-cut "R" monogram in charcoal. Industrial/premium; legible at 16px.
 *
 * Outputs (public/):
 *   favicon.svg, mask-icon.svg,
 *   favicon-16.png, favicon-32.png, apple-touch-icon.png (180),
 *   favicon-192.png, favicon-512.png
 *
 * Run: node scripts/generate-favicons.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');

const ORANGE = '#ff6e00';
const ORANGE_HI = '#ff8324';   // top of plate gradient
const ORANGE_LO = '#f06000';   // bottom of plate gradient
const CHARCOAL = '#141414';
const DARK_BG = '#0f0f0f';

/**
 * All geometry lives in a 64x64 viewBox.
 * Plate: square with 10-unit chamfered (45°) corners — machined-plate silhouette.
 * Glyph: angular "R" (stem + chamfered bowl with counter + diagonal leg),
 * stroke weight 9 (≈2.25px at 16px), counter 6 units tall.
 */
const PLATE_PATH = 'M10 0 H54 L64 10 V54 L54 64 H10 L0 54 V10 Z';

// Non-overlapping subpaths (required so the mask-icon even-odd knockout works).
const GLYPH = {
  stem: 'M16.5 13 H25.5 V51 H16.5 Z',
  bowlOuter: 'M25.5 13 H40.5 L47.5 20 V28 L40.5 35 H25.5 Z',
  counter: 'M25.5 21 H36 L39 24 L36 27 H25.5 Z',
  leg: 'M31 35 H40 L47.5 51 H38.5 Z',
};

/** Full-color mark: orange plate + charcoal R. `detail` adds the inner bevel line. */
function markSvg({ detail = true, flat = false } = {}) {
  const plateFill = flat
    ? `<path d="${PLATE_PATH}" fill="${ORANGE}"/>`
    : `<defs>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${ORANGE_HI}"/>
          <stop offset="55%" stop-color="${ORANGE}"/>
          <stop offset="100%" stop-color="${ORANGE_LO}"/>
        </linearGradient>
      </defs>
      <path d="${PLATE_PATH}" fill="url(#plate)"/>`;

  const bevel = detail
    ? `<path d="M11.2 3 H52.8 L61 11.2 V52.8 L52.8 61 H11.2 L3 52.8 V11.2 Z"
        fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.25"/>`
    : '';

  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  ${plateFill}
  ${bevel}
  <g fill="${CHARCOAL}">
    <path d="${GLYPH.stem}"/>
    <path fill-rule="evenodd" d="${GLYPH.bowlOuter} ${GLYPH.counter}"/>
    <path d="${GLYPH.leg}"/>
  </g>
</svg>`;
}

/** Safari pinned-tab mask: single black shape, glyph knocked out via even-odd. */
function maskSvg() {
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path fill="#000000" fill-rule="evenodd"
    d="${PLATE_PATH} ${GLYPH.stem} ${GLYPH.bowlOuter} ${GLYPH.counter} ${GLYPH.leg}"/>
</svg>`;
}

/**
 * Home-screen / PWA tile: dark steel background, soft orange glow,
 * plate mark centered inside the maskable safe zone (~72% of canvas).
 */
function tileSvg(size) {
  const mark = size * 0.72;
  const offset = (size - mark) / 2;
  const scale = mark / 64;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="46%" r="62%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="${ORANGE}" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="${DARK_BG}"/>
  <rect width="${size}" height="${size}" fill="url(#glow)"/>
  <g transform="translate(${offset},${offset}) scale(${scale})">
    ${markSvg().replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;
}

async function png(svg, size, name) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC_DIR, name));
  console.log(`generated public/${name} (${size}x${size})`);
}

async function run() {
  await writeFile(resolve(PUBLIC_DIR, 'favicon.svg'), markSvg() + '\n', 'utf8');
  console.log('generated public/favicon.svg');

  await writeFile(resolve(PUBLIC_DIR, 'mask-icon.svg'), maskSvg() + '\n', 'utf8');
  console.log('generated public/mask-icon.svg');

  // Tiny sizes use the flat, bevel-free variant so nothing turns to mush.
  await png(markSvg({ detail: false, flat: true }), 16, 'favicon-16.png');
  await png(markSvg({ detail: false, flat: false }), 32, 'favicon-32.png');
  await png(tileSvg(180), 180, 'apple-touch-icon.png');
  await png(tileSvg(192), 192, 'favicon-192.png');
  await png(tileSvg(512), 512, 'favicon-512.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
