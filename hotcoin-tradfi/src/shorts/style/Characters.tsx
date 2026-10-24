// Character options for the journey Shorts redo. All drawn in a 300 x 900 box (feet at y = 900), facing slightly right.
// Same box for every design so they can be swapped into the same scenes.
import React from 'react';

export const SKIN = '#F1C9A5', SKIN_SH = '#D9A57E', HAIR = '#3A2A20', INK = '#14161C';

type Outfit = {top: string; topSh: string; pants: string; pantsSh: string; shoes: string; hat?: string; scarf?: string};
export const OUTFITS: Record<string, Outfit> = {
  casual: {top: '#E0A84E', topSh: '#B9833A', pants: '#3B5B8C', pantsSh: '#2C4569', shoes: '#F2EEE6'},
  winter: {top: '#2F6B4F', topSh: '#22503A', pants: '#2E3445', pantsSh: '#222735', shoes: '#4A3A2E', hat: '#E3262F', scarf: '#F2C14E'},
  spring: {top: '#F2EEE6', topSh: '#CFC9BC', pants: '#4A5A78', pantsSh: '#38455E', shoes: '#E3262F'},
};

// B · flat human: proportions of a real person, clothes, a face that can smile and worry
export const Person: React.FC<{o?: Outfit; mood?: 'happy' | 'worried' | 'neutral'; arm?: 'down' | 'wave' | 'reach'; look?: number}> = ({o = OUTFITS.casual, mood = 'happy', arm = 'down', look = 0}) => {
  const mouth = mood === 'happy' ? 'M128 168 Q146 186 166 168' : mood === 'worried' ? 'M130 180 Q146 168 164 180' : 'M132 174 L162 174';
  return (
    <svg viewBox="0 0 300 900" width={300} height={900} style={{overflow: 'visible'}}>
      <ellipse cx={150} cy={892} rx={110} ry={16} fill="rgba(0,0,0,.28)" />
      {/* legs */}
      <path d="M108 520 L96 860 L140 860 L150 560 Z" fill={o.pantsSh} />
      <path d="M150 560 L160 860 L206 860 L196 520 Z" fill={o.pants} />
      <path d="M100 520 L200 520 L204 600 L96 600 Z" fill={o.pants} />
      {/* shoes */}
      <path d="M86 852 Q84 884 112 886 L152 886 Q160 870 142 852 Z" fill={o.shoes} stroke="rgba(0,0,0,.25)" strokeWidth={3} />
      <path d="M156 852 Q154 884 182 886 L226 886 Q234 870 212 852 Z" fill={o.shoes} stroke="rgba(0,0,0,.25)" strokeWidth={3} />
      {/* back arm */}
      <path d="M92 290 Q66 380 70 470 L98 474 Q104 390 118 300 Z" fill={o.topSh} />
      <circle cx={84} cy={486} r={20} fill={SKIN_SH} />
      {/* torso */}
      <path d="M96 270 Q150 244 204 270 L214 540 Q150 556 88 540 Z" fill={o.top} />
      <path d="M150 262 L150 540" stroke={o.topSh} strokeWidth={5} />
      <path d="M110 430 L140 430 L140 470 L110 470 Z M160 430 L190 430 L190 470 L160 470 Z" fill={o.topSh} opacity={0.6} />
      {o.scarf && <path d="M108 262 Q150 290 196 262 L198 292 Q150 318 106 292 Z M170 290 L186 380 L164 384 L156 300 Z" fill={o.scarf} />}
      {/* front arm */}
      {arm === 'down' && <><path d="M196 284 Q232 380 226 470 L200 474 Q196 392 180 300 Z" fill={o.top} /><circle cx={214} cy={488} r={21} fill={SKIN} /></>}
      {arm === 'wave' && <><path d="M196 284 Q252 220 262 120 L236 112 Q224 200 180 280 Z" fill={o.top} /><circle cx={252} cy={100} r={22} fill={SKIN} /><path d="M240 84 l-6 -16 M252 80 l0 -18 M264 84 l6 -16" stroke={SKIN_SH} strokeWidth={6} strokeLinecap="round" /></>}
      {arm === 'reach' && <><path d="M196 284 Q270 320 320 340 L312 366 Q256 350 186 316 Z" fill={o.top} /><circle cx={330} cy={352} r={21} fill={SKIN} /></>}
      {/* neck and head */}
      <rect x={134} y={222} width={32} height={46} rx={10} fill={SKIN_SH} />
      <ellipse cx={150 + look * 4} cy={150} rx={74} ry={84} fill={SKIN} />
      <ellipse cx={80 + look * 2} cy={158} rx={14} ry={20} fill={SKIN_SH} />
      {o.hat
        ? <><path d="M74 128 Q78 52 150 50 Q222 52 226 128 Z" fill={o.hat} /><rect x={70} y={116} width={160} height={26} rx={12} fill="#B81E26" /><circle cx={150} cy={44} r={18} fill="#F2EEE6" /></>
        : <path d="M76 140 Q70 60 150 56 Q226 58 228 120 Q206 96 168 100 Q190 84 150 82 Q120 96 96 98 Q84 116 76 140 Z" fill={HAIR} />}
      {/* face */}
      <ellipse cx={128 + look * 6} cy={146} rx={11} ry={13} fill="#fff" /><ellipse cx={172 + look * 6} cy={146} rx={11} ry={13} fill="#fff" />
      <circle cx={131 + look * 8} cy={148} r={7} fill={INK} /><circle cx={175 + look * 8} cy={148} r={7} fill={INK} />
      <circle cx={133 + look * 8} cy={145} r={2.2} fill="#fff" /><circle cx={177 + look * 8} cy={145} r={2.2} fill="#fff" />
      <path d={mood === 'worried' ? 'M114 124 L140 118 M160 118 L186 124' : 'M114 122 Q128 114 142 120 M158 120 Q172 114 186 122'} stroke={HAIR} strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d="M150 152 Q156 166 148 170" stroke={SKIN_SH} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={mouth} stroke={INK} strokeWidth={6} fill={mood === 'happy' ? '#9E3A3A' : 'none'} strokeLinecap="round" />
      <ellipse cx={110} cy={174} rx={12} ry={7} fill="#E8907A" opacity={0.45} /><ellipse cx={192} cy={174} rx={12} ry={7} fill="#E8907A" opacity={0.45} />
    </svg>
  );
};

