import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Companion} from '../companion/Companion';
import {FONT} from '../notebook/tokens';
import {Booth, CREAM, Parcel} from '../ep20/art';
import {Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 020 thumbnails, kit v2. Each leads with a hook, not a topic name.
// A: the question everyone has asked (why did I pay $50 to send $20?).
// B: the real number (over $150M burned on gas in one night, Otherside 2022), with the real image.

const {INK, RED, YELLOW, PAPER} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NewsShot: React.FC<{x: number; y: number; w: number; h: number; rot: number}> = ({x, y, w, h, rot}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      padding: 18,
      boxSizing: 'border-box',
      background: CREAM,
      border: `5px solid ${INK}`,
      borderRadius: 12,
      boxShadow: '0 22px 50px rgba(0,0,0,0.55)',
      transform: `rotate(${rot}deg)`,
    }}
  >
    <div style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: RED}}>30 APR 2022 · ETHEREUM</div>
    <div style={{fontFamily: FONT.display, fontSize: 58, lineHeight: 1.05, color: INK, textTransform: 'uppercase'}}>Otherside land sale</div>
    <Img src={staticFile('ep20/otherside.png')} style={{width: '100%', height: h - 150, objectFit: 'cover', objectPosition: '50% 35%', display: 'block', marginTop: 10, borderRadius: 6}} />
  </div>
);

export const Thumb20A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="78% 52%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1690 1030) scale(1.3)">
            <Booth sign="$50" signColor={RED} />
          </g>
          <g transform="translate(1250 1030) scale(1.15)">
            <Parcel tag="$20" />
          </g>
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t20a" trail={false} seed={5} beats={[{at: -30, x: 1390, y: 650, r: 118, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="PAID $50" x={78} y={450} size={300} rot={-3} />
      <Line W={W} H={H} text="TO SEND $20?" x={104} y={760} size={210} rot={-3} box={RED} />
      <Pill text="WHY GAS FEES SPIKE" x={90} y={880} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

/** dark backdrop with a faint block grid and a red gas-price spike climbing behind everything */
const SpikeBackdrop: React.FC<{W: number; H: number; glowAt: string}> = ({W, H, glowAt}) => {
  const cell = 64;
  const pts = Array.from({length: 26}).map((_, i) => {
    const x = (i / 25) * W;
    const calm = H * 0.86 + Math.sin(i * 1.7) * 18;
    const spike = i > 17 ? (i - 17) / 8 : 0;
    return `${x} ${calm - spike * spike * H * 0.75 + (i % 2 ? 26 : 0) * (1 - spike)}`;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at ${glowAt}, #5A1E14 0%, #2A1210 30%, #121417 66%)`}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: Math.ceil(W / cell) * Math.ceil(H / cell)}).map((_, i) => {
          const cx = (i % Math.ceil(W / cell)) * cell;
          const cy = Math.floor(i / Math.ceil(W / cell)) * cell;
          return <rect key={i} x={cx + 6} y={cy + 6} width={cell - 12} height={cell - 12} rx={8} fill="none" stroke="#ffffff" strokeOpacity={0.045} strokeWidth={2} />;
        })}
        <path d={`M ${pts.join(' L ')} L ${W} ${H} L 0 ${H} Z`} fill="rgba(240,69,63,0.16)" />
        <path d={`M ${pts.join(' L ')}`} stroke="#F0453F" strokeWidth={10} fill="none" strokeLinejoin="round" opacity={0.85} />
        <path d={`M ${pts.join(' L ')}`} stroke="#F0453F" strokeWidth={30} fill="none" strokeLinejoin="round" opacity={0.18} />
      </svg>
    </AbsoluteFill>
  );
};

