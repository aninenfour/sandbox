// Hotcoin Research: 3D sets, all built in three.js. Each set takes the local
// frame `f` and its own duration, and moves its own camera.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {random} from 'remotion';
import {C, Dot3D, ease, Halo, LightCone, lerp, mix3, Particles, range, textTexture, type DotProps, type V3, MONO, ZH} from './kit';

export const Cam: React.FC<{pos: V3; look: V3; fov?: number; roll?: number}> = ({pos, look, fov, roll = 0}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...look);
  const pc = camera as THREE.PerspectiveCamera;
  if (fov && pc.fov !== fov) {
    pc.fov = fov;
    pc.updateProjectionMatrix();
  }
  return null;
};

const EnvLight: React.FC<{intensity: number}> = ({intensity}) => {
  const {gl, scene} = useThree();
  const tex = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  }, [gl]);
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  return null;
};

const Env: React.FC<{fog?: [number, number]; bg?: string; env?: number}> = ({fog = [12, 60], bg = '#05080A', env = 0.12}) => (
  <>
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[C.fog, fog[0], fog[1]]} />
    <EnvLight intensity={env} />
  </>
);

const Std: React.FC<{color: string; rough?: number; metal?: number; emissive?: string; ei?: number}> = ({color, rough = 0.85, metal = 0, emissive, ei = 0}) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? '#000000'} emissiveIntensity={ei} />
);

// ============ NIGHT TRAIN, OUTSIDE ============
const CAR_L = 14;
const WIN_W = 1.15;
const PILLAR = 0.55;

const Carriage: React.FC<{x: number; dotWindow?: number; f: number; dot?: Partial<DotProps>}> = ({x, dotWindow, f, dot}) => {
  const n = Math.floor((CAR_L - 1.2) / (WIN_W + PILLAR));
  const start = -((n * (WIN_W + PILLAR) - PILLAR) / 2);
  const winX = (i: number) => start + i * (WIN_W + PILLAR) + WIN_W / 2;
  const body = '#0E1416';
  return (
    <group position={[x, 0, 0]}>
      {/* chassis + wheels */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[CAR_L, 0.5, 2.8]} />
        <Std color="#06090A" />
      </mesh>
      {[-5, -3.6, 3.6, 5].map((wx) => (
        <mesh key={wx} position={[wx, 0.55, 1.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 24]} />
          <Std color="#0B0F10" metal={0.6} rough={0.4} />
        </mesh>
      ))}
      {/* lower body */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[CAR_L, 1.4, 3]} />
        <Std color={body} rough={0.55} metal={0.3} />
      </mesh>
      {/* thin lime trim line */}
      <mesh position={[0, 2.5, 1.505]}>
        <boxGeometry args={[CAR_L, 0.035, 0.01]} />
        <meshBasicMaterial color={C.lime} />
      </mesh>
      {/* upper band + roof */}
      <mesh position={[0, 3.75, 0]}>
        <boxGeometry args={[CAR_L, 0.5, 3]} />
        <Std color={body} rough={0.55} metal={0.3} />
      </mesh>
      <mesh position={[0, 4.0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 1, 1]}>
        <cylinderGeometry args={[1.5, 1.5, CAR_L, 32, 1, false, 0, Math.PI]} />
        <Std color="#0A0F11" rough={0.5} metal={0.3} />
      </mesh>
      {/* back wall of the window band */}
      <mesh position={[0, 3.05, -1.45]}>
        <boxGeometry args={[CAR_L, 0.9, 0.1]} />
        <Std color={body} />
      </mesh>
      {/* warm-lime interior glow behind the windows */}
      <mesh position={[0, 3.05, -1.36]}>
        <planeGeometry args={[CAR_L - 0.4, 0.9]} />
        <meshBasicMaterial color="#6F8462" />
      </mesh>
      {/* pillars on the camera side */}
      {Array.from({length: n + 1}).map((_, i) => (
        <mesh key={i} position={[start + i * (WIN_W + PILLAR) - PILLAR / 2, 3.05, 1.45]}>
          <boxGeometry args={[PILLAR, 0.9, 0.1]} />
          <Std color={body} rough={0.55} metal={0.3} />
        </mesh>
      ))}
      <mesh position={[-CAR_L / 2 + 0.3, 3.05, 1.45]}>
        <boxGeometry args={[0.6, 0.9, 0.1]} />
        <Std color={body} />
      </mesh>
      <mesh position={[CAR_L / 2 - 0.3, 3.05, 1.45]}>
        <boxGeometry args={[0.6, 0.9, 0.1]} />
        <Std color={body} />
      </mesh>
      {/* seat backs as silhouettes */}
      {Array.from({length: n}).map((_, i) => (
        <mesh key={i} position={[winX(i) - 0.35, 2.85, -0.6]}>
          <boxGeometry args={[0.18, 0.75, 1.4]} />
          <Std color="#050707" />
        </mesh>
      ))}
      <pointLight position={[0, 3.1, 0.4]} color="#D8EFB8" intensity={18} distance={9} decay={2} />
      {/* window light spilling on the snow */}
      {Array.from({length: n}).map((_, i) => (
        <mesh key={i} position={[winX(i) + 0.4, 0.03, 3.4]} rotation={[-Math.PI / 2, 0, 0.12]}>
          <planeGeometry args={[WIN_W * 1.1, 3.2]} />
          <meshBasicMaterial color="#B9D49A" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {dotWindow !== undefined && <Dot3D frame={f} position={[winX(dotWindow), 3.02, 0.55]} r={0.3} glow={1.2} seed={3} {...dot} />}
    </group>
  );
};

const Trees: React.FC = () => {
  const trees = useMemo(
    () =>
      Array.from({length: 90}).map((_, i) => ({
        x: (random(`tx${i}`) - 0.5) * 260,
        z: -10 - random(`tz${i}`) * 40,
        h: 4 + random(`th${i}`) * 7,
      })),
    []
  );
  return (
    <>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, t.z]}>
          <coneGeometry args={[t.h * 0.28, t.h, 7]} />
          <Std color="#0A100F" />
        </mesh>
      ))}
    </>
  );
};

