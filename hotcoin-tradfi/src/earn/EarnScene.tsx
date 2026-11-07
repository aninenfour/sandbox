// Low-poly, PS2-era 3D scene for the Hotcoin Earn Rewards Boost promo (three.js via @remotion/three).
// A coin character (no third-party logos) in a dark void with translucent floating towers, drifting particles,
// a 20 USDT voucher "item get", growing coin stacks and a coin rain. Driven purely by the Remotion frame.
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const LIME = '#B8F26A', GREEN = '#7EC25A', GOLD = '#F2C94C';
export const ET = {menu: 96, click: 150, item: 176, land: 220, grow: 300, rain: 420, end: 540};
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const out = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const r = (i: number, k: number) => { const x = Math.sin(i * 91.7 + k * 47.3) * 43758.5453; return x - Math.floor(x); };

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as {environmentIntensity: number}).environmentIntensity = 0.55;
    scene.background = new THREE.Color('#030605');
    scene.fog = new THREE.Fog('#030605', 10, 30);
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15;
  }, [gl, scene]);
  return null;
};

const Cam: React.FC<{f: number}> = ({f}) => {
  const {camera, size} = useThree();
  const tall = size.height / size.width > 1.1;
  const keys: [number, number[], number[]][] = [
    [0, [0.9, 1.5, 7.2], [0.2, 1.15, 0]], [ET.menu, [0.4, 1.5, 7.0], [1.9, 1.0, 0]], [ET.item, [0, 1.7, 6.8], [0, 1.75, 0]],
    [ET.grow, [2.5, 3.6, 10.5], [0, 1.4, 0]], [ET.rain, [0, 4.2, 12.5], [0, 1.8, 0]], [ET.end, [0, 4.6, 13.5], [0, 2, 0]],
  ];
  let i = 0; while (i < keys.length - 2 && f >= keys[i + 1][0]) i++;
  const [a, pa, la] = keys[i], [b, pb, lb] = keys[i + 1];
  const t = ease((f - a) / (b - a));
  const L = (u: number[], v: number[], k: number) => u[k] + (v[k] - u[k]) * t;
  const back = tall ? 1.18 : 1;
  camera.position.set(L(pa, pb, 0), L(pa, pb, 1), L(pa, pb, 2) * back);
  camera.lookAt(L(la, lb, 0), L(la, lb, 1), L(la, lb, 2));
  (camera as THREE.PerspectiveCamera).fov = 40; camera.updateProjectionMatrix();
  return null;
};

const Towers: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 16}, (_, i) => {
      const ang = r(i, 1) * Math.PI * 2, rad = 6 + r(i, 2) * 8, h = 2 + r(i, 3) * 7;
      return (
        <mesh key={i} position={[Math.cos(ang) * rad, h / 2 - 0.5 + Math.sin(f / 60 + i) * 0.3, Math.sin(ang) * rad - 4]}>
          <boxGeometry args={[0.5, h, 0.5]} />
          <meshStandardMaterial color={LIME} emissive={GREEN} emissiveIntensity={0.25} transparent opacity={0.12} flatShading />
        </mesh>
      );
    })}
  </>
);

const Particles: React.FC<{f: number}> = ({f}) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const n = 380;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (r(i, 4) - 0.5) * 26;
    pos[i * 3 + 1] = ((r(i, 5) * 12 + f * (0.01 + r(i, 6) * 0.02)) % 12) - 1;
    pos[i * 3 + 2] = (r(i, 7) - 0.5) * 20 - 3;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return (
    <points geometry={geo}>
      <pointsMaterial color={LIME} size={0.06} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
};

