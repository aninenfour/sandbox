// The cutout guy: flat construction-paper look, a big round head whose top half flaps open when he talks,
// beady eyes, a squat body and mitten hands. Drawn in a 400 x 500 box, feet at y = 500, facing three-quarters right.
// jaw 0..1 opens the head (drive it from the voiceover), step is a walk phase in radians.
import React from 'react';

export type GuyOutfit = {top: string; topSh: string; pants: string; shoes: string; hair: string; hat?: string; hatBand?: string; scarf?: string; mitts?: string};
export const GUY: Record<string, GuyOutfit> = {
  autumn: {top: '#C2462E', topSh: '#99331F', pants: '#3E4B6B', shoes: '#2A2320', hair: '#4A2F1E', mitts: '#F2D3B3'},
  winter: {top: '#2F6B4F', topSh: '#224F3A', pants: '#2E3445', shoes: '#4A3A2E', hair: '#4A2F1E', hat: '#E3262F', hatBand: '#F2EEE6', scarf: '#F2C14E', mitts: '#F2C14E'},
  spring: {top: '#5AA0D8', topSh: '#3F80B5', pants: '#E8DCC0', shoes: '#F2EEE6', hair: '#4A2F1E', mitts: '#F2D3B3'},
};
export const GUY_SKIN = '#F6D2B0', GUY_SKIN_SH = '#E2B48E', GUY_INK = '#15161A';

// head: circle centre (200,175) r 150, split at y 200; the lid hinges at the back (52,200)
const HX = 52, HY = 200, HR = 150;
const halfW = Math.sqrt(HR * HR - (HY - 175) ** 2);