export const TrainExterior: React.FC<{f: number; dur: number; vertical?: boolean; dot?: Partial<DotProps>}> = ({f, dur, vertical, dot}) => {
  const trainX = -10 + f * 0.09;
  const k = ease(f / dur);
  const dotWorldX = trainX + 0 /* middle carriage */ + (-((7 * (WIN_W + PILLAR) - PILLAR) / 2) + 3 * (WIN_W + PILLAR) + WIN_W / 2);
  const camPos: V3 = vertical ? mix3([dotWorldX + 2, 2.6, 17], [dotWorldX + 0.4, 3.0, 6.5], k) : mix3([dotWorldX + 5, 2.4, 19], [dotWorldX + 0.6, 3.0, 7], k);
  const look: V3 = mix3([dotWorldX - 2, 2.4, 0], [dotWorldX, 3.0, 0.5], k);
  return (
    <>
      <Env fog={[14, 90]} env={0.25} />
      <Cam pos={camPos} look={look} fov={vertical ? 46 : 30} />
      <ambientLight intensity={0.12} color="#9fb3c4" />
      <hemisphereLight args={['#2a3a44', '#0a0c0c', 0.25]} />
      <directionalLight position={[-30, 30, 20]} intensity={0.9} color="#C4D4E4" />
      <directionalLight position={[10, 12, -30]} intensity={1.4} color="#9FB6C8" />
      {/* moon */}
      <group position={[camPos[0] - 26, vertical ? 26 : 13, -70]}>
        <mesh>
          <sphereGeometry args={[3.2, 32, 32]} />
          <meshBasicMaterial color="#E4EBE2" fog={false} />
        </mesh>
        <Halo size={30} opacity={0.22} color="#C9D7DA" />
      </group>
      {/* snow ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[600, 200]} />
        <Std color="#3A4648" rough={1} />
      </mesh>
      {/* rails + sleepers */}
      {[-0.75, 0.75].map((z) => (
        <mesh key={z} position={[0, 0.12, z]}>
          <boxGeometry args={[600, 0.08, 0.08]} />
          <Std color="#2A3133" metal={0.8} rough={0.35} />
        </mesh>
      ))}
      {Array.from({length: 160}).map((_, i) => (
        <mesh key={i} position={[-120 + i * 1.5, 0.05, 0]}>
          <boxGeometry args={[0.25, 0.08, 2.2]} />
          <Std color="#0C1011" />
        </mesh>
      ))}
      <Trees />
      <group position={[trainX, 0, 0]}>
        <Carriage x={-CAR_L - 0.8} f={f} />
        <Carriage x={0} f={f} dotWindow={3} dot={dot} />
        <Carriage x={CAR_L + 0.8} f={f} />
        {/* engine block with a headlamp */}
        <mesh position={[CAR_L * 1.5 + 4, 2.3, 0]}>
          <boxGeometry args={[5, 3.6, 3]} />
          <Std color="#0A0E10" rough={0.5} metal={0.4} />
        </mesh>
        <group position={[CAR_L * 1.5 + 6.6, 2.0, 0]}>
          <Halo size={6} opacity={0.5} color={C.moon} />
          <LightCone position={[5, 0, 0]} rotation={[0, 0, Math.PI / 2]} radius={2.5} height={10} opacity={0.05} />
        </group>
      </group>
      <Particles frame={f} count={1600} box={[60, 22, 30]} center={[camPos[0], 9, 2]} fall={0.05} drift={-0.03} size={0.09} opacity={0.7} seed="snow" />
    </>
  );
};

