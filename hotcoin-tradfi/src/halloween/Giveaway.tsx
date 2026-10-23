// Halloween giveaway poster (1080x1350): "Your crypto horror story in 6 words", $200 in Futures vouchers.
// Episode 1 look (forest campfire, marshmallow); the left ghost wears the witch hat. Rules live in the post, not on the poster.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Fire, Forest, Ghost, INK, LIME, Log, MONO, Marshmallow, Pumpkin, SERIF, Sky, useFonts} from './ScaryStories';
import {WitchHat} from './ScaryStories2';

export const HalloweenGiveaway: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Sky t={t} />
      <Forest />
      <Pumpkin x={980} y={860} s={0.9} t={t} />
      <Pumpkin x={950} y={1230} s={1.1} t={t + 1} />
      <Log x={540} y={890} w={300} r={0} />
      <Ghost id="gm" x={540} y={915} s={1.3} t={t} face="tell" arms={['up', 'hold']} light={1} warm={1}>
        <g><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>
      </Ghost>
      <Log x={225} y={1035} w={270} r={14} />
      <Log x={855} y={1035} w={270} r={-14} />
      <Fire t={t} boost={0.4} />
      <Ghost id="gl" x={235} y={1035} s={1.18} t={t} face="shock" arms={['up', 'up']} ph={1.3} warm={1}><WitchHat t={t} /></Ghost>
      <Ghost id="gr" x={850} y={1035} s={1.18} t={t} face="happy" arms={['side', 'hold']} ph={2.6} warm={-1} />
      <Marshmallow t={t} state="raw" ang={0} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,30,0.8) 0%, rgba(10,12,30,0.45) 24%, rgba(10,12,30,0) 38%)'}} />

      <div style={{position: 'absolute', left: 60, right: 60, top: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 190, height: (190 * 328) / 2005}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: 4, color: INK, background: LIME, borderRadius: 999, padding: '9px 18px'}}>🎃 HALLOWEEN GIVEAWAY</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 122, textAlign: 'center', color: CREAM, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 96, lineHeight: 1}}>Your crypto horror story</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, lineHeight: 1.1, color: LIME}}>in 6 words or less.</div>
      </div>

      {/* the Teller announces the prize */}
      <Bubble f={60} w={600} h={210} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 5, color: '#5A6478'}}>WIN A SHARE OF</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 104, lineHeight: 1, letterSpacing: -4, marginTop: 4}}>$200</div>
          <div style={{fontFamily: MONO, fontSize: 16, color: '#5A6478', marginTop: 6, letterSpacing: 1}}>in Futures vouchers</div>
        </div>
      </Bubble>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1212, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: LIME, color: INK, borderRadius: 999, padding: '16px 30px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, boxShadow: '0 14px 30px rgba(10,12,30,0.45)'}}>
          REPLY WITH YOURS 👇
        </div>
      </div>
      <Film g={7} card={false} still />
    </AbsoluteFill>
  );
};
