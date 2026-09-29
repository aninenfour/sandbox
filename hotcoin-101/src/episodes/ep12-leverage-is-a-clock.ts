import { EpisodeScript } from '../Episode';

/**
 * FILE 012 — first episode on the 60fps engine with distributed motion.
 *
 * Four full-page visuals, each running a timeline across its entire page:
 * a counter climbing, a line closing in, a path being drawn, a margin being
 * eaten. No tables. One callout, one cards page.
 */
export const ep12: EpisodeScript = {
  file: 'FILE 012',
  pillar: 'Risk',
  slug: 'leverage-is-a-clock',
  title: 'Leverage Is a Clock, Not a Multiplier',
  subtitle: "It changes how long you're allowed to be wrong",
  verticalLayout: 'reels',
  look: 'terminal',
  beats: [
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious', r: 4.2 },
      type: 'coldOpen',
      seconds: 4.5,
      kicker: 'File 012 · Risk',
      line1: "Leverage doesn't make you",
      line2: 'right faster.',
      highlight: true,
      footnote: 'Hotcoin 101 · Money, explained',
    },
    {
      dot: { x: 0.26, y: 0.75, hx: 0.84, hy: 0.82, mood: 'neutral' },
      type: 'title',
      seconds: 3.5,
      file: 'FILE 012',
      pillar: 'Risk',
      title: 'Leverage Is a Clock, Not a Multiplier',
      subtitle: "It changes how long you're allowed to be wrong",
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'thinking' },
      type: 'visual',
      seconds: 8,
      figure: 'notional',
      kicker: 'Fig. 01 · Margin and position',
      line: 'At 20x, a 5% move is all of it.',
      accent: 'all of it.',
    },
    {
      dot: { x: 0.29, y: 0.75, hx: 0.84, hy: 0.82, mood: 'alert' },
      type: 'visual',
      seconds: 9,
      figure: 'liqLadder',
      kicker: 'Fig. 02 · Where the exit sits',
      line: 'Every step up pulls the exit closer.',
      accent: 'pulls the exit closer.',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'thinking' },
      type: 'visual',
      seconds: 9.5,
      figure: 'clock',
      kicker: 'Fig. 03 · Same idea, same market',
      line: 'Right about direction. Wrong about time.',
      accent: 'Wrong about time.',
    },
    {
      dot: { x: 0.18, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'callout',
      seconds: 6,
      tag: 'The part people skip',
      line: 'Leverage is a clock, not a multiplier.',
      note: "It doesn't make you more right. It shortens how long you're allowed to be wrong before the market closes the position for you.",
    },
    {
      dot: { x: 0.28, y: 0.75, hx: 0.84, hy: 0.82, mood: 'aside' },
      type: 'visual',
      seconds: 7.5,
      figure: 'funding',
      kicker: 'Fig. 04 · Funding',
      line: 'And the clock costs money while it runs.',
      accent: 'costs money',
    },
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious' },
      type: 'cards',
      seconds: 7,
      heading: 'Before you add a zero.',
      cards: [
        { label: 'Liquidation', line: 'Know the exact price, not just the multiple.' },
        { label: 'Funding', line: 'Know what holding it costs per day.' },
        { label: 'Time', line: 'Know how long your idea actually needs.', accent: true },
      ],
    },
    {
      dot: { x: 0.2, y: 0.75, hx: 0.89, hy: 0.8, mood: 'pleased' },
      type: 'outro',
      seconds: 5.5,
      takeaway: 'So size for how long you might be wrong, not for how sure you feel.',
      cta: 'Advanced risk controls on Hotcoin futures.',
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
