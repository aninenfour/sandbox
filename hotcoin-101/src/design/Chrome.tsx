import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { COLOR, SERIES } from './tokens';
import { FF } from './fonts';
import { useLayout } from './layout';
import { useTheme } from './theme';

/**
 * PLACEHOLDER MARK.
 * Drop the real logo at public/hotcoin-mark.png (or .svg) and it is picked up
 * automatically. Until then this draws a neutral circular mark in brand green.
 */
export const LOGO_FILE: string | null = 'hotcoin-mark.png';
export const LOCKUP_FILE = 'hotcoin-lockup.png';

/** Full horizontal lockup: mark plus HOTCOIN wordmark. */
export const LogoLockup: React.FC<{ width: number }> = ({ width }) => (
  <Img src={staticFile(LOCKUP_FILE)} style={{ width, height: 'auto' }} />
);

export const LogoMark: React.FC<{ size: number; color?: string }> = ({
  size,
  color = COLOR.green,
}) => {
  if (LOGO_FILE) {
    return (
      <Img
        src={staticFile(LOGO_FILE)}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill={color} />
      <path
        d="M32 68 L32 32 L44 32 L44 45 L56 45 L56 32 L68 32 L68 68 L56 68 L56 55 L44 55 L44 68 Z"
        fill={COLOR.paper}
      />
    </svg>
  );
};

export const SeriesChrome: React.FC<{
  episode: string;
  pillar: string;
  dark?: boolean;
  hideProgress?: boolean;
}> = ({ episode, pillar, dark = false, hideProgress }) => {
  const { safe, u, type, chrome } = useLayout();
  const t = useTheme();
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const inkC = dark ? COLOR.paper : t.ink;
  const faintC = dark ? 'rgba(239,233,220,0.55)' : t.inkFaint;

  const enter = interpolate(frame, [0, 18 * (fps / 30)], [0, 1], { extrapolateRight: 'clamp' });
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const barY = chrome.railTop;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: enter }}>
      {/* header rail */}
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: safe.right,
          top: barY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {t.dark ? (
          // On black the series name is carried by the reversed lockup itself,
          // so the rail is the logo plus the pillar and nothing else.
          <div style={{ display: 'flex', alignItems: 'center', gap: 1.4 * u }}>
            <Img
              src={staticFile('hotcoin-lockup-dark.png')}
              style={{ height: 2.9 * u, width: 'auto' }}
            />
            <div style={{ width: 1, height: 2.2 * u, background: faintC, opacity: 0.6 }} />
            <div
              style={{
                fontFamily: FF.mono,
                fontSize: type.kicker,
                letterSpacing: 3,
                color: faintC,
              }}
            >
              {pillar.toUpperCase()}
            </div>
          </div>
        ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 1.4 * u }}>
          <LogoMark size={3.1 * u} />
          <div
            style={{
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 4,
              fontWeight: 600,
              color: inkC,
            }}
          >
            {SERIES.name}
          </div>
          <div style={{ width: 1, height: 2.2 * u, background: faintC, opacity: 0.6 }} />
          <div
            style={{
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 3,
              color: faintC,
            }}
          >
            {pillar.toUpperCase()}
          </div>
        </div>
        )}
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3,
            color: t.dark ? COLOR.green : faintC,
          }}
        >
          {episode}
        </div>
      </div>

      {/* footer progress rule */}
      {hideProgress ? null : (
        <div
          style={{
            position: 'absolute',
            left: safe.left,
            right: safe.right,
            bottom: chrome.progressBottom,
          }}
        >
          <div style={{ height: 2, background: dark ? 'rgba(239,233,220,0.18)' : t.rule }}>
            <div
              style={{
                height: 2,
                width: `${progress * 100}%`,
                background: t.green,
                boxShadow: t.accentGlow,
              }}
            />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
