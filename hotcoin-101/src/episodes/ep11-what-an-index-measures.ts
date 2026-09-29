import { EpisodeScript } from '../Episode';

/**
 * FILE 011 — carried by drawings rather than text.
 *
 * Four bespoke diagrams, one callout, and one short list. No comparison table
 * and no body copy on the visual pages: each one is a kicker, a picture and a
 * single line, and the voiceover does the explaining.
 */
export const ep11: EpisodeScript = {
  file: 'FILE 011',
  pillar: 'TradFi',
  slug: 'what-an-index-measures',
  title: 'What an Index Actually Measures',
  subtitle: 'The S&P 500 is not the economy, it is a rule',
  verticalLayout: 'reels',
  look: 'terminal',
  beats: [
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious', r: 4.2 },
      type: 'coldOpen',
      seconds: 4.5,
      kicker: 'File 011 · TradFi',
      line1: 'The S&P 500 is not',
      line2: 'the economy.',
      highlight: true,
      footnote: 'Hotcoin 101 · Money, explained',
    },
    {
      dot: { x: 0.26, y: 0.75, hx: 0.84, hy: 0.82, mood: 'neutral' },
      type: 'title',
      seconds: 3.5,
      file: 'FILE 011',
      pillar: 'TradFi',
      title: 'What an Index Actually Measures',
      subtitle: 'The S&P 500 is not the economy, it is a rule',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'thinking' },
      type: 'visual',
      seconds: 9,
      figure: 'weightGrid',
      kicker: 'Fig. 01 · One block, one company',
      line: 'It starts equal. Then the rule takes over.',
      accent: 'Then the rule takes over.',
    },
    {
      dot: { x: 0.29, y: 0.75, hx: 0.84, hy: 0.82, mood: 'alert' },
      type: 'visual',
      seconds: 7.5,
      figure: 'dominance',
      kicker: 'Fig. 02 · Cap weighting',
      line: 'A handful of names do most of the moving.',
      accent: 'most of the moving.',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious' },
      type: 'visual',
      seconds: 7.5,
      figure: 'survivors',
      kicker: 'Fig. 03 · Survivorship',
      line: 'The losers get dropped. The chart never shows them.',
      accent: 'The chart never shows them.',
    },
    {
      dot: { x: 0.28, y: 0.75, hx: 0.84, hy: 0.82, mood: 'thinking' },
      type: 'visual',
      seconds: 8,
      figure: 'divergence',
      kicker: 'Fig. 04 · Same companies, two rules',
      line: 'Change the weighting and you change the number.',
      accent: 'you change the number.',
    },
    {
      dot: { x: 0.18, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'callout',
      seconds: 6,
      tag: 'The part people skip',
      line: 'An index is a rule, not a fact.',
      note: 'Somebody chose which companies go in, how much each one counts, and when the list gets edited. Every number you read is downstream of those three choices.',
    },
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'neutral' },
      type: 'list',
      seconds: 7,
      heading: 'Three questions for any index.',
      items: [
        'Who gets in, and who decides?',
        'How is each one weighted?',
        'What happens to the ones that fail?',
      ],
    },
    {
      dot: { x: 0.2, y: 0.75, hx: 0.89, hy: 0.8, mood: 'pleased' },
      type: 'outro',
      seconds: 5.5,
      takeaway:
        'So read the rule before you read the number, because the rule is what you are actually buying.',
      cta: 'Tokenized index and equity exposure on Hotcoin.',
    },
    {
      dot: { merge: true },
      type: 'endCard',
      seconds: 5,
      merge: true,
      url: 'hotcoin.com',
      strap: 'Hotcoin 101 · Money, explained',
    },
  ],
};