// ============ NIGHT TRAIN, INSIDE (the case desk) ============
export const TrainInterior: React.FC<{f: number; dur: number; vertical?: boolean; folder?: {no: string; title: string}; dot?: Partial<DotProps>; camFrom?: V3; camTo?: V3; lookAt?: V3}> = ({
  f,
  dur,
  vertical,
  folder = {no: '001', title: '泡沫档案'},
  dot,
  camFrom,
  camTo,
  lookAt,
}) => {
  const k = ease(f / dur);
  const folderTex = useMemo(
    () =>
      textTexture(
        900,
        620,
        '#C9C1A8',
        [
          {text: `档案 No.${folder.no}`, font: `700 54px ${MONO}`, color: '#1A1A16', x: 70, y: 150},
          {text: folder.title, font: `900 120px ${ZH}`, color: '#121210', x: 70, y: 330},
          {text: 'HOTCOIN RESEARCH', font: `500 34px ${MONO}`, color: '#3B3A33', x: 70, y: 540},
        ],
        (g) => {
          g.fillStyle = '#B7AE93';
          g.fillRect(0, 0, 900, 38);
          g.strokeStyle = '#7A1E1E00';
          g.fillStyle = 'rgba(0,0,0,0.06)';
          for (let i = 0; i < 400; i++) g.fillRect(Math.random() * 900, Math.random() * 620, 2, 2);
        }
      ),
    [folder.no, folder.title]
  );
  // passing lights outside
  const lights = useMemo(() => Array.from({length: 14}).map((_, i) => ({y: 0.6 + random(`ly${i}`) * 2.6, ph: random(`lp${i}`), z: -6 - random(`lz${i}`) * 10})), []);
  const from: V3 = camFrom ?? (vertical ? [0.15, 1.75, 3.2] : [-0.2, 1.65, 2.9]);
  const to: V3 = camTo ?? (vertical ? [0.35, 1.45, 1.6] : [0.1, 1.45, 1.45]);
  const cam = mix3(from, to, k);
  return (
    <>
      <Env fog={[4, 26]} bg="#040607" />
      <Cam pos={cam} look={lookAt ?? [0.25, 1.05, -1.3]} fov={vertical ? 52 : 34} />
      <ambientLight intensity={0.1} />
      <pointLight position={[-1.5, 2.6, 1.0]} intensity={2.5} distance={6} decay={2} color="#6E8796" />
      {/* moonlight through the blinds */}
      <spotLight position={[2.2, 3.8, -6]} angle={0.42} penumbra={0.35} intensity={140} distance={14} decay={2} color="#C7D6E0" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} target-position={[0.2, 0.8, -1.2]} />
      {/* floor, walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <Std color="#0E1112" rough={0.9} />
      </mesh>
      {/* back wall with a window opening x[-1.3,1.3] y[1.0,2.5] */}
      {[
        {p: [-3.65, 1.5, -2.2], s: [4.7, 3, 0.15]},
        {p: [3.65, 1.5, -2.2], s: [4.7, 3, 0.15]},
        {p: [0, 0.5, -2.2], s: [2.6, 1.0, 0.15]},
        {p: [0, 2.75, -2.2], s: [2.6, 0.5, 0.15]},
      ].map((w, i) => (
        <mesh key={i} position={w.p as V3} receiveShadow castShadow>
          <boxGeometry args={w.s as V3} />
          <Std color="#141A1B" rough={0.8} />
        </mesh>
      ))}
      {/* blinds */}
      {Array.from({length: 9}).map((_, i) => (
        <mesh key={i} position={[0, 1.08 + i * 0.165, -2.12]} rotation={[0.9, 0, 0]} castShadow>
          <boxGeometry args={[2.6, 0.07, 0.01]} />
          <Std color="#2B3233" rough={0.6} />
        </mesh>
      ))}
      {/* the world outside: lights streaking past */}
      {lights.map((l, i) => {
        const x = ((((l.ph - (f * 0.012 * (12 / -l.z))) % 1) + 1) % 1) * 30 - 15;
        return (
          <mesh key={i} position={[x, l.y, l.z]}>
            <boxGeometry args={[1.6, 0.03, 0.03]} />
            <meshBasicMaterial color={i % 4 === 0 ? C.lime : '#DCE6E2'} transparent opacity={0.8} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.6, -18]}>
        <planeGeometry args={[60, 20]} />
        <meshBasicMaterial color="#0B1418" />
      </mesh>
      {/* table */}
      <mesh position={[0.2, 0.8, -1.35]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.07, 1.25]} />
        <Std color="#1E1A16" rough={0.55} />
      </mesh>
      <mesh position={[0.2, 0.4, -1.35]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 12]} />
        <Std color="#0B0B0B" metal={0.6} rough={0.4} />
      </mesh>
      {/* folder */}
      <mesh position={[-0.15, 0.842, -1.2]} rotation={[-Math.PI / 2, 0, 0.18]} receiveShadow>
        <planeGeometry args={[0.9, 0.62]} />
        <meshStandardMaterial map={folderTex} roughness={0.9} />
      </mesh>
      <Dot3D frame={f} position={[0.62, 1.12, -1.42]} r={0.26} glow={1.1} seed={5} mood="focused" look={[-0.6, -0.5]} {...dot} />
      <Particles frame={f} count={260} box={[3, 2.4, 2]} center={[0.2, 1.4, -1.0]} fall={0.0015} drift={0.002} size={0.012} opacity={0.5} seed="dust" />
    </>
  );
};

