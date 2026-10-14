// Policy Pulse: four 1080 x 1350 slides on politics and crypto, in the Pulse light style with new chart forms
// (step columns, impact dot rows, a prediction-market line, a Senate hemicycle).
// Data (14 Oct 2026): crypto political giving per cycle (OpenSecrets / Breadcrumbs via CNBC; Fairshake cash per its
// Jan 2026 filing coverage), BTC daily closes (Coinbase), Polymarket "Clarity Act signed into law in 2026?",
// Senate roll call 15 Sep 2026 (49-50), House 17 Jul 2025 (294-134), Senate Banking 14 May 2026 (15-9).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import data from './data.json';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44', RED = '#E5484D', BODY = '#4A5058';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '400 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

type Art = {src: string; right: number; top: number; size: number; rot: number; op?: number};
const Frame: React.FC<{page: string; art?: Art; source: string; children: React.ReactNode}> = ({page, art, source, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      {art ? <Img src={staticFile(art.src)} style={{position: 'absolute', right: art.right, top: art.top, width: art.size, height: art.size, transform: `rotate(${art.rot}deg)`, opacity: art.op ?? 0.5,
        WebkitMaskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)', maskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)'}} /> : null}
      <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, color: INK, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px', background: BG}}>POLICY PULSE · {page}</div>
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      <div style={{fontFamily: MONO, fontSize: 13.5, color: MUTED, letterSpacing: 0.3, lineHeight: 1.5}}>{source} · {data.asOf} · Not financial advice</div>
    </AbsoluteFill>
  );
};
const Title: React.FC<{a: string; b: string}> = ({a, b}) => (
  <div style={{position: 'relative', marginTop: 64, fontWeight: 600, fontSize: 100, lineHeight: 0.98, letterSpacing: -4.3}}>{a}<br /><span style={{color: MUTED}}>{b}</span></div>
);
const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 14}}>{children}</div>;

