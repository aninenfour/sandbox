import { EpisodeScript } from '../Episode';

/**
 * FILE 010 — Beyond the Green, second outing.
 *
 * Deliberately built from a different set of elements than 009: a cards page
 * and a callout page instead of a second list and a stat, so consecutive
 * episodes do not reuse the same five blocks in the same order.
 */
export const ep10: EpisodeScript = {
  file: 'FILE 010',
  pillar: 'Trading',
  slug: 'order-types',
  title: 'Market, Limit and Stop Orders',
  subtitle: 'Three buttons, and what each one actually costs',
  verticalLayout: 'reels',
  look: 'terminal',
  beats: [
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious', r: 4.2 },
      type: 'coldOpen',
      seconds: 4.5,
      kicker: 'File 010 · Trading',
      line1: 'Three buttons.',
      line2: 'Most losses are the wrong one.',
      highlight: true,
      footnote: 'Hotcoin 101 · Money, explained',
    },
    {
      dot: { x: 0.26, y: 0.75, hx: 0.84, hy: 0.82, mood: 'neutral' },
      type: 'title',
      seconds: 3.5,
      file: 'FILE 010',
      pillar: 'Trading',
      title: 'Market, Limit and Stop Orders',
      subtitle: 'Three buttons, and what each one actually costs',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'thinking' },
      type: 'figure',
      seconds: 7,
      figure: 'orderBook',
      figNo: 'FIG. 01',
      caption: 'Where your order lands',
      era: 'The book',
      heading: 'Every order goes to the same place.',
      body: 'Buyers queue below the price, sellers queue above it. The only thing an order type decides is whether you join that queue or step across it.',
      size: 'tall',
    },
    {
      dot: { x: 0.29, y: 0.75, hx: 0.84, hy: 0.82, mood: 'curious' },
      type: 'cards',
      seconds: 8,
      heading: 'Three buttons, three jobs.',
      cards: [
        { label: 'Market', line: 'Fill me now, at whatever price is sitting there.' },
        { label: 'Limit', line: 'Fill me at my price, or leave me waiting.' },
        { label: 'Stop', line: 'Wake up at this price, then send one of the other two.', accent: true },
      ],
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'figure',
      seconds: 6.5,
      figure: 'match',
      figNo: 'FIG. 02',
      caption: 'Crossing the spread',
      era: 'Market order',
      heading: 'Certainty about filling, none about price.',
      body: 'It takes the best price available, then the next one, and keeps going until it is full. In a thin book that can be several percent away from where you clicked.',
    },
    {
      dot: { x: 0.28, y: 0.75, hx: 0.84, hy: 0.82, mood: 'thinking' },
      type: 'figure',
      seconds: 6.5,
      figure: 'spread',
      figNo: 'FIG. 03',
      caption: 'Sitting in the queue',
      era: 'Limit order',
      heading: 'Certainty about price, none about filling.',
      body: 'You name the number and wait for somebody to come to you. Usually cheaper, and sometimes it simply never happens while the move goes without you.',
    },
    {
      dot: { x: 0.18, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'callout',
      seconds: 5.5,
      tag: 'The one people get wrong',
      line: 'A stop is a trigger, not a price guarantee.',
      note: 'It sits dormant until the market reaches your level, and then it fires an ordinary order into whatever book exists at that moment. In a gap, that is not your number.',
    },
    {
      dot: { x: 0.27, y: 0.75, hx: 0.84, hy: 0.82, mood: 'neutral' },
      // The trilemma, as three switches that keep re-deciding. Only ever two
      // are on, and the page names what each pair actually is.
      type: 'pickTwo',
      seconds: 8,
      heading: 'Speed, price, certainty. Pick two.',
      options: ['Speed', 'Price', 'Certainty'],
      states: [
        { on: [0, 2], label: 'Now, and it definitely fills. That is a market order.' },
        { on: [1, 2], label: 'Your price, and it fills eventually. A limit order, left working.' },
        { on: [0, 1], label: 'Your price, right now, and it may not fill at all.' },
      ],
      hold: 70,
      start: 14,
    },
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious' },
      type: 'list',
      seconds: 7,
      heading: 'When each one hurts.',
      items: [
        'Market orders hurt in thin books, at the open, and in the first seconds of news.',
        'Limit orders hurt when you are right about direction and the fill never comes.',
        'Stops hurt on the gap, and on the wick that takes you out before the move you called.',
      ],
    },
    {
      dot: { x: 0.2, y: 0.75, hx: 0.89, hy: 0.8, mood: 'pleased' },
      type: 'outro',
      seconds: 5.5,
      takeaway:
        'Order type is a risk decision wearing the costume of a convenience setting. You are choosing which kind of surprise you can live with.',
      cta: 'Market, limit and stop orders on every Hotcoin pair.',
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