// ============ TULIP vs HOUSE on a balance ============
const Tulip: React.FC<{glow: number}> = ({glow}) => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.025, 0.03, 0.9, 10]} />
      <Std color="#2F5A26" />
    </mesh>
    <mesh position={[0.1, 0.3, 0]} rotation={[0, 0, -0.5]} scale={[0.08, 0.32, 0.03]}>
      <sphereGeometry args={[1, 16, 12]} />
      <Std color="#2F5A26" />
    </mesh>
    {Array.from({length: 6}).map((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      const inner = i % 2;
      return (
        <mesh key={i} position={[Math.cos(a) * 0.07, 1.0, Math.sin(a) * 0.07]} rotation={[Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]} scale={[0.11 - inner * 0.01, 0.2, 0.06]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#EEE8DA" emissive={C.lime} emissiveIntensity={0.18 * glow} roughness={0.5} />
        </mesh>
      );
    })}
  </group>
);

const House: React.FC = () => (
  <group>
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[0.7, 0.64, 0.55]} />
      <Std color="#1A1F21" rough={0.7} />
    </mesh>
    <mesh position={[0, 0.84, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.8, 1]}>
      <coneGeometry args={[0.56, 0.5, 4]} />
      <Std color="#101415" rough={0.7} />
    </mesh>
    {[-0.17, 0.17].map((x) => (
      <mesh key={x} position={[x, 0.4, 0.28]}>
        <planeGeometry args={[0.14, 0.16]} />
        <meshBasicMaterial color="#D8E8C0" />
      </mesh>
    ))}
    <mesh position={[0, 0.14, 0.28]}>
      <planeGeometry args={[0.13, 0.26]} />
      <meshBasicMaterial color="#0A0C0C" />
    </mesh>
  </group>
);

