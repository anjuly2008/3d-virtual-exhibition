import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function RotatingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[3.5, 0.05, 16, 100]} />
      <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.9} emissive="#d4af37" emissiveIntensity={0.2} />
    </mesh>
  );
}

function FloatingArchitecture() {
  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.3}>
      <group>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1, 2.4, 1]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.3, 0.2, 1.3]} />
          <meshStandardMaterial color="#1e40af" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingSphere() {
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.5}>
      <mesh position={[-3, 1.5, -1]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.8} emissive="#ec4899" emissiveIntensity={0.1} />
      </mesh>
    </Float>
  );
}

function FloatingDodecahedron() {
  return (
    <Float speed={0.9} rotationIntensity={0.8} floatIntensity={0.4}>
      <mesh position={[3.2, 0.8, -0.5]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.7} emissive="#10b981" emissiveIntensity={0.15} />
      </mesh>
    </Float>
  );
}

function FloatingCylinder() {
  return (
    <Float speed={0.7} rotationIntensity={0.4} floatIntensity={0.3}>
      <mesh position={[-2, -0.5, 2]}>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.7} />
      </mesh>
    </Float>
  );
}

function FloatingCone() {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.35}>
      <mesh position={[1.5, -0.8, -2]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.8} emissive="#8b5cf6" emissiveIntensity={0.1} />
      </mesh>
    </Float>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.2} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#d4af37" />
      <pointLight position={[-5, 3, -5]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, -1, 5]} intensity={0.4} color="#ec4899" />
      <directionalLight position={[0, 8, 0]} intensity={0.5} />

      <Stars radius={30} depth={20} count={200} factor={4} saturation={0} fade speed={0.3} />

      <RotatingRing />
      <FloatingArchitecture />
      <FloatingSphere />
      <FloatingDodecahedron />
      <FloatingCylinder />
      <FloatingCone />
      <GroundPlane />
    </>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 55 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <SceneContent />
    </Canvas>
  );
}