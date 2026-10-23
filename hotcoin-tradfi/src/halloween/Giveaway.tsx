// Halloween giveaway card (1080x1350): "Your crypto horror story in 6 words", $200 in Futures vouchers.
// Same world as Crypto Scary Stories Ep. 2 (graveyard set, costumes).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Fire, Ghost, INK, LIME, Log, MONO, Pumpkin, SERIF, Sky, useFonts} from './ScaryStories';
import {CandyBucket, Graveyard, Scarf, WitchHat} from './ScaryStories2';

export const HalloweenGiveaway: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#3E4F8C', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'translateY(-110px)'}}>
        <Sky t={t} />
        <Graveyard t={t} />
        <Pumpkin x={80} y={1070} s={0.8} t={t} />
        <Log x={540} y={890} w={300} r={0} />
        <Ghost id="gm" x={540} y={915} s={1.3} t={t} face="tell" arms={['up', 'hold']} light={1} warm={1}>
          <g><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>
          <WitchHat t={t} />
        </Ghost>
        <Log x={225} y={1035} w={270} r={14} />
        <Log x={855} y={1035} w={270} r={-14} />
        <Fire t={t} boost={0.3} />
        <Ghost id="gl" x={235} y={1035} s={1.18} t={t} face="scared" arms={['down', 'down']} ph={1.3} warm={1}><Scarf /></Ghost>
        <Ghost id="gr" x={850} y={1035} s={1.18} t={t} face="happy" arms={['side', 'hold']} ph={2.6} warm={-1} />
        <CandyBucket t={t} full={1} tilt={-8} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,30,0.82) 0%, rgba(10,12,30,0.5) 20%, rgba(10,12,30,0) 34%)'}} />

      {/* header */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 190, height: (190 * 328) / 2005}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: 4, color: INK, background: LIME, borderRadius: 999, padding: '9px 18px'}}>🎃 HALLOWEEN GIVEAWAY</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', color: CREAM, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 94, lineHeight: 1}}>Your crypto horror story</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 70, lineHeight: 1.1, color: LIME}}>in 6 words or less.</div>
      </div>

      {/* the teller's example */}
      <Bubble f={60} w={700} h={150} top={300}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 50, lineHeight: 1}}>“Sold the bottom. Bought the top.”</div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#5A6478', marginTop: 10}}>6 WORDS · NOW YOUR TURN 👇</div>
        </div>
      </Bubble>

      {/* prize + how to enter */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 1000, height: 300, borderRadius: 30, background: 'rgba(9,11,14,0.92)', border: `2px solid rgba(184,242,106,0.55)`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', display: 'flex', padding: '26px 34px', gap: 30, color: CREAM}}>
        <div style={{width: 320, flex: 'none', borderRight: '1px solid rgba(255,255,255,0.12)', paddingRight: 24}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#9AA39C'}}>PRIZE POOL</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 86, lineHeight: 1, color: LIME, letterSpacing: -3, marginTop: 10}}>$200</div>
          <div style={{fontFamily: MONO, fontSize: 16, color: '#9AA39C', marginTop: 4, letterSpacing: 1}}>in Futures vouchers</div>
          <div style={{fontFamily: MONO, fontSize: 16, color: CREAM, marginTop: 18, lineHeight: 1.6}}>1st $80 · 2nd $50 · 3rd $30<br />+ 4 random × $10</div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#9AA39C'}}>HOW TO ENTER</div>
          {['Follow @HotcoinGlobal', 'Like + repost this post', 'Reply with your 6-word crypto horror story'].map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, fontFamily: '"Inter Tight", sans-serif', fontWeight: 600, fontSize: 25, lineHeight: 1.2}}>
              <span style={{flex: 'none', width: 38, height: 38, borderRadius: 19, background: LIME, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</span>{s}
            </div>
          ))}
          <div style={{marginTop: 'auto', fontFamily: MONO, fontSize: 17, letterSpacing: 2, color: LIME}}>ENDS OCT 31 · 23:59 UTC 👻</div>
        </div>
      </div>
      <Film g={7} card={false} still />
    </AbsoluteFill>
  );
};