export const ScaleScene: React.FC<{f: number; dur: number; vertical?: boolean}> = ({f, dur, vertical}) => {
  // the beam swings and settles level: the bulb weighs as much as the house
  const swing = Math.exp(-f / 28) * Math.cos(f / 7) * 0.32;
  const k = ease(f / dur);
  const cam = vertical ? mix3([1.4, 1.9, 8.2], [0.5, 1.8, 6.4], k) : mix3([2.6, 1.7, 7.4], [1.0, 1.6, 5.8], k);
  const armL = 1.5;
  const pan = (side: -1 | 1): V3 => [side * armL * Math.cos(swing), 2.6 - side * armL * Math.sin(swing) - 0.9, 0];
  return (
    <>
      <Env fog={[6, 24]} bg="#030505" />
      <Cam pos={cam} look={[0, 1.55, 0]} fov={vertical ? 50 : 34} />
      <ambientLight intensity={0.05} />
      <spotLight position={[0, 9, 1]} angle={0.42} penumbra={0.5} intensity={220} distance={20} decay={2} color="#E7EEE6" castShadow target-position={[0, 0, 0]} />
      <LightCone position={[0, 5.2, 0.4]} radius={3.0} height={7.6} opacity={0.045} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <Std color="#0D1011" rough={0.35} metal={0.2} />
      </mesh>
      {/* post */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 2.6, 16]} />
        <Std color="#8C8A7E" metal={0.9} rough={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
        <Std color="#5E5C53" metal={0.9} rough={0.35} />
      </mesh>
      {/* beam */}
      <mesh position={[0, 2.6, 0]} rotation={[0, 0, -swing]} castShadow>
        <boxGeometry args={[armL * 2 + 0.1, 0.06, 0.06]} />
        <Std color="#A9A493" metal={0.9} rough={0.3} />
      </mesh>
      {([-1, 1] as const).map((s) => {
        const p = pan(s);
        return (
          <group key={s} position={p}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.9, 6]} />
              <Std color="#A9A493" metal={0.9} />
            </mesh>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.42, 0.05, 32]} />
              <Std color="#A9A493" metal={0.9} rough={0.3} />
            </mesh>
            <group position={[0, 0.03, 0]}>{s === -1 ? <Tulip glow={1} /> : <House />}</group>
          </group>
        );
      })}
      <Dot3D frame={f} position={[0, 2.86, 0.06]} r={0.2} mood="curious" mood2="surprised" mix={range(f, dur * 0.45, dur * 0.65)} look={[-0.5 + range(f, dur * 0.35, dur * 0.55), -0.1]} seed={7} />
      <Particles frame={f} count={300} box={[6, 6, 4]} center={[0, 3, 0]} fall={0.002} drift={0.001} size={0.02} opacity={0.6} seed="motes" />
    </>
  );
};

// ============ VAULT ============
const vaultWallGeo = (() => {
  let g: THREE.ExtrudeGeometry | null = null;
  return () => {
    if (g) return g;
    const s = new THREE.Shape();
    s.moveTo(-12, -1);
    s.lineTo(12, -1);
    s.lineTo(12, 9);
    s.lineTo(-12, 9);
    s.lineTo(-12, -1);
    const hole = new THREE.Path();
    hole.absarc(0, 2.2, 2.0, 0, Math.PI * 2, true);
    s.holes.push(hole);
    g = new THREE.ExtrudeGeometry(s, {depth: 0.8, bevelEnabled: false, curveSegments: 64});
    return g;
  };
})();