// A · bean: one rounded body, stubby legs, big friendly face
export const Bean: React.FC = () => (
  <svg viewBox="0 0 300 900" width={300} height={900} style={{overflow: 'visible'}}>
    <ellipse cx={150} cy={892} rx={110} ry={16} fill="rgba(0,0,0,.28)" />
    <rect x={98} y={760} width={38} height={120} rx={18} fill="#2C4569" /><rect x={164} y={760} width={38} height={120} rx={18} fill="#2C4569" />
    <ellipse cx={118} cy={882} rx={34} ry={14} fill="#F2EEE6" /><ellipse cx={184} cy={882} rx={34} ry={14} fill="#F2EEE6" />
    <rect x={50} y={330} width={200} height={460} rx={100} fill="#7BC47F" />
    <rect x={50} y={330} width={200} height={460} rx={100} fill="url(#beanSh)" />
    <defs><linearGradient id="beanSh" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.25)" /><stop offset="1" stopColor="rgba(0,0,0,.18)" /></linearGradient></defs>
    <rect x={34} y={520} width={40} height={140} rx={20} fill="#5FA463" transform="rotate(10 54 520)" /><rect x={226} y={520} width={40} height={140} rx={20} fill="#5FA463" transform="rotate(-10 246 520)" />
    <ellipse cx={120} cy={450} rx={24} ry={30} fill="#fff" /><ellipse cx={180} cy={450} rx={24} ry={30} fill="#fff" />
    <circle cx={126} cy={456} r={13} fill={INK} /><circle cx={186} cy={456} r={13} fill={INK} />
    <path d="M114 520 Q150 552 188 520" stroke={INK} strokeWidth={8} fill="#9E3A3A" strokeLinecap="round" />
  </svg>
);

// C · chunky mannequin: glossy white, thick limbs, no face
export const Mannequin: React.FC = () => (
  <svg viewBox="0 0 300 900" width={300} height={900} style={{overflow: 'visible'}}>
    <defs>
      <radialGradient id="mq" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#fff" /><stop offset="0.7" stopColor="#E3E5EB" /><stop offset="1" stopColor="#AEB2BE" /></radialGradient>
      <linearGradient id="mql" x1="0" x2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#C3C6D0" /></linearGradient>
    </defs>
    <ellipse cx={150} cy={892} rx={110} ry={16} fill="rgba(0,0,0,.28)" />
    <rect x={102} y={540} width={44} height={340} rx={22} fill="url(#mql)" /><rect x={156} y={540} width={44} height={340} rx={22} fill="url(#mql)" />
    <rect x={92} y={250} width={116} height={320} rx={50} fill="url(#mql)" />
    <rect x={56} y={270} width={40} height={250} rx={20} fill="url(#mql)" transform="rotate(8 76 270)" /><rect x={204} y={270} width={40} height={250} rx={20} fill="url(#mql)" transform="rotate(-8 224 270)" />
    <circle cx={150} cy={150} r={86} fill="url(#mq)" />
  </svg>
);
