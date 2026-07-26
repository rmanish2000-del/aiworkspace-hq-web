/**
 * generate-assets.mjs — rasterises the committed SVG sources into the binary
 * formats browsers and crawlers still require.
 *
 *   npm run assets
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ RUN LOCALLY; THE OUTPUT IS COMMITTED.                                     │
 * │                                                                           │
 * │ Text rasterisation depends on the fonts installed on the machine, so       │
 * │ running this in CI would produce a different image on a different runner.  │
 * │ Committing the output makes the asset deterministic and reviewable in a    │
 * │ diff, and keeps CI free of a font dependency.                             │
 * │                                                                           │
 * │ `sharp` is already present as a build-time dependency of the framework     │
 * │ and is used here only at authoring time. No runtime dependency is added.   │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Every asset is a PLACEHOLDER pending Open Item E and AWHQ-AUT-P1F P-15.
 * See docs/public-assets.md.
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = 'public';

/** ICO container around a single PNG. Vista and later accept PNG-in-ICO. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

async function main() {
  const written = [];

  // ---- favicon.ico — the 32x32 fallback `07` §11 asks for ----------------
  const iconSvg = await readFile(`${OUT}/favicon.svg`);
  const icoPng = await sharp(iconSvg, { density: 384 })
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile(`${OUT}/favicon.ico`, icoFromPng(icoPng, 32));
  written.push(`${OUT}/favicon.ico`);

  // ---- apple-touch-icon.png — 180x180, opaque background (`07` §11) ------
  // iOS composites onto white anyway; declaring it avoids a black halo.
  const touch = await sharp(iconSvg, { density: 768 })
    .resize(148, 148, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer();
  await writeFile(`${OUT}/apple-touch-icon.png`, touch);
  written.push(`${OUT}/apple-touch-icon.png`);

  // ---- og-image.png — 1200x630 per `04` §8 -------------------------------
  const ogSvg = await readFile(`${OUT}/og-image.svg`);
  const og = await sharp(ogSvg, { density: 144 })
    .resize(1200, 630)
    .flatten({ background: '#ffffff' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(`${OUT}/og-image.png`, og);
  written.push(`${OUT}/og-image.png`);

  for (const file of written) {
    const { size } = await sharp(file === `${OUT}/favicon.ico` ? icoPng : file).metadata();
    void size;
    console.log(`  ${file}`);
  }
  console.log(`\n${written.length} assets written to ${OUT}/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
