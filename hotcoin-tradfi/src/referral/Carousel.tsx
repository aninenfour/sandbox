// Referral carousel v2: four 1080 x 1350 slides cut from one 4320 x 1350 render.
// One glowing 3D tube runs through all four: an infinity knot, three rings, a coil round an orb,
// and out of slide 4 at the height it enters slide 1, so the swipe loops.
// Facts are from hotcoin.com/en_US/user/ic (referral page and its rules), checked 2 Oct 2026.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export const CAROUSEL_W = 4320, CAROUSEL_H = 1350;
const BLACK = '#050607', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F4F5F2', GREY = '#8E949B';
const SANS = '"Inter Tight", sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"IBM Plex Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['500 96px "Inter Tight"', '400 30px "Inter Tight"', 'italic 400 96px "Instrument Serif"', '500 24px "IBM Plex Mono"'].map((s) => document.fonts.load(s)))
      .then(() => continueRender(h));
  }, [h]);
};

// ---------- the path (pixel space: x right, y down, z toward the viewer) ----------
type V = [number, number, number];
const LOOP_Y = 1185;
const KNOT = {x: 560, y: 960, a: 360, z: 150};
const RING_Y = 880, RINGS = [1330, 1620, 1910];
const ORB = {x: 2700, y: 860, r: 175, coil: 245};
const DOTS = {x: 3930, y: 880, r: 150}; // slide 4's sphere, a nod to the logo's green dot
const buildPath = (): V[] => {
  const p: V[] = [];
  const bez = (a: V, b: V, c: V, d: V, n = 40) => {
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      p.push([0, 1, 2].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]) as V);
    }
  };
  p.push([-80, LOOP_Y, 0]);
  bez([-80, LOOP_Y, 0], [180, LOOP_Y, 0], [KNOT.x - 170, KNOT.y + 170, KNOT.z], [KNOT.x, KNOT.y, KNOT.z]);
  // infinity knot: the two passes through the centre sit at +z and -z, so it really crosses over itself
  for (let i = 1; i <= 260; i++) {
    const t = Math.PI / 2 - (i / 260) * 2 * Math.PI, s = Math.sin(t);
    p.push([KNOT.x + (KNOT.a * Math.cos(t)) / (1 + s * s), KNOT.y - (KNOT.a * s * Math.cos(t)) / (1 + s * s), KNOT.z * s]);
  }
  bez(p[p.length - 1], [KNOT.x + 170, KNOT.y - 170, KNOT.z], [1060, RING_Y, 40], [1180, RING_Y, 0]);
  p.push([RINGS[2] + 160, RING_Y, 0]);
  // a double coil around the orb: it starts and ends on the coil's underside, heading right, so the joins stay smooth
  const x0 = ORB.x - 260, x1 = ORB.x + 200, R = ORB.coil;
  const at = (f: number): V => {const th = Math.PI / 2 + f * 4 * Math.PI, z = -R * Math.sin(th - Math.PI / 2) * 1; return [x0 + (x1 - x0) * f - z * 0.55, ORB.y + R * Math.sin(th) * 0.92, R * Math.cos(th)];};
  const c0 = at(0);
  bez(p[p.length - 1], [2250, RING_Y, 0], [c0[0] - 160, c0[1], 0], c0);
  for (let i = 1; i <= 260; i++) p.push(at(i / 260));
  const c1 = at(1);
  bez(c1, [c1[0] + 200, c1[1], 0], [3150, LOOP_Y, 0], [3420, LOOP_Y, 0], 60);
  // slide 4: rise behind the brand sphere, then settle back to the loop height
  bez(p[p.length - 1], [3640, LOOP_Y, 0], [DOTS.x - 360, DOTS.y + 60, -260], [DOTS.x, DOTS.y - 20, -260], 60);
  bez(p[p.length - 1], [DOTS.x + 300, DOTS.y - 80, -260], [4150, LOOP_Y, 0], [4400, LOOP_Y, 0], 60);
  return p;
};

// Environment lighting is set during render (not in an effect) so the single still frame already has it.
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
  }, [gl, scene]);
  return null;
};

const Scene: React.FC = () => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(buildPath().map(([x, y, z]) => new THREE.Vector3(x, -y, z)), false, 'centripetal'), []);
  const tube = (r: number) => new THREE.TubeGeometry(curve, 3000, r, 24, false);
  const geo = useMemo(() => ({core: tube(10)}), [curve]);
  const darkGlass = {color: '#9AA3AB', metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6};
  return (
    <>
      <Env />
      <ambientLight intensity={0.15} />
      <directionalLight position={[1000, 600, 1200]} intensity={1.6} />
      {[KNOT.x, RINGS[1], ORB.x, 3800].map((x) => <pointLight key={x} position={[x, -760, 420]} color={LIME} intensity={4} distance={1400} decay={0.6} />)}
      {/* the line: a lit core plus two additive halos for the glow */}
      <mesh geometry={geo.core}><meshPhysicalMaterial color={LIME} emissive={GREEN} emissiveIntensity={0.9} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
      {/* slide 2: three dark glass rings the line threads through */}
      {RINGS.map((x) => (
        <mesh key={x} position={[x, -RING_Y, 0]} rotation={[0.22, 0.95, 0]}>
          <torusGeometry args={[132, 15, 48, 160]} />
          <meshPhysicalMaterial {...darkGlass} />
        </mesh>
      ))}
      {/* slide 4: a glossy brand-green sphere the line passes behind */}
      <mesh position={[DOTS.x, -DOTS.y, 0]}>
        <sphereGeometry args={[DOTS.r, 128, 128]} />
        <meshPhysicalMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.25} roughness={0.12} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={1.4} />
      </mesh>
      {/* slide 3: a smoked-glass orb with a lime core */}
      <mesh position={[ORB.x, -ORB.y, 0]}>
        <sphereGeometry args={[ORB.r, 96, 96]} />
        <meshPhysicalMaterial color="#1A2024" metalness={0.1} roughness={0.05} transparent opacity={0.32} clearcoat={1} envMapIntensity={2} depthWrite={false} />
      </mesh>
      <mesh position={[ORB.x, -ORB.y, 0]}>
        <sphereGeometry args={[72, 64, 64]} />
        <meshBasicMaterial color={LIME} />
      </mesh>
      <mesh position={[ORB.x, -ORB.y, 0]}>
        <sphereGeometry args={[120, 64, 64]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
};

