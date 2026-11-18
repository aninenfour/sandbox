// Hotcoin Research (YouTube, Chinese): shared kit for the noir 3D look.
// The Green Dot from Hotcoin 101, rebuilt as a 3D object in three.js so it stays
// identical in every shot (same moods as src/companion/moods.ts), plus grain,
// subtitles, kickers and the font gate.
import React, {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, continueRender, delayRender, random, useCurrentFrame} from 'remotion';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/900.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import {blendFace, MOODS, type Mood} from '../companion/moods';

export const C = {
  ink: '#07090A',
  ink2: '#0B0E11',
  fog: '#0A1012',
  lime: '#B8F26A',
  green: '#7EC25A',
  deep: '#2F6B2A',
  paper: '#E9E6DC',
  moon: '#DCE6E2',
  dim: '#7D8A86',
};
export const ZH = '"Noto Sans SC", sans-serif';
export const MONO = '"JetBrains Mono", monospace';
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const range = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
export type V3 = [number, number, number];
export const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// ---------- fonts: wait for every glyph we use before the first frame ----------
export const FontGate: React.FC<{text: string; children: React.ReactNode}> = ({text, children}) => {
  const [handle] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const specs = ['900 64px "Noto Sans SC"', '500 64px "Noto Sans SC"', '500 40px "JetBrains Mono"', '700 40px "JetBrains Mono"'];
    Promise.all(specs.map((s) => document.fonts.load(s, text)))
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle, text]);
  return ready ? <>{children}</> : null;
};

// ---------- canvas textures ----------
export const radialTexture = (inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 256) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.25, inner.replace(/[\d.]+\)$/, '0.45)'));
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