export const GuyHead: React.FC<{o: GuyOutfit; jaw?: number; mood?: 'happy' | 'shock' | 'sad' | 'smug'; look?: number}> = ({o, jaw = 0, mood = 'happy', look = 0}) => {
  const ang = jaw * 30;
  const a = (ang * Math.PI) / 180;
  const lip: [number, number] = [HX + 2 * halfW * Math.cos(a), HY - 2 * halfW * Math.sin(a)];
  const ex = look * 6;
  const brows = {happy: 'M200 104 L232 98 M252 98 L284 104', shock: 'M198 92 L230 82 M254 82 L286 92', sad: 'M200 96 L230 106 M254 106 L284 96', smug: 'M200 104 L232 104 M252 96 L284 100'}[mood];
  return (
    <g>
      {/* inside of the mouth, seen when the lid lifts */}
      {jaw > 0.02 && <>
        <path d={`M${HX} ${HY} L${HX + 2 * halfW} ${HY} L${lip[0]} ${lip[1]} Z`} fill="#4A1418" />
        <ellipse cx={HX + halfW * 1.25} cy={HY - 6} rx={halfW * 0.55} ry={10 + jaw * 14} fill="#C9545A" />
      </>}
      {/* lower jaw: stays put */}
      <path d={`M${HX} ${HY} A${HR} ${HR} 0 0 0 ${HX + 2 * halfW} ${HY} Z`} fill={GUY_SKIN} stroke={jaw > 0.02 ? "none" : GUY_SKIN} strokeWidth={3} />
      <path d={`M${HX + 30} ${HY + 60} A${HR} ${HR} 0 0 0 ${HX + 2 * halfW - 30} ${HY + 60}`} stroke={GUY_SKIN_SH} strokeWidth={10} fill="none" opacity={0.6} />
      <ellipse cx={292} cy={232} rx={20} ry={11} fill="#EE9C8C" opacity={0.55} />
      {/* the lid: dome, hair or hat, eyes, brows; rotates up around the hinge */}
      <g transform={`rotate(${-ang} ${HX} ${HY})`}>
        <path d={`M${HX} ${HY} A${HR} ${HR} 0 1 1 ${HX + 2 * halfW} ${HY} Z`} fill={GUY_SKIN} />
        {/* upper teeth strip along the lip */}
        {jaw > 0.02 && <rect x={HX + 50} y={HY - 4} width={2 * halfW - 90} height={14} rx={4} fill="#fff" />}
        {o.hat
          ? <>
              <path d={`M${HX + 6} 128 Q${HX + 10} 18 200 22 Q${HX + 2 * halfW - 10} 22 ${HX + 2 * halfW - 4} 128 Z`} fill={o.hat} />
              <rect x={HX - 2} y={112} width={2 * halfW + 4} height={34} rx={14} fill={o.hatBand} />
              <circle cx={206} cy={18} r={26} fill={o.hatBand} />
            </>
          : <path d="M54 150 Q44 34 196 24 Q330 22 346 120 Q318 92 280 98 Q300 70 258 64 Q232 92 182 90 Q196 70 160 70 Q110 100 84 104 Q66 124 54 150 Z" fill={o.hair} />}
        {/* beady eyes */}
        <ellipse cx={226 + ex} cy={140} rx={mood === 'shock' ? 13 : 10} ry={mood === 'shock' ? 15 : 13} fill={GUY_INK} />
        <ellipse cx={268 + ex} cy={140} rx={mood === 'shock' ? 12 : 9} ry={mood === 'shock' ? 14 : 12} fill={GUY_INK} />
        <circle cx={229 + ex} cy={135} r={3} fill="#fff" /><circle cx={271 + ex} cy={135} r={3} fill="#fff" />
        <path d={brows} stroke={o.hat ? GUY_INK : o.hair} strokeWidth={7} strokeLinecap="round" fill="none" />
        {/* closed mouth line when the lid is down */}
        {jaw <= 0.02 && <path d={mood === 'sad' ? 'M214 196 Q248 184 282 196' : mood === 'smug' ? 'M222 192 Q256 198 290 184' : 'M210 190 Q248 206 286 190'} stroke={GUY_INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};

export const Guy: React.FC<{o?: GuyOutfit; jaw?: number; mood?: 'happy' | 'shock' | 'sad' | 'smug'; arm?: 'down' | 'wave' | 'reach' | 'up'; step?: number; look?: number; wave?: number}> = ({o = GUY.autumn, jaw = 0, mood = 'happy', arm = 'down', step, look = 0, wave = 0}) => {
  const walking = step !== undefined;
  const lA = walking ? Math.max(0, Math.sin(step!)) * 16 : 0, lB = walking ? Math.max(0, -Math.sin(step!)) * 16 : 0;
  const bob = walking ? -Math.abs(Math.cos(step!)) * 8 : 0;
  const mitt = o.mitts ?? GUY_SKIN;
  return (
    <svg viewBox="0 0 400 500" width={400} height={500} style={{overflow: 'visible', filter: 'drop-shadow(0 5px 0 rgba(0,0,0,.18))'}}>
      <ellipse cx={200} cy={494} rx={120} ry={12} fill="rgba(0,0,0,.25)" />
      {/* legs and shoes */}
      <rect x={130} y={420 - lA} width={60} height={64} fill={o.pants} />
      <rect x={210} y={420 - lB} width={60} height={64} fill={o.pants} />
      <ellipse cx={168} cy={486 - lA} rx={50} ry={16} fill={o.shoes} />
      <ellipse cx={248} cy={486 - lB} rx={50} ry={16} fill={o.shoes} />
      <g transform={`translate(0 ${bob})`}>
        {/* back arm */}
        <path d="M118 318 L84 400 L112 412 L140 340 Z" fill={o.topSh} />
        <circle cx={96} cy={412} r={22} fill={mitt} />
        {/* torso */}
        <path d="M112 296 L288 296 L304 434 L96 434 Z" fill={o.top} />
        <path d="M200 300 L200 434" stroke={o.topSh} strokeWidth={6} />
        <rect x={96} y={420} width={208} height={16} fill={o.topSh} />
        {/* front arm */}
        {arm === 'down' && <><path d="M282 318 L316 400 L288 412 L260 340 Z" fill={o.top} /><circle cx={304} cy={412} r={22} fill={mitt} /></>}
        {arm === 'reach' && <><path d="M272 318 L372 344 L366 374 L262 352 Z" fill={o.top} /><circle cx={378} cy={360} r={22} fill={mitt} /></>}
        {(arm === 'wave' || arm === 'up') && <g transform={`rotate(${arm === 'wave' ? Math.sin(wave) * 14 : 0} 282 324)`}><path d="M270 330 L320 230 L346 244 L294 344 Z" fill={o.top} /><circle cx={334} cy={226} r={22} fill={mitt} /></g>}
        {o.scarf && <><path d="M118 292 Q200 318 284 292 L286 318 Q200 344 116 318 Z" fill={o.scarf} /><path d="M232 318 L248 384 L226 388 L214 324 Z" fill={o.scarf} /></>}
        {/* head sits right on the shoulders, no neck */}
        <GuyHead o={o} jaw={jaw} mood={mood} look={look} />
      </g>
    </svg>
  );
};