export type VaultProps = {
  f: number;
  dur: number;
  vertical?: boolean;
  open: number; // 0 closed .. 1 wide open
  cam: {from: V3; to: V3; look: V3; lookTo?: V3};
  dot?: Partial<DotProps> & {show?: boolean};
  chest?: number; // 0..1 the old wallet box opening (inside the vault)
  sign?: string;
};

export const VaultSet: React.FC<VaultProps> = ({f, dur, vertical, open, cam, dot, chest = -1, sign}) => {
  const k = ease(f / dur);
  const pos = mix3(cam.from, cam.to, k);
  const look = cam.lookTo ? mix3(cam.look, cam.lookTo, k) : cam.look;
  const signTex = useMemo(() => (sign ? textTexture(1024, 160, '#0D1113', [{text: sign, font: `700 96px ${MONO}`, color: '#C9D2CE', x: 512, y: 115, align: 'center'}]) : null), [sign]);
  const doorAngle = -open * 1.45;
  return (
    <>
      <Env fog={[6, 30]} bg="#030505" />
      <Cam pos={pos} look={look} fov={vertical ? 52 : 34} />
      <ambientLight intensity={0.05} />
      <spotLight position={[2.5, 7, 6]} angle={0.5} penumbra={0.6} intensity={160} distance={22} decay={2} color="#C9D6DE" castShadow target-position={[0, 2, 0]} />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <Std color="#101415" rough={0.55} metal={0.2} />
      </mesh>
      {/* wall with the round opening */}
      <mesh geometry={vaultWallGeo()} position={[0, 0, -0.8]} receiveShadow>
        <Std color="#161B1C" rough={0.85} />
      </mesh>
      {/* frame ring */}
      <mesh position={[0, 2.2, 0.02]}>
        <torusGeometry args={[2.0, 0.12, 16, 96]} />
        <Std color="#7F8582" metal={0.95} rough={0.25} />
      </mesh>
      {signTex && (
        <mesh position={[0, 5.0, 0.01]}>
          <planeGeometry args={[3.6, 0.56]} />
          <meshStandardMaterial map={signTex} roughness={0.6} />
        </mesh>
      )}
      {/* door hinged at the left edge */}
      <group position={[-2.0, 2.2, 0.25]} rotation={[0, doorAngle, 0]}>
        <group position={[2.0, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[1.95, 1.95, 0.5, 96]} />
            <Std color="#8A908C" metal={0.95} rough={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.26]}>
            <ringGeometry args={[1.45, 1.6, 96]} />
            <Std color="#6D7370" metal={0.95} rough={0.3} />
          </mesh>
          {Array.from({length: 16}).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 1.75, Math.sin(a) * 1.75, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
                <Std color="#B6BCB8" metal={1} rough={0.2} />
              </mesh>
            );
          })}
          {/* wheel */}
          <group position={[0, 0, 0.42]} rotation={[0, 0, open * 3 + f * 0.0]}>
            <mesh>
              <torusGeometry args={[0.55, 0.05, 12, 48]} />
              <Std color="#C9CEC9" metal={1} rough={0.2} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
                <boxGeometry args={[1.1, 0.05, 0.05]} />
                <Std color="#C9CEC9" metal={1} rough={0.2} />
              </mesh>
            ))}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.2, 24]} />
              <Std color="#C9CEC9" metal={1} rough={0.2} />
            </mesh>
          </group>
        </group>
      </group>
      {/* inside: a corridor with empty shelves */}
      <group position={[0, 0, -0.8]}>
        <mesh position={[0, 2.2, -6]}>
          <boxGeometry args={[6, 6, 0.2]} />
          <Std color="#0E1213" />
        </mesh>
        {[-1, 1].map((s) =>
          [0, 1, 2, 3].map((r) => (
            <mesh key={`${s}${r}`} position={[s * 1.55, 0.7 + r * 0.8, -3.5]}>
              <boxGeometry args={[0.6, 0.05, 5]} />
              <Std color="#30383A" metal={0.6} rough={0.4} />
            </mesh>
          ))
        )}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.85, 2.0, -3.5]}>
            <boxGeometry args={[0.05, 4, 5]} />
            <Std color="#1A2021" />
          </mesh>
        ))}
        {chest >= 0 && (
          <group position={[0.9, 0.0, -4.6]} rotation={[0, -0.5, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.8, 0.5, 0.5]} />
              <Std color="#2B2620" rough={0.8} />
            </mesh>
            <group position={[0, 0.5, -0.25]} rotation={[-chest * 1.6, 0, 0]}>
              <mesh position={[0, 0.03, 0.25]}>
                <boxGeometry args={[0.82, 0.06, 0.52]} />
                <Std color="#2B2620" rough={0.8} />
              </mesh>
            </group>
            {chest > 0.05 && (
              <>
                <pointLight position={[0, 0.7, 0]} color={C.lime} intensity={12 * chest} distance={5} decay={2} />
                <group position={[0, 0.55, 0]}>
                  <Halo size={2.2 * chest} opacity={0.6 * chest} />
                </group>
              </>
            )}
          </group>
        )}
      </group>
      {dot?.show !== false && dot && <Dot3D frame={f} position={[0, 1.2, 1.6]} r={0.32} seed={9} {...dot} />}
      <Particles frame={f} count={400} box={[8, 6, 8]} center={[0, 3, -1]} fall={0.002} drift={0.001} size={0.02} opacity={0.55} seed="vdust" />
    </>
  );
};

