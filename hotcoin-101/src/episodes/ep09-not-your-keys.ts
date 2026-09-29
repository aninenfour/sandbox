import { EpisodeScript } from '../Episode';

/**
 * FILE 009 — first episode in the Beyond the Green look.
 *
 * Pacing: eleven beats over 63.5 seconds. Beat length is set from how much
 * there is to read rather than a fixed number, so the figure pages get 6.5
 * seconds and the short ones get 5. The slit transition eats 6 frames at each
 * end, which is already accounted for.
 */
export const ep09: EpisodeScript = {
  file: 'FILE 009',
  pillar: 'Crypto',
  slug: 'not-your-keys',
  title: 'Not Your Keys, Not Your Coins',
  subtitle: 'Two ways to hold crypto, and what each one costs',
  verticalLayout: 'reels',
  look: 'terminal',
  beats: [
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'curious', r: 4.2 },
      type: 'coldOpen',
      seconds: 4.5,
      kicker: 'File 009 · Crypto',
      line1: 'There are only two ways',
      line2: 'to hold crypto.',
      highlight: true,
      footnote: 'Hotcoin 101 · Money, explained',
    },
    {
      dot: { x: 0.26, y: 0.75, hx: 0.84, hy: 0.82, mood: 'neutral' },
      type: 'title',
      seconds: 3.5,
      file: 'FILE 009',
      pillar: 'Crypto',
      title: 'Not Your Keys, Not Your Coins',
      subtitle: 'Two ways to hold crypto, and what each one costs',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'thinking' },
      type: 'figure',
      seconds: 7,
      figure: 'ledger',
      figNo: 'FIG. 01',
      caption: 'What you actually own',
      era: 'The thing itself',
      heading: 'You never really hold a coin.',
      body: 'There is no object. Ownership is a line in a shared ledger, and a private key is simply the thing that lets you move that line. Whoever has the key has the coins.',
    },
    {
      dot: { x: 0.29, y: 0.75, hx: 0.84, hy: 0.82, mood: 'curious' },
      type: 'figure',
      seconds: 7,
      figure: 'phone',
      figNo: 'FIG. 02',
      caption: 'Self custody',
      era: 'Option one',
      heading: 'You keep the key yourself.',
      body: 'Nobody can freeze it, nobody can lend it out, and nobody needs to approve your withdrawal. The catch is that there is no support line and no reset. Lose the phrase and the coins stay on the ledger forever, just out of reach.',
      size: 'tall',
    },
    {
      dot: { x: 0.16, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'figure',
      seconds: 7,
      figure: 'certificate',
      figNo: 'FIG. 03',
      caption: 'Exchange custody',
      era: 'Option two',
      heading: 'Or somebody keeps it for you.',
      body: 'What you hold then is a claim, not a key. That buys you password resets, deep liquidity and someone to call. It also means their security and their solvency are now part of your risk.',
    },
    {
      dot: { x: 0.28, y: 0.75, hx: 0.84, hy: 0.82, mood: 'thinking' },
      type: 'compare',
      seconds: 8,
      heading: 'The trade you are actually making.',
      leftTitle: 'Self custody',
      rightTitle: 'Exchange custody',
      mode: 'pairs',
      rows: [
        ['Your mistake is final', 'Their failure is your problem'],
        ['No one can freeze it', 'Someone can freeze it'],
        ['You are the security team', 'They are the security team'],
        ['Operational risk', 'Counterparty risk'],
      ],
    },
    {
      dot: { x: 0.18, y: 0.75, hx: 0.89, hy: 0.8, mood: 'alert' },
      type: 'stat',
      seconds: 5,
      value: 20,
      suffix: '%',
      label: 'of all bitcoin is estimated to be sitting in wallets nobody can open any more.',
      source: 'Chainalysis estimate',
    },
    {
      dot: { x: 0.27, y: 0.75, hx: 0.84, hy: 0.82, mood: 'curious' },
      type: 'list',
      seconds: 7,
      heading: 'What actually goes wrong.',
      items: [
        'Self custody fails quietly: a lost phrase, a dead drive, a phishing signature.',
        'Custody fails loudly: a freeze, a hack, or a balance sheet nobody could see.',
        'Both failures are permanent, which is the part people underestimate.',
      ],
    },
    {
      dot: { x: 0.17, y: 0.75, hx: 0.89, hy: 0.8, mood: 'neutral' },
      type: 'list',
      seconds: 7,
      heading: 'How most people actually split it.',
      items: [
        'Trading size stays where you trade, because it has to move quickly.',
        'Long term size goes to self custody, where speed does not matter.',
        'Nothing sits anywhere by accident, which is the only rule that counts.',
      ],
    },
    {
      dot: { x: 0.2, y: 0.75, hx: 0.89, hy: 0.8, mood: 'pleased' },
      type: 'outro',
      seconds: 5.5,
      takeaway:
        'Custody is not a safety setting. It is a choice between losing your own keys and trusting somebody else with them, and both of those are real.',
      cta: 'Withdrawal controls and custody options on Hotcoin.',
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
