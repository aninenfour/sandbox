// Referral carousel v3: four 1080 x 1350 slides cut from one 4320 x 1350 canvas.
// The continuous element is one giant $5 note (Lincoln on slide 1, the eagle, seal and "5" after it),
// built by scripts/make-bill-bg.py. The story is concrete: how it works, then a worked example with real fees.
// Facts, checked 2 Oct 2026:
//   hotcoin.com/en_US/user/ic: up to 20% of friends' net trading fees, no cap, paid T+1 by 02:00 (UTC+8),
//     360 days per friend, direct invites only.
//   hotcoin.com/en_US/rateStandard/index: futures VIP0 maker 0.02%, taker 0.06%.
//   hotcoin.com homepage: new users get up to 16,360 USDT in rewards.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

export const CAROUSEL_W = 4320, CAROUSEL_H = 1350;
const LIME = '#B8F26A', WHITE = '#F4F5F2', GREY = '#9BA39D', INK = '#050807';
const SANS = '"Inter Tight", sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"IBM Plex Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['500 96px "Inter Tight"', '600 96px "Inter Tight"', '400 30px "Inter Tight"', 'italic 400 96px "Instrument Serif"', '500 24px "IBM Plex Mono"'].map((s) => document.fonts.load(s)))
      .then(() => continueRender(h));
  }, [h]);
};

// The worked example (illustrative): one friend's futures trading for a day at the VIP0 taker fee.
const VOLUME = 20000, FEE_RATE = 0.0006, SHARE = 0.2, DAYS = 360, FRIENDS = 10;
const FEE = VOLUME * FEE_RATE;                 // 12 USDT
const YOURS = FEE * SHARE;                     // 2.40 USDT
const YEAR_TEN = YOURS * DAYS * FRIENDS;       // 8,640 USDT
const usdt = (n: number, d = 2) => n.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});

const S = (i: number) => i * 1080;
const Logo: React.FC<{i: number}> = ({i}) => (
  <Img src={staticFile('brand/logo-v3.svg')} style={{position: 'absolute', left: S(i) + 80, top: 80, width: 190, height: (190 * 28) / 139}} />
);
const Page: React.FC<{i: number}> = ({i}) => (
  <div style={{position: 'absolute', left: S(i) + 1080 - 80 - 120, top: 86, width: 120, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: GREY}}>
    <span style={{color: WHITE}}>0{i + 1}</span> / 04
  </div>
);
const Kick: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 1, color: LIME}}>{children}</div>
);
const Head: React.FC<{x: number; y: number; size?: number; children: React.ReactNode}> = ({x, y, size = 108, children}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1.0, letterSpacing: -size * 0.04, color: WHITE}}>{children}</div>
);
const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.14em', letterSpacing: -1, color: LIME}}>{children}</span>
);
const glass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(10,16,13,0.82), rgba(6,10,8,0.9))', border: '1px solid rgba(184,242,106,0.18)',
  boxShadow: '0 30px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)', borderRadius: 28, backdropFilter: 'blur(10px)',
};
const Row: React.FC<{label: string; value: string; strong?: boolean; sub?: string}> = ({label, value, strong, sub}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '26px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
    <div>
      <div style={{fontFamily: SANS, fontSize: 32, color: strong ? WHITE : GREY}}>{label}</div>
      {sub ? <div style={{fontFamily: MONO, fontSize: 20, color: GREY, marginTop: 6}}>{sub}</div> : null}
    </div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: strong ? 64 : 40, letterSpacing: -1, color: strong ? LIME : WHITE, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
  </div>
);