// ============ THE LETTER (Satoshi) ============
export const LetterScene: React.FC<{f: number; dur: number; vertical?: boolean}> = ({f, dur, vertical}) => {
  const k = ease(f / dur);
  const paper = useMemo(
    () =>
      textTexture(800, 1040, '#ECE8DC', [
        {text: 'Bitcoin: A Peer-to-Peer', font: `700 46px Georgia, serif`, color: '#151512', x: 400, y: 150, align: 'center'},
        {text: 'Electronic Cash System', font: `700 46px Georgia, serif`, color: '#151512', x: 400, y: 210, align: 'center'},
        ...Array.from({length: 15}).map((_, i) => ({text: '', font: '20px serif', color: '#000', x: 0, y: 0})),
      ], (g) => {
        g.fillStyle = 'rgba(20,20,18,0.28)';
        for (let i = 0; i < 22; i++) {
          const w = 520 - (i % 5 === 4 ? 220 : random(`ln${i}`) * 60);
          g.fillRect(140, 400 + i * 26, w, 9);
        }
        g.fillRect(140, 340, 520, 2);
      }),
    []
  );
  const nameTex = useMemo(() => textTexture(800, 90, null, [{text: 'Satoshi Nakamoto', font: `400 40px Georgia, serif`, color: '#151512', x: 400, y: 58, align: 'center'}]), []);
  const vanish = range(f, dur * 0.5, dur * 0.85);
  const cam = vertical ? mix3([0, 1.6, 4.6], [0, 1.65, 3.4], k) : mix3([-0.6, 1.7, 3.6], [-0.1, 1.68, 2.7], k);
  return (
    <>
      <Env fog={[3, 16]} bg="#030505" />
      <Cam pos={cam} look={[0, 1.6, 0]} fov={vertical ? 50 : 34} />
      <ambientLight intensity={0.04} />
      <spotLight position={[0.5, 5, 2]} angle={0.35} penumbra={0.6} intensity={110} distance={12} decay={2} color="#E9EEE6" target-position={[0, 1.6, 0]} castShadow />
      <LightCone position={[0.3, 3.4, 1.2]} rotation={[-0.35, 0, -0.08]} radius={1.2} height={3.6} opacity={0.05} />
      <group position={[0, 1.6 + Math.sin(f / 30) * 0.03, 0]} rotation={[0.05, Math.sin(f / 45) * 0.12 - 0.1, 0.03]}>
        <mesh castShadow>
          <planeGeometry args={[1.2, 1.56]} />
          <meshStandardMaterial map={paper} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.33, 0.003]}>
          <planeGeometry args={[1.2, 0.135]} />
          <meshBasicMaterial map={nameTex} transparent opacity={1 - vanish} toneMapped={false} />
        </mesh>
      </group>
      {/* the name breaking into dust */}
      {vanish > 0 && (
        <Particles frame={f - Math.floor(dur * 0.5)} count={180} box={[0.9, 1.6, 0.3]} center={[0, 2.6, 0.05]} fall={-0.006} drift={0.003} size={0.012} color="#1D1D19" opacity={0.7 * (1 - vanish * 0.6)} seed="name" />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <Std color="#0B0E0F" rough={0.9} />
      </mesh>
      <Dot3D frame={f} position={vertical ? [0.45, 0.62, 0.9] : [0.95, 1.3, 0.3]} r={0.22} mood="curious" mood2="worried" mix={vanish} look={[-0.8, 0.6]} seed={11} />
    </>
  );
};

