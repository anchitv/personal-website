// One-off generator for the raster favicon set (run: node scripts/generate-icons.mjs).
// Renders the "AV" monogram with satori (text becomes paths, no system fonts needed),
// rasterizes with resvg, and writes the PNGs + favicon.ico into public/.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const require = createRequire(import.meta.url);
const dmSansBold = await readFile(
  require.resolve('@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff')
);

async function renderIcon(size) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf9f5',
          color: '#1f1e1a',
          fontFamily: 'DM Sans',
          fontWeight: 700,
          fontSize: size * 0.5,
          letterSpacing: '-0.03em',
        },
        children: 'AV',
      },
    },
    {
      width: size,
      height: size,
      fonts: [{ name: 'DM Sans', data: dmSansBold, weight: 700, style: 'normal' }],
    }
  );
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

const [png32, png180, png192, png512] = await Promise.all([
  renderIcon(32),
  renderIcon(180),
  renderIcon(192),
  renderIcon(512),
]);

await writeFile('public/apple-touch-icon.png', png180);
await writeFile('public/icon-192.png', png192);
await writeFile('public/icon-512.png', png512);
await writeFile('public/favicon.ico', await pngToIco([Buffer.from(png32)]));

console.log('Wrote apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico');