type TextLine = {text: string; font: string; color: string; x: number; y: number; align?: CanvasTextAlign};
export const textTexture = (w: number, h: number, bg: string | null, lines: TextLine[], extra?: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  if (bg) {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
  }
  extra?.(g);
  for (const l of lines) {
    g.font = l.font;
    g.fillStyle = l.color;
    g.textAlign = l.align ?? 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(l.text, l.x, l.y);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

// ---------- camera ----------
export const useCam = () => null;

// ---------- the Green Dot, 3D ----------
export type DotProps = {
  frame: number;
  position: V3;
  r?: number;
  mood?: Mood;
  mood2?: Mood;
  mix?: number;
  look?: [number, number]; // -1..1, where the eye points
  yaw?: number; // body turn in radians
  glow?: number; // 0..1.5
  seed?: number;
  squash?: number; // 1 = round, <1 squashed
  closed?: boolean;
};

const Halo: React.FC<{size: number; opacity: number; color?: string}> = ({size, opacity, color = C.lime}) => {
  const tex = useMemo(() => radialTexture(), []);
  return (
    <sprite scale={[size, size, 1]} renderOrder={5}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
};
export {Halo};

const lidAngle = (edge: number) => -Math.asin(Math.max(-0.999, Math.min(0.999, edge)));

export const Dot3D: React.FC<DotProps> = ({frame, position, r = 1, mood = 'neutral', mood2, mix = 0, look = [0, 0], yaw = 0, glow = 1, seed = 1, squash = 1, closed}) => {
  const face = blendFace(MOODS[mood], MOODS[mood2 ?? mood], mix);
  // seeded blinks, about every 3 to 4 s, sometimes double
  const period = 96 + Math.floor(random(`blink${seed}`) * 30);
  const ph = (frame + Math.floor(random(`ph${seed}`) * period)) % period;
  const blinkAt = (p: number) => (p >= 0 && p < 7 ? Math.sin((p / 7) * Math.PI) : 0);
  const blink = Math.max(blinkAt(ph), random(`dbl${seed}${Math.floor((frame + 3) / period)}`) > 0.6 ? blinkAt(ph - 10) : 0);
  const open = closed ? 0 : face.upper * (1 - blink);
  const upperEdge = -0.08 + open * 1.0;
  const lowerEdge = -0.92 + face.lower * 0.82 * (1 - blink * 0.3);
  const tremble = face.tremble ? (random(`tr${frame}`) - 0.5) * 0.02 : 0;
  const lx = look[0] * 0.13 + tremble;
  const ly = look[1] * 0.1;
  const breathe = 1 + Math.sin(frame / 22 + seed) * 0.012;
  const browAvg = (face.browL + face.browR) / 2;
  const browRot = (face.browR - face.browL) * 0.9;
  const sclZ = 0.6;
  const scz = (x: number, y: number) => 0.78 + sclZ * Math.sqrt(Math.max(0, 0.25 * face.sclera ** 2 - x * x - y * y));
  const pupilR = 0.12 * face.pupil;

  return (
    <group position={position}>
      <pointLight color={C.lime} intensity={6 * glow * r * r} distance={9 * r} decay={2} />
      <Halo size={5.2 * r} opacity={0.32 * glow} />
      <group rotation={[-ly * 1.2, yaw + lx * 1.6, (-face.tilt * Math.PI) / 180]} scale={[r * (2 - squash) * breathe, r * squash / breathe, r]}>
        <mesh castShadow>
          <sphereGeometry args={[1, 64, 48]} />
          <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={0.22 + 0.25 * glow} roughness={0.42} metalness={0.05} />
        </mesh>
        {/* eye */}
        <group position={[0, 0.06, 0]}>
          <mesh position={[0, 0, 0.78]} scale={[face.sclera * (1 - face.squint), face.sclera, sclZ]}>
            <sphereGeometry args={[0.5, 48, 32]} />
            <meshStandardMaterial color="#F4F6F0" roughness={0.25} emissive="#ffffff" emissiveIntensity={0.08} />
          </mesh>
          <group position={[lx, ly, scz(lx, ly) + 0.004]}>
            <mesh>
              <circleGeometry args={[0.24, 48]} />
              <meshStandardMaterial color={C.deep} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <ringGeometry args={[0.2, 0.24, 48]} />
              <meshStandardMaterial color="#1D4A1C" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.004]}>
              <circleGeometry args={[pupilR, 40]} />
              <meshBasicMaterial color="#030504" />
            </mesh>
            <mesh position={[0.075, 0.08, 0.006]}>
              <circleGeometry args={[0.045, 24]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.05, -0.06, 0.006]}>
              <circleGeometry args={[0.02, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
          {/* lids: hemispheres that rotate over the eye white */}
          <group position={[0, 0, 0.78]} scale={[face.sclera * 1.02, face.sclera * 1.02, sclZ * 1.04]} rotation={[0, 0, -face.upperTilt * 0.6]}>
            <mesh rotation={[lidAngle(upperEdge), 0, 0]}>
              <sphereGeometry args={[0.515, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={0.2 + 0.22 * glow} roughness={0.45} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[lidAngle(lowerEdge), 0, 0]}>
              <sphereGeometry args={[0.512, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={0.2 + 0.22 * glow} roughness={0.45} side={THREE.DoubleSide} />
            </mesh>
          </group>
          {/* brow */}
          <mesh position={[0, 0.64 + browAvg * 0.5, 0.74]} rotation={[-0.75, 0, Math.PI * 0.22 + browRot]}>
            <torusGeometry args={[0.3, 0.035, 10, 32, Math.PI * 0.56 + face.browArch]} />
            <meshStandardMaterial color="#3F7F31" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ---------- falling snow / dust ----------
export const Particles: React.FC<{frame: number; count: number; box: [number, number, number]; center: V3; fall?: number; drift?: number; size?: number; color?: string; opacity?: number; seed?: string}> = ({
  frame,
  count,
  box,
  center,
  fall = 0.03,
  drift = 0.01,
  size = 0.06,
  color = '#dfe8e4',
  opacity = 0.8,
  seed = 'p',
}) => {
  const base = useMemo(() => {
    const a = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      a[i * 4] = random(`${seed}x${i}`);
      a[i * 4 + 1] = random(`${seed}y${i}`);
      a[i * 4 + 2] = random(`${seed}z${i}`);
      a[i * 4 + 3] = 0.5 + random(`${seed}s${i}`);
    }
    return a;
  }, [count, seed]);
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const sp = base[i * 4 + 3];
    const y = (((base[i * 4 + 1] - (frame * fall * sp) / box[1]) % 1) + 1) % 1;
    const x = (((base[i * 4] + (frame * drift * sp) / box[0] + Math.sin(frame / 40 + i) * 0.002) % 1) + 1) % 1;
    pos[i * 3] = center[0] + (x - 0.5) * box[0];
    pos[i * 3 + 1] = center[1] + (y - 0.5) * box[1];
    pos[i * 3 + 2] = center[2] + (base[i * 4 + 2] - 0.5) * box[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = useMemo(() => radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 64), []);
  return (
    <points geometry={geo}>
      <pointsMaterial size={size} map={tex} color={color} transparent opacity={opacity} depthWrite={false} sizeAttenuation />
    </points>
  );
};

// Fake volumetric light cone (additive, open ended)
export const LightCone: React.FC<{position: V3; rotation?: V3; radius: number; height: number; opacity?: number; color?: string}> = ({position, rotation = [0, 0, 0], radius, height, opacity = 0.08, color = C.moon}) => (
  <mesh position={position} rotation={rotation}>
    <coneGeometry args={[radius, height, 48, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
  </mesh>
);

// ---------- 2D overlays ----------
const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.2"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>'
)}")`;

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${f}`) * 300);
  const y = Math.floor(random(`gy${f}`) * 300);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: NOISE, backgroundPosition: `${x}px ${y}px`, opacity, mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};

// Case label in the corner: "档案 001 · 郁金香狂热 · 1637"
export const Kicker: React.FC<{no: string; title: string; year: string; at: number; vertical?: boolean}> = ({no, title, year, at, vertical}) => {
  const f = useCurrentFrame() - at;
  const o = ease(f / 10);
  const typed = Math.floor(clamp01((f - 4) / 18) * (title.length + year.length + 3));
  const tail = `${title} · ${year}`.slice(0, typed);
  return (
    <div
      style={{
        position: 'absolute',
        left: vertical ? 70 : 96,
        top: vertical ? 250 : 112,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: o,
        fontFamily: `${MONO}, ${ZH}`,
        fontWeight: 500,
        fontSize: vertical ? 30 : 24,
        letterSpacing: 2,
        color: C.paper,
      }}
    >
      <span style={{background: C.lime, color: C.ink, padding: '6px 10px', fontWeight: 700}}>档案 {no}</span>
      <span style={{opacity: 0.85}}>{tail}</span>
    </div>
  );
};

// Subtitle: one spoken line, key words in lime (wrap them in [brackets])
export const Subtitle: React.FC<{text: string; from: number; to: number; vertical?: boolean}> = ({text, from, to, vertical}) => {
  const f = useCurrentFrame();
  if (f < from - 2 || f > to + 4) return null;
  const o = Math.min(ease((f - from + 2) / 5), 1 - ease((f - to) / 5));
  const parts = text.split(/(\[[^\]]+\])/).filter(Boolean);
  return (
    <div
      style={{
        position: 'absolute',
        left: vertical ? 70 : 160,
        right: vertical ? 70 : 160,
        bottom: vertical ? 520 : 128,
        textAlign: 'center',
        fontFamily: `${ZH}`,
        fontWeight: 900,
        fontSize: vertical ? 58 : 46,
        lineHeight: 1.35,
        color: '#F4F6F0',
        opacity: o,
        textShadow: '0 2px 0 rgba(0,0,0,0.65), 0 0 18px rgba(0,0,0,0.85)',
        WebkitTextStroke: vertical ? '1.5px rgba(0,0,0,0.6)' : undefined,
      }}
    >
      {parts.map((p, i) =>
        p.startsWith('[') ? (
          <span key={i} style={{color: C.lime}}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </div>
  );
};

// Letterbox bars for the 16:9 cut
export const Bars: React.FC<{h?: number}> = ({h = 70}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#000'}} />
  </>
);

// Cross-fade wrapper: fades a layer in at `from`, out at `to`
export const Fade: React.FC<{from: number; to: number; fin?: number; fout?: number; children: React.ReactNode}> = ({from, to, fin = 10, fout = 10, children}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const o = Math.min(fin ? ease((f - from) / fin) : 1, fout ? 1 - ease((f - (to - fout)) / fout) : 1);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