// ============ EVIDENCE BOARD ============
export const BoardScene: React.FC<{f: number; dur: number; vertical?: boolean; cards: {text: string; sub?: string; x: number; y: number; at: number; hot?: boolean}[]}> = ({f, dur, vertical, cards}) => {
  const k = ease(f / dur);
  const texes = useMemo(
    () =>
      cards.map((c) =>
        textTexture(600, 400, c.hot ? '#B8F26A' : '#E6E2D6', [
          {text: c.text, font: `900 ${c.text.length > 4 ? 96 : 130}px ${ZH}`, color: '#0B0E11', x: 300, y: c.sub ? 220 : 250, align: 'center'},
          ...(c.sub ? [{text: c.sub, font: `500 44px ${MONO}`, color: '#0B0E11', x: 300, y: 320, align: 'center' as CanvasTextAlign}] : []),
        ])
      ),
    [cards]
  );
  const cam = vertical ? mix3([0, 2.3, 7.6], [0, 2.3, 6.4], k) : mix3([-0.4, 2.1, 5.6], [0.2, 2.0, 4.6], k);
  const shown = cards.map((c) => ease((f - c.at) / 8));
  return (
    <>
      <Env fog={[4, 20]} bg="#030505" />
      <Cam pos={cam} look={vertical ? [0, 2.45, 0] : [0, 2.0, 0]} fov={vertical ? 54 : 36} />
      <ambientLight intensity={0.05} />
      <spotLight position={[0, 6, 4]} angle={0.55} penumbra={0.7} intensity={150} distance={16} decay={2} color="#E3EAE3" target-position={[0, 2, 0]} castShadow />
      <mesh position={[0, 2, -0.05]} receiveShadow>
        <planeGeometry args={[9, 5.5]} />
        <Std color="#15191A" rough={0.95} />
      </mesh>
      {cards.map((c, i) => (
        <group key={i} position={[c.x, c.y + (1 - shown[i]) * 0.25, 0.02]} rotation={[0, 0, (random(`cr${i}`) - 0.5) * 0.12]} visible={shown[i] > 0.01}>
          <mesh castShadow>
            <planeGeometry args={vertical ? [1.3, 0.87] : [1.5, 1.0]} />
            <meshStandardMaterial map={texes[i]} roughness={0.9} transparent opacity={shown[i]} />
          </mesh>
          <mesh position={[0, 0.42, 0.03]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <Std color={C.lime} emissive={C.lime} ei={0.6} />
          </mesh>
        </group>
      ))}
      {/* strings between consecutive cards once both are up */}
      {cards.slice(1).map((c, i) => {
        const a = cards[i];
        const t = Math.min(shown[i], ease((f - c.at - 6) / 10));
        if (t <= 0) return null;
        const ax = a.x, ay = a.y + 0.42, bx = lerp(ax, c.x, t), by = lerp(ay, c.y + 0.42, t);
        const len = Math.hypot(bx - ax, by - ay);
        return (
          <mesh key={i} position={[(ax + bx) / 2, (ay + by) / 2, 0.06]} rotation={[0, 0, Math.atan2(by - ay, bx - ax)]}>
            <boxGeometry args={[len, 0.012, 0.012]} />
            <meshBasicMaterial color={C.lime} />
          </mesh>
        );
      })}
      <Dot3D frame={f} position={vertical ? [-0.95, 3.75, 0.7] : [2.6, 0.9, 1.4]} r={0.28} mood="skeptical" look={vertical ? [0.6, -0.3] : [-0.6, 0.6]} seed={13} />
    </>
  );
};
