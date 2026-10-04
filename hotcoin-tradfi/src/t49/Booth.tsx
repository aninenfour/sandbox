// A 3D Hotcoin booth for the TOKEN2049 promo (three.js via @remotion/three).
// Units are metres: a 6 x 4 m island stand with a back wall, header ring, lightbox tower, counter and two screens.
import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const LIME = '#B8F26A', GREEN = '#7EC25A';

const useTextures = (files: string[]) => {
  const [h] = useState(() => delayRender('booth textures'));
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  const {advance, invalidate} = useThree();
  useEffect(() => {
    const L = new THREE.TextureLoader();
    Promise.all(files.map((f) => L.loadAsync(staticFile(f)))).then((t) => {
      t.forEach((x) => {x.colorSpace = THREE.SRGBColorSpace; x.anisotropy = 8;});
      setTex(t);
    });
  }, [h]);
  // release the frame only after the textured scene has actually been drawn
  useEffect(() => {
    if (!tex) return;
    requestAnimationFrame(() => {
      invalidate(); advance(performance.now());
      requestAnimationFrame(() => continueRender(h));
    });
  }, [tex, h, advance, invalidate]);
  return tex;
};

const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as {environmentIntensity: number}).environmentIntensity = 0.28;
    scene.background = new THREE.Color('#040605');
    scene.fog = new THREE.Fog('#040605', 12, 34);
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1;
  }, [gl, scene]);
  return null;
};

// Camera keyframes (frame offsets from the booth's first frame): high and wide, then a push in to the counter.
const CamRig: React.FC<{t: number}> = ({t}) => {
  const {camera, size} = useThree();
  const p = 1 - Math.pow(1 - Math.min(1, t), 3);
  const aspect = size.width / size.height;
  const back = aspect < 0.7 ? 1.75 : 1.3; // vertical frames sit further back to fit the stand's width
  const pos = new THREE.Vector3(
    THREE.MathUtils.lerp(-7.5, 0.5, p),
    THREE.MathUtils.lerp(5.5, 2.1, p),
    THREE.MathUtils.lerp(9, 7.2, p) * back,
  );
  camera.position.copy(pos);
  camera.lookAt(THREE.MathUtils.lerp(0, 0.35, p), THREE.MathUtils.lerp(0.4, 1.0, p) - (aspect < 0.7 ? 0.9 : 0.5), 0);
  (camera as THREE.PerspectiveCamera).fov = 42; camera.updateProjectionMatrix();
  return null;
};

const Glow: React.FC<{args: [number, number, number]; position: [number, number, number]; color?: string; intensity?: number}> = ({args, position, color = LIME, intensity = 3}) => (
  <mesh position={position}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
  </mesh>
);

export const Booth: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tex = useTextures(['brand/logo-official-white.png', 'brand/symbol-official-white.png', 'guess/wallet.jpg']);
  const t = (f - start) / dur;
  const flick = 0.85 + 0.15 * Math.sin(f / fps * 7);
  const lights = useMemo(() => Array.from({length: 46}, (_, i) => {
    const r = (k: number) => {const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x);};
    return [(r(1) - 0.5) * 30, 5.5 + r(2) * 2.5, -4 - r(3) * 18] as [number, number, number];
  }), []);
  if (!tex) return null;
  const [logo, sym, wallet] = tex;
  const wall = {color: '#070A09', roughness: 0.5, metalness: 0.1};
  return (
    <>
      <Env />
      <CamRig t={t} />
      <ambientLight intensity={0.08} />
      <spotLight position={[0, 7, 6]} angle={0.5} penumbra={0.9} intensity={35} color="#ffffff" />
      <pointLight position={[0, 2, 2]} intensity={8} distance={8} color={LIME} />
      {/* hall: glossy floor, ceiling lights in the haze */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshPhysicalMaterial color="#030404" roughness={0.45} metalness={0.5} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      {lights.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.07, 8, 8]} /><meshBasicMaterial color={i % 5 ? '#FFE9C2' : LIME} toneMapped={false} /></mesh>
      ))}
      {/* platform with a lime edge */}
      <mesh position={[0, 0.06, 0]}><boxGeometry args={[6.4, 0.12, 4.4]} /><meshStandardMaterial color="#0E1311" roughness={0.4} /></mesh>
      <Glow args={[6.42, 0.03, 0.03]} position={[0, 0.12, 2.2]} intensity={4 * flick} />
      {/* back wall with the logo lit from within */}
      <mesh position={[0, 1.75, -2]}><boxGeometry args={[6, 3.5, 0.2]} /><meshStandardMaterial {...wall} /></mesh>
      <mesh position={[0, 2.25, -1.89]}>
        <planeGeometry args={[3.0, 3.0 * 328 / 2005]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <Glow args={[6.04, 0.04, 0.04]} position={[0, 3.52, -1.88]} />
      <Glow args={[0.04, 3.5, 0.04]} position={[-3.02, 1.75, -1.88]} />
      <Glow args={[0.04, 3.5, 0.04]} position={[3.02, 1.75, -1.88]} />
      <mesh position={[0, 1.15, -1.89]}><planeGeometry args={[3.4, 0.008]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
      {/* two screens on the wall running the real app */}
      {[-2.45, 2.45].map((x) => (
        <group key={x} position={[x, 1.55, -1.86]}>
          <mesh><boxGeometry args={[0.95, 1.2, 0.05]} /><meshStandardMaterial color="#050505" roughness={0.2} /></mesh>
          <mesh position={[0, 0, 0.03]}><planeGeometry args={[0.88, 1.11]} /><meshBasicMaterial map={wallet} toneMapped={false} /></mesh>
        </group>
      ))}
      {/* lightbox tower with the symbol */}
      <group position={[2.55, 1.5, 1.2]}>
        <mesh><boxGeometry args={[0.8, 3, 0.8]} /><meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={0.7 * flick} toneMapped={false} /></mesh>
        <mesh position={[0, 0.8, 0.41]}><planeGeometry args={[0.56, 0.56]} /><meshBasicMaterial map={sym} transparent color="#0B0F0D" /></mesh>
      </group>
      {/* the counter: dark top, glowing green front, symbol on the face */}
      <group position={[-0.6, 0.6, 1.1]}>
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[2.6, 0.06, 0.8]} /><meshPhysicalMaterial color="#111" roughness={0.1} clearcoat={1} /></mesh>
        <mesh><boxGeometry args={[2.5, 1, 0.7]} /><meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.7 * flick} toneMapped={false} /></mesh>
        <mesh position={[0, 0.05, 0.36]}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial map={sym} transparent color="#0B0F0D" /></mesh>
      </group>
      {/* green floor glow under the stand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </>
  );
};