export const Carousel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('referral/bill-bg.png')} style={{position: 'absolute', inset: 0, width: CAROUSEL_W, height: CAROUSEL_H}} />
      {/* shade for legibility: bottom of slide 1 (under Lincoln), centre of 2 to 4 */}
      <AbsoluteFill style={{background: [
        'linear-gradient(180deg, rgba(5,8,7,0.55) 0%, rgba(5,8,7,0) 18%)',
        'linear-gradient(0deg, rgba(5,8,7,0.97) 0%, rgba(5,8,7,0.88) 24%, rgba(5,8,7,0) 46%)',
      ].join(',')}} />
      <div style={{position: 'absolute', left: 1080, top: 0, width: 3240, height: 1350, background: 'linear-gradient(90deg, rgba(5,8,7,0) 0%, rgba(5,8,7,0.5) 12%, rgba(5,8,7,0.5) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.22}} />

      {/* 01: Lincoln */}
      <Logo i={0} />
      <Page i={0} />
      <Kick x={80} y={850}>// hotcoin referral program</Kick>
      <Head x={76} y={898} size={112}>Invite friends.<br />Earn up to <Em>20%</Em></Head>
      <div style={{position: 'absolute', left: 80, top: 1150, fontFamily: SANS, fontSize: 36, color: GREY}}>of their trading fees. Paid every day.</div>
      <div style={{position: 'absolute', left: 80, top: 1236, fontFamily: MONO, fontSize: 22, color: GREY}}>Swipe to see the math →</div>

      {/* 02: how it works */}
      <Page i={1} />
      <Kick x={S(1) + 80} y={200}>// how it works</Kick>
      <Head x={S(1) + 76} y={248}>Three steps.<br /><Em>That's it.</Em></Head>
      {[
        {t: 'Copy your invite link', s: 'App: Rewards → Referral Program'},
        {t: 'A friend signs up with it', s: 'Only direct invites count'},
        {t: 'They trade. You get paid.', s: 'Up to 20% of their fees, the next day'},
      ].map((step, i) => (
        <div key={step.t} style={{position: 'absolute', left: S(1) + 80, top: 540 + i * 220, width: 920, height: 184, ...glass, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box'}}>
          <div style={{width: 84, height: 84, borderRadius: '50%', background: i === 2 ? LIME : 'transparent', border: `2px solid ${LIME}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SANS, fontWeight: 600, fontSize: 38, color: i === 2 ? INK : LIME, flexShrink: 0}}>{i + 1}</div>
          <div>
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, letterSpacing: -1, color: WHITE}}>{step.t}</div>
            <div style={{fontFamily: SANS, fontSize: 28, color: GREY, marginTop: 6}}>{step.s}</div>
          </div>
        </div>
      ))}

      {/* 03: one friend, one day */}
      <Page i={2} />
      <Kick x={S(2) + 80} y={200}>// example: one friend, one day</Kick>
      <Head x={S(2) + 76} y={248}>Alex trades.<br /><Em>You earn.</Em></Head>
      <div style={{position: 'absolute', left: S(2) + 80, top: 540, width: 920, ...glass, padding: '18px 48px 34px', boxSizing: 'border-box'}}>
        <Row label="Alex's futures trades today" value={`${usdt(VOLUME, 0)} USDT`} />
        <Row label="Trading fee Alex pays" sub="0.06% taker fee (VIP0)" value={`${usdt(FEE)} USDT`} />
        <Row label="Your share, up to 20%" value={`+${usdt(YOURS)} USDT`} strong />
        <div style={{fontFamily: SANS, fontSize: 27, color: GREY, marginTop: 26}}>Lands in your account tomorrow by 02:00 (UTC+8).</div>
      </div>

      {/* 04: multiply it */}
      <Logo i={3} />
      <Page i={3} />
      <Kick x={S(3) + 80} y={200}>// now multiply</Kick>
      <Head x={S(3) + 76} y={248}>10 friends.<br /><Em>360 days.</Em></Head>
      <div style={{position: 'absolute', left: S(3) + 80, top: 540, width: 920, ...glass, padding: '40px 48px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: MONO, fontSize: 22, color: GREY}}>UP TO</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 168, lineHeight: 1.05, letterSpacing: -8, color: LIME, fontVariantNumeric: 'tabular-nums'}}>{usdt(YEAR_TEN, 0)}</span>
          <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 52, color: LIME}}>USDT</span>
        </div>
        <div style={{fontFamily: SANS, fontSize: 30, lineHeight: 1.4, color: GREY, marginTop: 8}}>
          if each friend trades like Alex, every day.<br />
          <span style={{color: WHITE}}>No cap on how much you can earn.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: S(3) + 80, top: 1004, display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: INK, background: LIME, padding: '22px 42px', borderRadius: 60}}>Invite friends</div>
        <div style={{fontFamily: SANS, fontSize: 26, lineHeight: 1.35, color: GREY, width: 440}}>Your friends get up to <span style={{color: WHITE}}>16,360 USDT</span> in welcome rewards too.</div>
      </div>
      <div style={{position: 'absolute', left: S(3) + 80, top: 1190, width: 920, fontFamily: SANS, fontSize: 19, lineHeight: 1.45, color: GREY, opacity: 0.85}}>
        Illustrative example at the VIP0 futures taker fee (0.06%). Rewards are based on net fees after deductions and discounts, for 360 days after a friend signs up.
        Direct invites only. Hotcoin may change rules or rates. Trading involves risk.
      </div>
    </AbsoluteFill>
  );
};
