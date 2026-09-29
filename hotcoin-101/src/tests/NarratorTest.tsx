import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Paper } from '../design/Paper';
import { Narrator, Mood } from '../design/Narrator';
import { COLOR } from '../design/tokens';
import { FF } from '../design/fonts';

const MOODS: Mood[] = ['neutral', 'curious', 'thinking', 'alert', 'pleased', 'aside'];

export const NarratorTest: React.FC = () => (
  <AbsoluteFill>
    <Paper marks={false}>
      <AbsoluteFill
        style={{
          padding: 70,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 54,
        }}
      >
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: 20,
            letterSpacing: 4,
            color: COLOR.inkFaint,
            textTransform: 'uppercase',
          }}
        >
          Narrator · mood range
        </div>

        {/* unframed */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
          {MOODS.map((m, i) => (
            <div key={m} style={{ textAlign: 'center' }}>
              <Narrator mood={m} size={130} seed={i * 17} />
              <div
                style={{
                  fontFamily: FF.mono,
                  fontSize: 15,
                  letterSpacing: 2,
                  color: COLOR.inkFaint,
                  marginTop: 14,
                  textTransform: 'uppercase',
                }}
              >
                {m}
              </div>
            </div>
          ))}
        </div>

        {/* framed, at the size it would actually sit on a page */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
          {MOODS.slice(0, 4).map((m, i) => (
            <Narrator key={m} mood={m} size={92} seed={i * 23} framed label={m} />
          ))}
        </div>
      </AbsoluteFill>
    </Paper>
  </AbsoluteFill>
);
