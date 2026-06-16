import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_CONTENT = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f766e" />
  <text x="256" y="380" font-family="sans-serif" font-size="320" font-weight="bold" fill="white" text-anchor="middle">名</text>
</svg>
`;

const SVG_MASKABLE_CONTENT = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f766e" />
  <text x="256" y="360" font-family="sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle">名</text>
</svg>
`;

async function generateIcons() {
  const publicDir = path.resolve(process.cwd(), 'public/icons');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(SVG_CONTENT);
  const maskableSvgBuffer = Buffer.from(SVG_MASKABLE_CONTENT);

  console.log('Generating icon-192.png...');
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Generating icon-512.png...');
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Generating icon-maskable-512.png...');
  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
