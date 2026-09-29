// One-off generator for the fallback social card (run: node scripts/generate-og-default.mjs).
// Pages without their own OG image use public/og-default.png. Rendered with satori
// (text becomes paths, no system fonts needed) and rasterized with resvg.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const font = (path) => readFile(require.resolve(path));
const [crimsonPro, dmSans, jetbrainsMono] = await Promise.all([
  font('@fontsource/crimson-pro/files/crimson-pro-latin-400-normal.woff'),
  font('@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff'),
  font('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'),
]);

const DIVIDER = '#9cb99f';
const line = { type: 'div', props: { style: { width: '40px', height: '1px', backgroundColor: DIVIDER } } };

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf9f5',
        borderTop: '6px solid #3d7a4a',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { fontFamily: 'Crimson Pro', fontSize: '96px', lineHeight: 1, color: '#2c2a25' },
            children: 'Anchit Verma',
          },
        },
        {
          type: 'div',
          props: {
            style: { fontFamily: 'DM Sans', fontSize: '28px', color: '#78756c', marginTop: '28px' },
            children: "Writing about software, ideas and the things I'm building.",
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '44px' },
            children: [
              line,
              { type: 'div', props: { style: { width: '10px', height: '10px', backgroundColor: DIVIDER, transform: 'rotate(45deg)' } } },
              line,
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { fontFamily: 'JetBrains Mono', fontSize: '24px', color: '#9e9a90', marginTop: '36px' },
            children: 'anchitverma.com',
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Crimson Pro', data: crimsonPro, weight: 400, style: 'normal' },
      { name: 'DM Sans', data: dmSans, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: jetbrainsMono, weight: 400, style: 'normal' },
    ],
  }
);

await writeFile('public/og-default.png', new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
console.log('Wrote og-default.png');
