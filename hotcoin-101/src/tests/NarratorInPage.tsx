import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Paper } from '../design/Paper';
import { SeriesChrome } from '../design/Chrome';
import { SafeModeProvider } from '../design/layoutContext';
import { useLayout } from '../design/layout';
import { Narrator, Mood } from '../design/Narrator';
import { CompareBeat, FigureBeat } from '../blocks';
import { COLOR } from '../design/tokens';
import { FF } from '../design/fonts';

/** Placement options for the narrator, so we can look at them side by side. */
type Slot = 'bare' | 'framed' | 'aside';

const NarratorSlot: React.FC<{ variant: Slot; mood: Mood; line?: string }> = ({
  variant,
  mood,
  line,
}) => {
  const { u, safe, isVertical } = useLayout();
  const size = isVertical ? 13 * u : 11 * u;
  // Vertical keeps the left edge: Instagram's action rail owns the right side.
  const onLeft = isVertical;

  return (
    <div
      style={{
        position: 'absolute',
        ...(onLeft ? { left: safe.left } : { right: safe.right }),
        bottom: safe.bottom + (isVertical ? 5 * u : 1.5 * u),
        display: 'flex',
        flexDirection: onLeft ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 1.4 * u,
      }}
    >
      {variant === 'aside' && line ? (
        <div
          style={{
            fontFamily: FF.ui,
            fontStyle: 'italic',
            fontSize: 2.6 * u,
            color: COLOR.inkSoft,
            maxWidth: 40 * u,
            textAlign: onLeft ? 'left' : 'right',
            lineHeight: 1.3,
            paddingBottom: 1 * u,
          }}
        >
          {line}
        </div>
      ) : null}
      <Narrator mood={mood} size={size} framed={variant === 'framed'} />
    </div>
  );
};

export const NarratorInPage: React.FC<{ variant?: Slot }> = ({ variant = 'bare' }) => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  return (
    <SafeModeProvider value={isVertical ? 'reels' : 'standard'}>
      <AbsoluteFill>
        <Paper>
          {isVertical ? (
            <CompareBeat
              heading="Stock exchange, crypto exchange."
              leftTitle="Stock exchange"
              rightTitle="Crypto exchange"
              mode="pairs"
              rows={[
                ['Opens and closes on a schedule', 'Runs continuously'],
                ['A broker sits between you and the book', 'You often hit the book directly'],
                ['Settles a couple of days later', 'Settles in minutes'],
              ]}
            />
          ) : (
            <FigureBeat
              figure="spread"
              figNo="FIG. 03"
              caption="Bid, ask, spread"
              era="The spread"
              heading="The gap between them is the spread."
              body="It is the price of being impatient. Cross the gap and you trade immediately. Sit inside it and you wait for someone to come to you."
            />
          )}
          <NarratorSlot
            variant={variant}
            mood={variant === 'aside' ? 'curious' : 'neutral'}
            line="Cross it and you pay for the hurry."
          />
          <SeriesChrome episode="FILE 005" pillar="TradFi" />
        </Paper>
      </AbsoluteFill>
    </SafeModeProvider>
  );
};
