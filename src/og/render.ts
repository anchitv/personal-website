import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ogTemplate, type OgProps } from './template';

const require = createRequire(import.meta.url);

// Satori can't consume woff2/variable fonts, so the static @fontsource
// packages (woff) are used here. Loaded once per build.
let fontsPromise: Promise<[Buffer, Buffer]> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(require.resolve('@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff')),
    readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-400-normal.woff')),
  ]);
  return fontsPromise;
}

export async function renderOgImage(props: OgProps): Promise<Buffer> {
  const [dmSansBold, crimsonPro] = await loadFonts();

  const svg = await satori(ogTemplate(props), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'DM Sans', data: dmSansBold, weight: 700, style: 'normal' },
      { name: 'Crimson Pro', data: crimsonPro, weight: 400, style: 'normal' },
    ],
  });

  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
