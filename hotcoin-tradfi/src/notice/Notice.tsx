// "Important announcement" notice cards (1600 x 900): big headline, subject line with coin logos, status pill,
// a calendar date tile and a timeline. Hotcoin symbol as a faint watermark. Coin logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const INK = '#0B0E11', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

type Step = [string, string, string, boolean];
type Props = {logos: string[]; subject: string; pill: string; month: string; day: string; weekday: string; steps: Step[]};

const NoticeCard: React.FC<Props> = ({logos, subject, pill, month, day, weekday, steps}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 90% at 85% 100%, #EEF9E0 0%, #FFFFFF 60%)', color: INK, fontFamily: SANS, padding: '64px 80px 64px', overflow: 'hidden'}}>
      {/* huge Hotcoin symbol as a watermark pattern */}
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', width: 1250, height: 1250, right: -330, top: -150, filter: 'brightness(0)', opacity: 0.045, transform: 'rotate(-8deg)'}} />
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', width: 520, height: 520, left: -170, bottom: -230, filter: 'brightness(0)', opacity: 0.035, transform: 'rotate(12deg)'}} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 180, height: (180 * 328) / 2003}} />
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', gap: 60, marginTop: 0}}>
        <div style={{width: 680, display: 'flex', flexDirection: 'column'}}>
          <div style={{flex: 1}} />
          <div style={{fontWeight: 600, fontSize: 96, lineHeight: 0.96, letterSpacing: -4.2}}>Important<br /><span style={{color: MUTED}}>announcement.</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 34}}>
            <div style={{display: 'flex'}}>
              {logos.map((l, i) => <Img key={l} src={staticFile(l)} style={{width: 52, height: 52, borderRadius: 26, border: `2px solid #fff`, boxShadow: `0 0 0 1px ${LINE}`, marginLeft: i ? -14 : 0, background: '#fff'}} />)}
            </div>
            <span style={{fontWeight: 600, fontSize: 34, letterSpacing: -0.8}}>{subject}</span>
          </div>
          <div style={{display: 'inline-flex', marginTop: 34, alignSelf: 'flex-start', alignItems: 'center', gap: 14, background: LIME, border: `2px solid ${INK}`, borderRadius: 100, padding: '14px 26px'}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: GREEN, border: `1.5px solid ${INK}`}} />
            <span style={{fontWeight: 600, fontSize: 28}}>{pill}</span>
          </div>
          <div style={{flex: 1}} />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, marginBottom: 22}}>
            <div style={{background: INK, color: '#fff', borderRadius: 24, padding: '14px 22px 16px', textAlign: 'center', minWidth: 132}}>
              <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: LIME}}>{month}</div>
              <div style={{fontWeight: 600, fontSize: 84, lineHeight: 0.95, letterSpacing: -4}}>{day}</div>
            </div>
            <div style={{paddingBottom: 8}}>
              <div style={{fontWeight: 600, fontSize: 44, letterSpacing: -1.5, lineHeight: 1}}>{weekday}</div>
              <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: 2, color: MUTED, marginTop: 10}}>2026 · ALL TIMES UTC+8</div>
            </div>
          </div>
          {steps.map(([t, a, b, hot], i) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 26px', marginBottom: i < steps.length - 1 ? 12 : 0, borderRadius: 22,
              background: hot ? INK : 'rgba(255,255,255,0.72)', color: hot ? '#fff' : INK, border: hot ? 'none' : `1px solid ${LINE}`, boxShadow: hot ? '0 18px 40px rgba(11,14,17,0.18)' : '0 8px 24px rgba(11,14,17,0.05)', backdropFilter: 'blur(6px)'}}>
              <div style={{width: 150, fontWeight: 600, fontSize: 46, letterSpacing: -2, color: hot ? LIME : INK}}>{t}</div>
              <div>
                <div style={{fontWeight: 600, fontSize: 27}}>{a}</div>
                <div style={{fontSize: 20, color: hot ? 'rgba(255,255,255,0.65)' : MUTED, marginTop: 4}}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ETH network wallet maintenance, announcement of 14 Oct 2026
export const EthMaintenance: React.FC = () => (
  <NoticeCard logos={['chains26/ethereum.png']} subject="ETH network wallet maintenance" pill="Trading is not affected" month="OCT" day="15" weekday="Thursday"
    steps={[['13:55', 'Deposits & withdrawals paused', 'ETH network tokens', false], ['14:00', 'Maintenance starts', 'about 1 hour', true], ['~15:00', 'Deposits & withdrawals resume', 'no further notice', false]]} />
);

// Zano network services and ZANO / fUSD spot trading resume, announcement of 15 Oct 2026
export const ZanoResume: React.FC = () => (
  <NoticeCard logos={['notice/zano.png', 'notice/fusd.png']} subject="Zano network services resume" pill="Maintenance completed" month="OCT" day="15" weekday="Thursday"
    steps={[['Done', 'Zano network maintenance', 'completed', false], ['18:00', 'Deposits & withdrawals resume', 'ZANO and fUSD via the Zano network', true], ['18:00', 'Spot trading resumes', 'ZANO and fUSD', false]]} />
);