// ---------- type ----------
const S = (i: number) => i * 1080;
const Label: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => (
  <>
    <div style={{position: 'absolute', left: S(i) + 80, top: 214, fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 1, color: LIME}}>{children}</div>
    <div style={{position: 'absolute', left: S(i) + 1080 - 80 - 120, top: 84, width: 120, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: GREY}}>
      <span style={{color: WHITE}}>0{i + 1}</span> / 04
    </div>
  </>
);
const Head: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => (
  <div style={{position: 'absolute', left: S(i) + 76, top: 262, fontFamily: SANS, fontWeight: 500, fontSize: 104, lineHeight: 1.0, letterSpacing: -4, color: WHITE}}>{children}</div>
);
const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.14em', letterSpacing: -1, color: LIME}}>{children}</span>
);
const Sub: React.FC<{i: number; top: number; children: React.ReactNode}> = ({i, top, children}) => (
  <div style={{position: 'absolute', left: S(i) + 80, top, fontFamily: SANS, fontSize: 34, lineHeight: 1.35, color: GREY, width: 860}}>{children}</div>
);
const Tag: React.FC<{x: number; y: number; n: string; t: string}> = ({x, y, n, t}) => (
  <div style={{position: 'absolute', left: x - 110, top: y, width: 220, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: GREY}}>
    <span style={{color: LIME}}>{n}</span> {t}
  </div>
);
const Logo: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <Img src={staticFile('brand/logo-v3.svg')} style={{position: 'absolute', left: x, top: y, width: w, height: (w * 28) / 139}} />
);

export const Carousel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: [
        `radial-gradient(ellipse 620px 420px at ${KNOT.x}px ${KNOT.y}px, rgba(126,194,90,0.13), transparent 70%)`,
        `radial-gradient(ellipse 760px 360px at ${RINGS[1]}px ${RING_Y}px, rgba(126,194,90,0.08), transparent 70%)`,
        `radial-gradient(ellipse 560px 520px at ${ORB.x}px ${ORB.y}px, rgba(126,194,90,0.16), transparent 70%)`,
      ].join(',')}} />
      <ThreeCanvas width={CAROUSEL_W} height={CAROUSEL_H} orthographic camera={{position: [0, 0, 1500], zoom: 1, near: 1, far: 4000}}
        gl={{antialias: true, preserveDrawingBuffer: true, alpha: true}}
        style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 0 10px rgba(184,242,106,0.55)) drop-shadow(0 0 34px rgba(184,242,106,0.35)) drop-shadow(0 0 90px rgba(126,194,90,0.3))'}}>
        <group position={[-CAROUSEL_W / 2, CAROUSEL_H / 2, 0]}><Scene /></group>
      </ThreeCanvas>

      {/* 01 */}
      <Logo x={80} y={80} w={190} />
      <Label i={0}>// referral program</Label>
      <Head i={0}>Invite friends.<br />Earn up to <Em>20%</Em></Head>
      <Sub i={0} top={500}>of their trading fees. No cap.</Sub>

      {/* 02 */}
      <Label i={1}>// how it works</Label>
      <Head i={1}>Share. They trade.<br /><Em>You earn.</Em></Head>
      <Sub i={1} top={500}>Rewards land the next day.</Sub>
      <Tag x={RINGS[0]} y={RING_Y + 175} n="01" t="share link" />
      <Tag x={RINGS[1]} y={RING_Y + 175} n="02" t="friend trades" />
      <Tag x={RINGS[2]} y={RING_Y + 175} n="03" t="you earn" />

      {/* 03 */}
      <Label i={2}>// for your friend</Label>
      <Head i={2}>They win <Em>too.</Em></Head>
      <Sub i={2} top={400}>Up to 16,360 USDT in bonuses to unlock.</Sub>
      <div style={{position: 'absolute', left: S(2) + 80, top: 1180, width: 920, fontFamily: MONO, fontSize: 22, color: GREY}}>
        sign up · verify · deposit · first futures trade
      </div>

      {/* 04 */}
      <Label i={3}>// start now</Label>
      <Head i={3}>No cap.<br /><Em>360 days</Em> per friend.</Head>
      <div style={{position: 'absolute', left: S(3) + 80, top: 540, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: BLACK, background: LIME, padding: '22px 40px', borderRadius: 60}}>Invite friends</div>
      <Logo x={S(3) + 80} y={80} w={190} />
      <div style={{position: 'absolute', left: S(3) + 80, top: 1270, width: 920, fontFamily: SANS, fontSize: 19, lineHeight: 1.4, color: GREY, opacity: 0.8}}>
        Based on friends' net trading fees. Direct invites only. Rules and rates may change. Trading involves risk.
      </div>
    </AbsoluteFill>
  );
};
