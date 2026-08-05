import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { input: path.resolve(process.cwd(), 'public/project-oilfield.webp'), base: 'public/project-oilfield' },
  { input: path.resolve(process.cwd(), 'public/project-metalforge.webp'), base: 'public/project-metalforge' },
];

async function compress() {
  for (const img of images) {
    if (!fs.existsSync(img.input)) {
      console.warn('Skipping, not found:', img.input);
      continue;
    }

    // Re-encode to webp with quality 75 (replace original)
    await sharp(img.input)
      .webp({ quality: 75, effort: 6 })
      .toFile(img.base + '.webp.tmp');

    fs.renameSync(img.base + '.webp.tmp', img.input);
    console.log('Compressed:', img.input);
  }
}

compress().catch(err => { console.error(err); process.exitCode = 1; });
