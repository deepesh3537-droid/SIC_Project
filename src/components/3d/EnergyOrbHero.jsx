import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Central Energy Orb
function OrbMesh() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.18;
      meshRef.current.rotation.y += delta * 0.28;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#22D3EE"
        emissive="#0891B2"
        emissiveIntensity={0.7}
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// 3D Swirling Particle Field
function ParticleField({ count = 220 }) {
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
      pointsRef.current.rotation.y += delta * 0.07;
      pointsRef.current.rotation.x += delta * 0.03;
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
        size={0.045}
        color="#22D3EE"
        transparent={true}
        opacity={0.85}
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
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#22D3EE" />
      <pointLight position={[-10, -10, -10]} intensity={1.0} color="#3B82F6" />

      {/* Central Orb */}
      <OrbMesh />

      {/* Futuristic Orbit Rings */}
      <RingMesh radius={2.2} tiltX={Math.PI / 4} tiltZ={0} speed={0.4} color="#22D3EE" />
      <RingMesh radius={2.6} tiltX={-Math.PI / 3} tiltZ={Math.PI / 6} speed={-0.3} color="#3B82F6" />
      <RingMesh radius={3.0} tiltX={Math.PI / 6} tiltZ={-Math.PI / 4} speed={0.2} color="#A78BFA" />

      {/* Ambient Particle Cloud */}
      <ParticleField count={220} />
    </Canvas>
  );
}

// Static / Low-Motion / Reduced-Motion Fallback Orb
function StaticOrbFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

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
          stroke="#3B82F6"
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
          stroke="#22D3EE"
          strokeWidth="1.8"
          className="animate-[spin_10s_linear_infinite] origin-center"
          transform="rotate(-10 100 100)"
        />
      </svg>

      {/* Central Glowing Core */}
      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 via-primary to-blue-500 shadow-[0_0_50px_rgba(34,211,238,0.5)] border border-primary/40 z-20 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-surface/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary font-mono font-bold text-xs">
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
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  useEffect(() => {
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
