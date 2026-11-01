import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Central Energy Orb
function OrbMesh() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#10B981"
        emissive="#059669"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
        wireframe={true}
      />
    </mesh>
  );
}

// 3D Orbital Energy Rings
function RingMesh({ radius, tiltX, tiltZ, speed, color }) {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * speed;
      ringRef.current.rotation.y += delta * (speed * 0.5);
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.03, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// 3D Swirling Particle Field
function ParticleField({ count = 200 }) {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.0 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#38BDF8"
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// 3D Scene Container
function R3FScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#10B981" />
      <pointLight position={[-10, -10, -10]} intensity={1.0} color="#38BDF8" />

      <OrbMesh />
      <RingMesh radius={2.2} tiltX={Math.PI / 4} tiltZ={0} speed={0.4} color="#10B981" />
      <RingMesh radius={2.6} tiltX={-Math.PI / 3} tiltZ={Math.PI / 6} speed={-0.3} color="#38BDF8" />
      <RingMesh radius={3.0} tiltX={Math.PI / 6} tiltZ={-Math.PI / 4} speed={0.2} color="#A78BFA" />
      <ParticleField count={250} />
    </Canvas>
  );
}

// Static / Low-Motion / Reduced-Motion Fallback Orb
function StaticOrbFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute w-60 h-60 rounded-full bg-sky-500/15 blur-2xl" />

      {/* SVG Rings with subtle CSS animation */}
      <svg className="w-80 h-80 relative z-10" viewBox="0 0 200 200" fill="none">
        {/* Outer Ring */}
        <ellipse
          cx="100"
          cy="100"
          rx="85"
          ry="35"
          stroke="#A78BFA"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          className="animate-[spin_20s_linear_infinite] origin-center opacity-70"
          transform="rotate(-25 100 100)"
        />
        {/* Middle Ring */}
        <ellipse
          cx="100"
          cy="100"
          rx="70"
          ry="28"
          stroke="#38BDF8"
          strokeWidth="1.5"
          className="animate-[spin_15s_linear_infinite_reverse] origin-center opacity-80"
          transform="rotate(35 100 100)"
        />
        {/* Inner Ring */}
        <ellipse
          cx="100"
          cy="100"
          rx="55"
          ry="20"
          stroke="#10B981"
          strokeWidth="1.8"
          className="animate-[spin_10s_linear_infinite] origin-center"
          transform="rotate(-10 100 100)"
        />
      </svg>

      {/* Central Glowing Core */}
      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-sky-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-emerald-300/40 z-20 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-surface/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary font-mono font-bold text-xs">
          WATT
        </div>
      </div>
    </div>
  );
}

// Error Boundary & Mode Selector Component
export default function EnergyOrbHero() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  useEffect(() => {
    // Probe WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (renderError || prefersReducedMotion || !hasWebGL) {
    return <StaticOrbFallback />;
  }

  return (
    <div className="w-full h-full relative">
      <R3FScene />
    </div>
  );
}