// coin character: upright low-poly coin with a simple face; mood 0 bored, 1 awake, 2 happy
const CoinGuy: React.FC<{f: number}> = ({f}) => {
  const mood = f < ET.menu ? 0 : f < ET.land ? 1 : 2;
  const hop = f >= ET.click - 10 && f < ET.click + 10 ? Math.sin(((f - ET.click + 10) / 20) * Math.PI) * 0.6 : 0;
  const joy = mood === 2 ? Math.abs(Math.sin(f / 7)) * 0.25 : 0;
  const slump = mood === 0 ? 0.28 + Math.sin(f / 22) * 0.04 : 0;
  const x = f < ET.grow ? 0 : -0.2;
  const y = 1.05 + hop + joy;
  const spin = mood === 2 && f > ET.land && f < ET.land + 24 ? ((f - ET.land) / 24) * Math.PI * 2 : 0;
  const ink = <meshStandardMaterial color="#0B0E11" roughness={0.6} />;
  return (
    <group position={[x, y, 0]} rotation={[slump, spin + Math.sin(f / 40) * 0.12, mood === 0 ? 0.12 : 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[1, 1, 0.26, 18]} /><meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.32} flatShading /></mesh>
      <mesh><torusGeometry args={[0.92, 0.07, 6, 18]} /><meshStandardMaterial color="#F0D78A" metalness={0.8} roughness={0.3} flatShading /></mesh>
      {mood === 0 && (<>
        <mesh position={[-0.33, 0.15, 0.14]}><boxGeometry args={[0.26, 0.05, 0.03]} />{ink}</mesh>
        <mesh position={[0.33, 0.15, 0.14]}><boxGeometry args={[0.26, 0.05, 0.03]} />{ink}</mesh>
        <mesh position={[0, -0.32, 0.14]}><boxGeometry args={[0.34, 0.05, 0.03]} />{ink}</mesh>
      </>)}
      {mood === 1 && (<>
        <mesh position={[-0.32, 0.17, 0.14]}><boxGeometry args={[0.13, 0.24, 0.03]} />{ink}</mesh>
        <mesh position={[0.32, 0.17, 0.14]}><boxGeometry args={[0.13, 0.24, 0.03]} />{ink}</mesh>
        <mesh position={[0, -0.3, 0.14]}><boxGeometry args={[0.2, 0.07, 0.03]} />{ink}</mesh>
      </>)}
      {mood === 2 && (<>
        {[-0.32, 0.32].map((ex) => (
          <group key={ex} position={[ex, 0.16, 0.14]}>
            <mesh position={[-0.06, 0, 0]} rotation={[0, 0, 0.7]}><boxGeometry args={[0.17, 0.05, 0.03]} />{ink}</mesh>
            <mesh position={[0.06, 0, 0]} rotation={[0, 0, -0.7]}><boxGeometry args={[0.17, 0.05, 0.03]} />{ink}</mesh>
          </group>
        ))}
        <mesh position={[0, -0.22, 0.14]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.2, 0.035, 4, 10, Math.PI]} />{ink}</mesh>
      </>)}
    </group>
  );
};