const Card: React.FC<{x: number; y: number; w: number; imgH: number; rot: number; date: string; title: string; src: string; pos?: string; titleSize?: number}> = ({x, y, w, imgH, rot, date, title, src, pos = '50% 50%', titleSize = 50}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y,
      width: w,
      padding: 16,
      boxSizing: 'border-box',
      background: CREAM,
      border: `5px solid ${INK}`,
      borderRadius: 12,
      boxShadow: '0 22px 50px rgba(0,0,0,0.6)',
      transform: `rotate(${rot}deg)`,
    }}
  >
    <div style={{fontFamily: FONT.mono, fontSize: titleSize * 0.42, letterSpacing: 3, color: RED}}>{date}</div>
    <div style={{fontFamily: FONT.display, fontSize: titleSize, lineHeight: 1.05, color: INK, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{title}</div>
    <Img src={staticFile(src)} style={{width: '100%', height: imgH, objectFit: 'cover', objectPosition: pos, display: 'block', marginTop: 8, borderRadius: 6}} />
  </div>
);

const Polaroid: React.FC<{x: number; y: number; w: number; rot: number; name: string}> = ({x, y, w, rot, name}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, padding: 12, paddingBottom: 10, boxSizing: 'border-box', background: PAPER, border: `5px solid ${INK}`, borderRadius: 10, boxShadow: '0 18px 40px rgba(0,0,0,0.6)', transform: `rotate(${rot}deg)`}}>
    <Img src={staticFile('ep20/vitalik.jpg')} style={{width: '100%', height: w * 1.05, objectFit: 'cover', objectPosition: '50% 22%', display: 'block', borderRadius: 4}} />
    <div style={{fontFamily: FONT.display, fontSize: w * 0.13, color: INK, marginTop: 6, textAlign: 'center', textTransform: 'uppercase'}}>{name}</div>
  </div>
);

export const Thumb20B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <SpikeBackdrop W={W} H={H} glowAt="74% 48%" />
      <Sticker>
        <Card x={1290} y={110} w={430} imgH={250} rot={-9} date="DEC 2017" title="CryptoKitties" src="ep20/cryptokitties.png" pos="50% 62%" titleSize={44} />
      </Sticker>
      <Sticker>
        <Polaroid x={1780} y={70} w={250} rot={9} name="Vitalik" />
      </Sticker>
      <Sticker>
        <Card x={1530} y={400} w={640} imgH={400} rot={4} date="30 APR 2022 · ETHEREUM" title="Otherside land sale" src="ep20/otherside.png" pos="50% 35%" />
      </Sticker>
      <Sticker o={12}>
        <Companion id="t20b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1170, y: 860, r: 165, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$150M" x={78} y={470} size={330} rot={-3} />
      <Line W={W} H={H} text="ON GAS FEES" x={104} y={770} size={190} rot={-3} box={RED} />
      <Pill text="IN ONE NIGHT · 2022" x={90} y={880} size={54} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb20AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 68%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(790 1560) scale(1.3)">
            <Booth sign="$50" signColor={RED} />
          </g>
          <g transform="translate(300 1560) scale(1.25)">
            <Parcel tag="$20" />
          </g>
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t20av" trail={false} seed={5} beats={[{at: -30, x: 300, y: 1140, r: 125, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="PAID $50" x={540} y={600} size={250} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="TO SEND $20?" x={540} y={850} size={160} rot={-3} anchor="middle" box={RED} />
      <Pill text="WHY GAS FEES SPIKE" x={540} y={1600} size={44} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb20BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <SpikeBackdrop W={W} H={H} glowAt="50% 64%" />
      <Sticker>
        <Card x={300} y={930} w={420} imgH={240} rot={-8} date="DEC 2017" title="CryptoKitties" src="ep20/cryptokitties.png" pos="50% 62%" titleSize={42} />
      </Sticker>
      <Sticker>
        <Polaroid x={850} y={900} w={250} rot={8} name="Vitalik" />
      </Sticker>
      <Sticker>
        <Card x={590} y={1150} w={700} imgH={330} rot={3} date="30 APR 2022 · ETHEREUM" title="Otherside land sale" src="ep20/otherside.png" pos="50% 35%" />
      </Sticker>
      <Sticker o={10}>
        <Companion id="t20bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 200, y: 1500, r: 125, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$150M" x={540} y={620} size={300} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="ON GAS FEES" x={540} y={850} size={150} rot={-3} anchor="middle" box={RED} />
      <Pill text="IN ONE NIGHT · 2022" x={540} y={1610} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
