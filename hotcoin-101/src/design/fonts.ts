import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * Fonts are bundled locally in public/fonts so renders never depend on a CDN.
 * Swap a file here and the whole series changes typeface.
 */

type Face = {
  family: string;
  file: string;
  weight: string;
  style?: string;
};

const FACES: Face[] = [
  { family: 'Newsreader', file: 'newsreader-latin-400-normal.woff2', weight: '400' },
  { family: 'Newsreader', file: 'newsreader-latin-500-normal.woff2', weight: '500' },
  { family: 'Newsreader', file: 'newsreader-latin-600-normal.woff2', weight: '600' },
  { family: 'Newsreader', file: 'newsreader-latin-400-italic.woff2', weight: '400', style: 'italic' },
  { family: 'Newsreader', file: 'newsreader-latin-500-italic.woff2', weight: '500', style: 'italic' },
  { family: 'Inter', file: 'inter-latin-400-normal.woff2', weight: '400' },
  { family: 'Inter', file: 'inter-latin-500-normal.woff2', weight: '500' },
  { family: 'Inter', file: 'inter-latin-700-normal.woff2', weight: '700' },
  { family: 'IBMPlexMono', file: 'ibm-plex-mono-latin-400-normal.woff2', weight: '400' },
  { family: 'IBMPlexMono', file: 'ibm-plex-mono-latin-500-normal.woff2', weight: '500' },
  { family: 'IBMPlexMono', file: 'ibm-plex-mono-latin-600-normal.woff2', weight: '600' },
];

let loaded = false;

export const loadSeriesFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading Hotcoin 101 typefaces');
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile('fonts/' + f.file)}) format('woff2')`, {
        weight: f.weight,
        style: f.style ?? 'normal',
      });
      await face.load();
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
    })
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

loadSeriesFonts();

export const FF = {
  display: 'Newsreader, Georgia, serif',
  ui: 'Inter, Helvetica, Arial, sans-serif',
  mono: 'IBMPlexMono, ui-monospace, monospace',
};