const useVoucherTex = () => useMemo(() => {
  const c = document.createElement('canvas'); c.width = 640; c.height = 360;
  const g = c.getContext('2d')!;
  g.fillStyle = LIME; g.fillRect(0, 0, 640, 360);
  g.fillStyle = '#0B0E11';
  g.font = '800 150px "Inter Tight", sans-serif'; g.textAlign = 'center'; g.fillText('20', 250, 210);
  g.font = '800 60px "Inter Tight", sans-serif'; g.fillText('USDT', 250, 280);
  g.font = '700 26px "JetBrains Mono", monospace'; g.fillText('FUTURES TRIAL FUNDS', 250, 330);
  g.setLineDash([12, 10]); g.lineWidth = 5; g.beginPath(); g.moveTo(500, 20); g.lineTo(500, 340); g.stroke();
  g.font = '800 54px "Inter Tight", sans-serif'; g.save(); g.translate(572, 180); g.rotate(-Math.PI / 2); g.fillText('HOTCOIN', 0, 18); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

const Voucher: React.FC<{f: number}> = ({f}) => {
  const tex = useVoucherTex();
  if (f < ET.item - 2 || f > ET.grow + 30) return null;
  const drop = out((f - ET.item) / (ET.land - ET.item));
  const leave = cl((f - ET.grow) / 30);
  const y = 6 - drop * 4.0 + leave * 0.4, s = 0.85 - leave * 0.5;
  const rot = (1 - drop) * Math.PI * 4 + Math.sin(f / 14) * 0.35;
  const side = new THREE.MeshStandardMaterial({color: GREEN, flatShading: true});
  const face = new THREE.MeshStandardMaterial({map: tex, emissive: new THREE.Color(LIME), emissiveIntensity: 0.25, emissiveMap: tex, roughness: 0.5});
  return (
    <group position={[0.15 + leave * 2.6, y, 1.6 - leave * 1.5]} scale={s}>
      <mesh rotation={[0, rot, 0]} material={[side, side, side, side, face, face]}><boxGeometry args={[2.4, 1.35, 0.08]} /></mesh>
      {f > ET.land - 8 && f < ET.grow && Array.from({length: 10}, (_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 10) * Math.PI * 2 + f / 30]} position={[0, 0, -0.3]}>
          <planeGeometry args={[0.14, 7]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.16 * cl((f - ET.land + 8) / 10)} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const Stacks: React.FC<{f: number}> = ({f}) => {
  if (f < ET.grow - 4) return null;
  const xs = [-3.2, -1.9, 1.9, 3.2, 4.5];
  return (
    <>
      {xs.map((x, s) => {
        const n = Math.floor(cl((f - ET.grow - s * 6) / 100) * (6 + s * 3)) + (f > ET.rain ? Math.floor(cl((f - ET.rain) / 80) * 4) : 0);
        return Array.from({length: n}, (_, k) => (
          <mesh key={`${s}-${k}`} position={[x, 0.07 + k * 0.15, -0.6 - s * 0.25]} rotation={[0, k * 0.4, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.13, 14]} />
            <meshStandardMaterial color={k % 3 === 0 ? LIME : GOLD} metalness={k % 3 === 0 ? 0.2 : 0.75} roughness={0.35} emissive={k % 3 === 0 ? GREEN : '#000'} emissiveIntensity={0.25} flatShading />
          </mesh>
        ));
      })}
    </>
  );
};

const Rain: React.FC<{f: number}> = ({f}) => {
  if (f < ET.rain) return null;
  return (
    <>
      {Array.from({length: 46}, (_, i) => {
        const t0 = ET.rain + r(i, 8) * 70, tt = (f - t0) / 30;
        if (tt < 0) return null;
        const y = Math.max(0.1, 9 - tt * tt * 4.9 * 0.9);
        return (
          <mesh key={i} position={[(r(i, 9) - 0.5) * 11, y, (r(i, 10) - 0.5) * 5 - 1]} rotation={[tt * 4 + i, tt * 3, i]}>
            <cylinderGeometry args={[0.32, 0.32, 0.09, 12]} />
            <meshStandardMaterial color={i % 4 === 0 ? LIME : GOLD} metalness={0.7} roughness={0.35} flatShading />
          </mesh>
        );
      })}
    </>
  );
};

export const EarnScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = f >= ET.land - 4 ? 1 : f >= ET.menu ? 0.6 : 0.3;
  return (
    <>
      <Env />
      <Cam f={f} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 6]} intensity={2.2} />
      <directionalLight position={[-5, 3, 4]} intensity={0.8} color="#E8FFD0" />
      <pointLight position={[0, 2.5, 3]} intensity={6 * glow} color={LIME} distance={12} />
      <pointLight position={[-5, 4, -3]} intensity={3} color={GREEN} distance={16} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#040706" metalness={0.2} roughness={0.75} envMapIntensity={0.05} /></mesh>
      <gridHelper args={[60, 60, '#3E6B1A', '#13200F']} position={[0, 0.005, 0]} />
      <Towers f={f} />
      <Particles f={f} />
      <CoinGuy f={f} />
      <Voucher f={f} />
      <Stacks f={f} />
      <Rain f={f} />
    </>
  );
};