// ---------- 1: the money ----------
export const PolicyMoney: React.FC = () => {
  const CH = 430, max = 200;
  return (
    <Frame page="1/4" source="Data: OpenSecrets and Breadcrumbs via CNBC (2020 to 2024 industry giving), Fairshake filings via The Block (2026)"
      art={{src: 'policy26/bitcoin-engraved.png', right: -260, top: 90, size: 860, rot: -10}}>
      <Title a="Crypto bought" b="a seat." />
      <div style={{position: 'relative', marginTop: 50, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7}}>13×</div>
        <div style={{fontSize: 26, color: BODY, lineHeight: 1.25, paddingBottom: 6}}>more crypto money in US<br />elections, 2020 to 2024</div>
      </div>
      <div style={{flex: 1}} />
      <Kicker>POLITICAL MONEY PER ELECTION CYCLE</Kicker>
      <div style={{position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 18, height: CH + 70, background: 'rgba(255,255,255,0.85)', borderRadius: 24}}>
        {data.money.map((m, i) => {
          const now = i === data.money.length - 1;
          return (
            <div key={m.y} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-end', height: '100%'}}>
              <div style={{fontWeight: 600, fontSize: 40, letterSpacing: -1.5, marginBottom: 8, textAlign: 'center'}}>${m.v}M{i === 2 ? '+' : ''}</div>
              <div style={{height: (m.v / max) * CH, borderRadius: 20, border: `2px solid ${INK}`,
                background: now ? `repeating-linear-gradient(135deg, ${LIME} 0 14px, #D9F7B0 14px 28px)` : i === 2 ? LIME : SOFT}} />
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 18, marginTop: 14, marginBottom: 34}}>
        {data.money.map((m, i) => (
          <div key={m.y} style={{flex: 1, textAlign: 'center'}}>
            <div style={{fontSize: 24, fontWeight: 600}}>{m.y}</div>
            <div style={{fontSize: 17, color: MUTED, marginTop: 2}}>{i === 3 ? 'war chest, one PAC' : 'industry giving'}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 2: politics moves price ----------
const fmtDate = (d: string) => {const [, m, day] = d.split('-'); return `${parseInt(day, 10)} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m, 10) - 1]}`;};
export const PolicyMoves: React.FC = () => {
  const years = Object.keys(data.tops) as (keyof typeof data.tops)[];
  return (
    <Frame page="2/4" source="Data: BTC daily closes (Coinbase); causes from contemporaneous news coverage"
      art={{src: 'policy26/bitcoin-engraved.png', right: -170, top: -130, size: 520, rot: 8, op: 0.45}}>
      <Title a="Politics moved" b="the price." />
      <div style={{fontSize: 27, color: BODY, marginTop: 24, lineHeight: 1.3}}>BTC's 5 biggest daily moves each year,<br />and how many came from Washington.</div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 26}}>
        {years.map((y) => {
          const rows = data.tops[y];
          const n = rows.filter((r) => r.pol).length;
          const peak = n === 5;
          return (
            <div key={y} style={{borderRadius: 26, padding: '22px 26px', background: peak ? LIME : SOFT, border: peak ? `2px solid ${INK}` : `1px solid ${LINE}`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontWeight: 600, fontSize: 30}}>{y}</div>
                <div style={{fontWeight: 600, fontSize: 30}}>{n} of 5 <span style={{fontWeight: 500, fontSize: 20, color: peak ? INK : MUTED}}>political</span></div>
              </div>
              <div style={{display: 'flex', gap: 10, marginTop: 16}}>
                {rows.map((r) => (
                  <div key={r.date} style={{flex: 1, borderRadius: 16, padding: '12px 12px 13px', background: r.pol ? INK : BG, color: r.pol ? '#fff' : INK, border: r.pol ? 'none' : `1px solid ${LINE}`, minHeight: 112}}>
                    <div style={{fontWeight: 600, fontSize: 25, letterSpacing: -0.6, color: r.pol ? (r.move > 0 ? LIME : '#FF8A8E') : r.move > 0 ? GREEN : RED}}>{r.move > 0 ? '+' : '−'}{Math.abs(r.move).toFixed(1)}%</div>
                    <div style={{fontFamily: MONO, fontSize: 12, opacity: 0.65, marginTop: 3}}>{fmtDate(r.date)}</div>
                    <div style={{fontSize: 14.5, lineHeight: 1.22, marginTop: 6, opacity: 0.92}}>{r.why}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

// ---------- 3: the odds ----------
export const PolicyOdds: React.FC = () => {
  const W = 928, H = 520, pad = {l: 56, r: 20, t: 26, b: 44};
  const pts = data.odds;
  const t0 = Date.parse(pts[0][0] as string), t1 = Date.parse('2026-10-14');
  const X = (d: string) => pad.l + ((Date.parse(d) - t0) / (t1 - t0)) * (W - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0] as string).toFixed(1)},${Y(p[1] as number).toFixed(1)}`).join(' ');
  const area = `${path} L${X(pts[pts.length - 1][0] as string)},${Y(0)} L${X(pts[0][0] as string)},${Y(0)} Z`;
  const peak = pts.reduce((a, b) => ((b[1] as number) > (a[1] as number) ? b : a));
  const ev: {d: string; label: string; sub: string; ly: number; anchor: 'middle' | 'end'}[] = [
    {d: '2026-05-14', label: 'Senate Banking 15–9', sub: '14 May', ly: 52, anchor: 'middle'},
    {d: '2026-08-07', label: 'Recess, no floor vote', sub: '7 Aug', ly: 52, anchor: 'middle'},
    {d: '2026-09-15', label: 'Cloture fails 49–50', sub: '15 Sep', ly: 196, anchor: 'end'},
  ];
  const at = (d: string) => (pts.find((p) => (p[0] as string) >= d) ?? pts[pts.length - 1])[1] as number;
  const months = ['2026-02-01', '2026-04-01', '2026-06-01', '2026-08-01', '2026-10-01'];
  return (
    <Frame page="3/4" source='Data: Polymarket, "Clarity Act (H.R.3633) signed into law in 2026?", daily price of Yes'>
      <Title a="The odds" b="collapsed." />
      <div style={{position: 'relative', marginTop: 50, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7}}>{Math.round(data.oddsNow)}%</div>
        <div style={{fontSize: 26, color: BODY, lineHeight: 1.25, paddingBottom: 6}}>chance CLARITY becomes law<br />in 2026, down from {Math.round(peak[1] as number)}%</div>
      </div>
      <div style={{flex: 1}} />
      <Kicker>PREDICTION MARKET ODDS, 2026</Kicker>
      <svg width={W} height={H} style={{marginBottom: 30, overflow: 'visible'}}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={Y(v)} y2={Y(v)} stroke={LINE} strokeWidth={1} />
            <text x={pad.l - 12} y={Y(v) + 5} textAnchor="end" fontFamily="JetBrains Mono" fontSize={14} fill={MUTED}>{v}%</text>
          </g>
        ))}
        {months.map((m) => <text key={m} x={X(m)} y={H - 12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={14} fill={MUTED}>{['Feb', 'Apr', 'Jun', 'Aug', 'Oct'][months.indexOf(m)]}</text>)}
        <path d={area} fill={LIME} opacity={0.35} />
        <path d={path} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        {ev.map((e) => {
          const x = X(e.d), y = Y(at(e.d));
          return (
            <g key={e.d}>
              <line x1={x} x2={x} y1={e.ly + 30} y2={y - 8} stroke={INK} strokeWidth={1.2} strokeDasharray="3 4" />
              <circle cx={x} cy={y} r={7} fill={BG} stroke={INK} strokeWidth={2.5} />
              <rect x={e.anchor === 'end' ? x - 214 : x - 106} y={e.ly - 20} width={e.anchor === 'end' ? 210 : 212} height={46} fill={BG} opacity={0.9} />
              <text x={e.anchor === 'end' ? x - 6 : x} y={e.ly} textAnchor={e.anchor} fontFamily="Inter Tight" fontWeight={600} fontSize={19} fill={INK}>{e.label}</text>
              <text x={e.anchor === 'end' ? x - 6 : x} y={e.ly + 20} textAnchor={e.anchor} fontFamily="JetBrains Mono" fontSize={13} fill={MUTED}>{e.sub}</text>
            </g>
          );
        })}
        <circle cx={X(peak[0] as string)} cy={Y(peak[1] as number)} r={8} fill={LIME} stroke={INK} strokeWidth={2.5} />
        <text x={X(peak[0] as string) + 14} y={Y(peak[1] as number) - 10} fontFamily="Inter Tight" fontWeight={600} fontSize={19} fill={INK}>Peak {Math.round(peak[1] as number)}%</text>
      </svg>
    </Frame>
  );
};

// ---------- 4: the vote ----------
const hemicycle = (n: number, rows: number, R0: number, R1: number) => {
  const radii = Array.from({length: rows}, (_, i) => R0 + ((R1 - R0) * i) / (rows - 1));
  const total = radii.reduce((s, r) => s + r, 0);
  const seats: {x: number; y: number; a: number}[] = [];
  let left = n;
  radii.forEach((r, i) => {
    const k = i === rows - 1 ? left : Math.round((n * r) / total);
    left -= k;
    for (let j = 0; j < k; j++) {
      const a = Math.PI * (1 - j / (k - 1));
      seats.push({x: r * Math.cos(a), y: -r * Math.sin(a), a});
    }
  });
  return seats.sort((p, q) => q.a - p.a);
};
export const PolicyVote: React.FC = () => {
  const {yes, no, nv, need} = data.vote;
  const seats = hemicycle(100, 6, 210, 400);
  const W = 928, cx = W / 2, cy = 430;
  const col = (i: number) => (i < yes ? LIME : i < yes + nv ? '#C9CDC6' : INK);
  const aNeed = Math.PI * (1 - need / 100);
  return (
    <Frame page="4/4" source="Data: Senate roll call on cloture, H.R.3633, 15 Sep 2026; House roll call 17 Jul 2025; Senate Banking markup 14 May 2026">
      <Title a="11 votes short." b="Ethics broke it." />
      <div style={{flex: 1}} />
      <svg width={W} height={470} style={{overflow: 'visible'}}>
        {seats.map((s, i) => <circle key={i} cx={cx + s.x} cy={cy + s.y} r={15.5} fill={col(i)} stroke={col(i) === LIME ? INK : 'none'} strokeWidth={1.5} />)}
        <line x1={cx + 180 * Math.cos(aNeed)} y1={cy - 180 * Math.sin(aNeed)} x2={cx + 440 * Math.cos(aNeed)} y2={cy - 440 * Math.sin(aNeed)} stroke={RED} strokeWidth={3} strokeDasharray="8 6" />
        <text x={cx + 452 * Math.cos(aNeed)} y={cy - 452 * Math.sin(aNeed)} fontFamily="Inter Tight" fontWeight={600} fontSize={20} fill={RED}>60 needed</text>
        <text x={cx} y={cy - 70} textAnchor="middle" fontFamily="Inter Tight" fontWeight={600} fontSize={92} letterSpacing={-4} fill={INK}>{yes}–{no}</text>
        <text x={cx} y={cy - 30} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={15} fill={MUTED}>SENATE CLOTURE · {data.vote.date.toUpperCase()}</text>
      </svg>
      <div style={{display: 'flex', gap: 22, fontSize: 19, color: BODY, marginTop: 8, justifyContent: 'center'}}>
        <span><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: LIME, border: `1.5px solid ${INK}`, marginRight: 8}} />Yes {yes}</span>
        <span><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: INK, marginRight: 8}} />No {no}</span>
        <span><span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: '#C9CDC6', marginRight: 8}} />Not voting {nv}</span>
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 34, marginBottom: 30}}>
        {[
          ['THE DEAL BREAKER', 'Ethics rules on senior officials profiting from crypto, the President included', true],
          ['ALSO OPEN', 'Stablecoin yield, illicit finance, state enforcement powers', false],
          ['NEXT', 'Midterms 3 Nov. A new Congress in Jan 2027 restarts the bill', false],
        ].map(([k, v, hot]) => (
          <div key={String(k)} style={{flex: 1, borderRadius: 22, padding: '20px 20px 22px', background: hot ? LIME : SOFT, border: hot ? `2px solid ${INK}` : `1px solid ${LINE}`}}>
            <div style={{fontFamily: MONO, fontSize: 13, letterSpacing: 1.6, color: hot ? INK : MUTED}}>{k}</div>
            <div style={{fontSize: 20, fontWeight: 500, lineHeight: 1.28, marginTop: 10}}>{v}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
