import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {MOODS, type Mood} from '../companion/moods';
import {useFrame} from '../design/clock';
import {Chrome, Ground, useLayout} from '../design/Notebook';
import {FONT, RED, theme} from '../design/tokens';

// Expression sheet: every mood side by side, alive (blinks, saccades,
// breathing). Halfway through, a red target wanders and every eye tracks it.
export const EYE_TOTAL = 240;

export const EyeLab: React.FC = () => {
  const f = useFrame();
  const {W, H, vertical} = useLayout();
  const moods = Object.keys(MOODS) as Mood[];
  const cols = vertical ? 2 : 5;
  const rows = Math.ceil(moods.length / cols);
  const cw = (W - (vertical ? 120 : 240)) / cols;
  const ch = (H - (vertical ? 520 : 360)) / rows;
  const ox = vertical ? 60 : 120;
  const oy = vertical ? 300 : 190;
  const r = vertical ? 78 : 64;
  const tracking = f > 110;
  const tx = W / 2 + Math.sin(f / 17) * W * 0.42;
  const ty = H / 2 + Math.sin(f / 11 + 1) * H * 0.36;
  const th = theme('paper');
  return (
    <AbsoluteFill>
      <Ground ground="paper" />
      <Chrome ground="paper" file="EYE" keys={[0, 110]} total={EYE_TOTAL} label={tracking ? 'gaze tracking' : 'moods'} />
      {moods.map((m, i) => {
        const cx = ox + cw * ((i % cols) + 0.5);
        const cy = oy + ch * (Math.floor(i / cols) + 0.42);
        return (
          <React.Fragment key={m}>
            <Companion
              id={`m${i}`}
              seed={i * 31 + 5}
              trail={false}
              beats={[
                {at: 0, x: cx, y: cy, r, mood: m, look: 'camera'},
                {at: 110, x: cx, y: cy, r, path: 'cut', mood: m, look: tracking ? {x: tx, y: ty} : 'camera'},
              ]}
            />
            <div style={{position: 'absolute', left: cx - 120, width: 240, top: cy + r + 26, textAlign: 'center', fontFamily: FONT.hand, fontWeight: 700, fontSize: 34, color: th.note}}>{m}</div>
          </React.Fragment>
        );
      })}
      {tracking && (
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <circle cx={tx} cy={ty} r={10} fill={RED} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
