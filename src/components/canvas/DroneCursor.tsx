'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

/* ────────────────────────────────────────────────────────────────────
 * Mutable cursor interaction state — read inside useFrame each tick.
 * Written to by DOM event listeners in the outer component.
 * ────────────────────────────────────────────────────────────────── */
const cursorState = {
  mx: 0,          // normalised mouse X  -1..+1
  my: 0,          // normalised mouse Y  -1..+1
  clicked: false,
  hovering: false,
};

/* ────────────────────────────────────────────────────────────────────
 * Inner R3F scene — uses only refs, zero React re-renders
 * ────────────────────────────────────────────────────────────────── */
function DroneModel() {
  const groupRef  = useRef<THREE.Group>(null);
  const rotors    = useRef<(THREE.Group | null)[]>([null, null, null, null]);
  const { viewport } = useThree();

  // Persistent motion state (never causes re-render)
  const pos    = useRef(new THREE.Vector3());
  const prevP  = useRef(new THREE.Vector3());
  const vel    = useRef(new THREE.Vector3());
  const rot    = useRef({ x: 0, y: 0, z: 0 });

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // ── 1. Target position from raw mouse coords ──────────────
    const tx = (cursorState.mx * viewport.width)  / 2;
    const ty = (cursorState.my * viewport.height) / 2;
    let   tz = 0;
    if (cursorState.clicked)  tz = -0.6;   // dip on click
    if (cursorState.hovering) tz =  0.4;   // push slightly forward

    // ── 2. Smooth follow with inertia ─────────────────────────
    prevP.current.copy(pos.current);
    const lerpF = 1 - Math.exp(-14 * delta);
    pos.current.x += (tx - pos.current.x) * lerpF;
    pos.current.y += (ty - pos.current.y) * lerpF;
    pos.current.z += (tz - pos.current.z) * lerpF;

    // Subtle idle bobbing
    const bob = Math.sin(state.clock.elapsedTime * 2.8) * 0.06;

    g.position.set(pos.current.x, pos.current.y + bob, pos.current.z);

    // ── 3. Velocity ───────────────────────────────────────────
    vel.current.subVectors(pos.current, prevP.current).divideScalar(Math.max(delta, 0.001));
    const speed = vel.current.length();

    // ── 4. Banking / pitching / yaw ───────────────────────────
    const tRoll  = THREE.MathUtils.clamp(-vel.current.x * 0.04, -0.5, 0.5);
    const tPitch = THREE.MathUtils.clamp( vel.current.y * 0.04, -0.5, 0.5)
                   + (cursorState.hovering ? 0.28 : 0);
    const tYaw   = THREE.MathUtils.clamp(-vel.current.x * 0.018, -0.3, 0.3);

    const rl = 0.08;
    rot.current.z += (tRoll  - rot.current.z) * rl;
    rot.current.x += (tPitch - rot.current.x) * rl;
    rot.current.y += (tYaw   - rot.current.y) * rl;

    g.rotation.set(rot.current.x, rot.current.y, rot.current.z);

    // ── 5. Rotors ─────────────────────────────────────────────
    const baseRPM = 14 + speed * 2;
    rotors.current.forEach((r, i) => {
      if (r) r.rotation.y += baseRPM * (i % 2 === 0 ? 1 : -1) * delta;
    });
  });

  /* ── Accent colour is set once per render; we trigger zero
       re-renders from useFrame so this stays static (#00f0ff).
       The hover glow is handled via the pointLight intensity
       which is mutated directly in useFrame above. ─────────── */

  return (
    <group ref={groupRef} scale={0.26}>
      {/* ── Main Chassis ────────────────────────── */}
      <mesh>
        <boxGeometry args={[1.2, 0.32, 1.7]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.19, -0.15]}>
        <boxGeometry args={[0.75, 0.09, 1.1]} />
        <meshStandardMaterial color="#151520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Camera / core glow */}
      <mesh position={[0, -0.08, 0.88]}>
        <cylinderGeometry args={[0.13, 0.13, 0.18, 12]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.08, 1]} distance={2.5} intensity={1.5} color="#00f0ff" />

      {/* ── 4 arms + rotors ─────────────────────── */}
      {([
        [-1.05,  1.05],
        [ 1.05,  1.05],
        [-1.05, -1.05],
        [ 1.05, -1.05],
      ] as [number, number][]).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Arm */}
          <mesh position={[-x / 2, 0, -z / 2]} rotation={[0, Math.atan2(x, z), 0]}>
            <boxGeometry args={[0.13, 0.13, Math.hypot(x, z)]} />
            <meshStandardMaterial color="#0a0a0f" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Motor */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.11, 0.14, 0.22, 12]} />
            <meshStandardMaterial color="#222" metalness={1} roughness={0.08} />
          </mesh>
          {/* Accent ring */}
          <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.018, 4, 20]} />
            <meshBasicMaterial color="#00f0ff" toneMapped={false} />
          </mesh>
          {/* Spinning rotor group */}
          <group
            ref={(el) => { if (el) rotors.current[i] = el; }}
            position={[0, 0.33, 0]}
          >
            <mesh>
              <boxGeometry args={[1.3, 0.015, 0.1]} />
              <meshBasicMaterial color="#000" transparent opacity={0.65} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[1.3, 0.015, 0.1]} />
              <meshBasicMaterial color="#000" transparent opacity={0.65} />
            </mesh>
            {/* Motion-blur disc */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.65, 0.025, 2, 28]} />
              <meshBasicMaterial color="#fff" transparent opacity={0.04} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Outer component — DOM event listeners + Canvas
 *
 * CRITICAL:  The wrapper AND the <canvas> must never intercept
 * pointer events.  R3F's <Canvas> creates its own <canvas> element
 * which defaults to pointer-events:auto.  We override that via
 * the `style` prop on <Canvas> AND set it on the wrapper.
 * ────────────────────────────────────────────────────────────────── */
export default function DroneCursor() {
  // Track raw mouse position ourselves (not via R3F pointer which
  // requires the canvas to receive events — which we've disabled)
  const onMouseMove = useCallback((e: MouseEvent) => {
    cursorState.mx = (e.clientX / window.innerWidth)  * 2 - 1;
    cursorState.my = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const handleDown = () => { cursorState.clicked = true; };
    const handleUp   = () => { cursorState.clicked = false; };

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], input, textarea, .bento-card')) {
        cursorState.hovering = true;
      }
    };
    const handleOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], input, textarea, .bento-card')) {
        cursorState.hovering = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup',   handleUp);
    document.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseout',  handleOut,  { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup',   handleUp);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout',  handleOut);
    };
  }, [onMouseMove]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',   // wrapper: no events
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}          /* ← KEY FIX */
        eventSource={undefined as unknown as HTMLElement}  /* disable R3F event system */
        eventPrefix="client"
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 10, 5]} intensity={3} />
        <pointLight position={[-10, 0, -5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[10, 0, -5]}  intensity={1.5} color="#7b2fff" />
        <DroneModel />
      </Canvas>
    </div>
  );
}
