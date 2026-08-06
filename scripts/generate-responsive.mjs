import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { input: path.resolve(process.cwd(), 'public/project-oilfield.webp'), base: 'public/project-oilfield' },
  { input: path.resolve(process.cwd(), 'public/project-metalforge.webp'), base: 'public/project-metalforge' },
  { input: path.resolve(process.cwd(), 'public/project-homeservices.webp'), base: 'public/project-homeservices' },
  { input: path.resolve(process.cwd(), 'public/project-medical.webp'), base: 'public/project-medical' },
];

const sizes = [400, 800, 1200];

async function generate() {
  for (const img of images) {
    if (!fs.existsSync(img.input)) {
      console.warn('Skipping, not found:', img.input);
      continue;
    }

    for (const size of sizes) {
      const out = `${img.base}-${size}.webp`;
      await sharp(img.input)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(out + '.tmp');
      fs.renameSync(out + '.tmp', out);
      console.log('Generated:', out);
    }
  }
}

generate().catch(err => { console.error(err); process.exitCode = 1; });
