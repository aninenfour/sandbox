import React from 'react';
import {Composition} from 'remotion';
import {real, RENDER_FPS} from './design/clock';
import {EYE_TOTAL, EyeLab} from './lab/EyeLab';
import {LAB_TOTAL, StyleLab} from './lab/StyleLab';

// Episode compositions follow the series convention `${slug}-vertical` and
// `${slug}-horizontal`. The lab comps are for signing off the new look.
const formats = [
  {suffix: 'horizontal', width: 1920, height: 1080},
  {suffix: 'vertical', width: 1080, height: 1920},
] as const;

export const Root: React.FC = () => (
  <>
    {formats.map((fm) => (
      <React.Fragment key={fm.suffix}>
        <Composition id={`lab-style-${fm.suffix}`} component={StyleLab} durationInFrames={real(LAB_TOTAL)} fps={RENDER_FPS} width={fm.width} height={fm.height} />
        <Composition id={`lab-eye-${fm.suffix}`} component={EyeLab} durationInFrames={real(EYE_TOTAL)} fps={RENDER_FPS} width={fm.width} height={fm.height} />
      </React.Fragment>
    ))}
  </>
);
