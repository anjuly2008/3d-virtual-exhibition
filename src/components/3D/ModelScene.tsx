import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Exhibit } from '@/types';

function AnimatedGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function FutureCitySkyline() {
  const buildings = [
    { x: -4, z: 1, w: 0.8, h: 3.5, color: '#3b82f6', windows: 6 },
    { x: -2.8, z: -1, w: 0.7, h: 5.5, color: '#1d4ed8', windows: 10 },
    { x: -1.2, z: 0.5, w: 1, h: 4.5, color: '#60a5fa', windows: 8 },
    { x: 0.5, z: -1.2, w: 1.2, h: 7.5, color: '#06b6d4', windows: 14 },
    { x: 2, z: 1, w: 0.9, h: 5, color: '#3b82f6', windows: 9 },
    { x: 3.2, z: -0.5, w: 0.6, h: 4, color: '#2563eb', windows: 7 },
    { x: 4.2, z: 1.2, w: 0.7, h: 3.2, color: '#60a5fa', windows: 5 },
  ];

  return (
    <AnimatedGroup>
      {buildings.map((b, i) => (
        //把 buildings 里面每一栋建筑拿出来处理
        <Float key={i} speed={0.3 + i * 0.02} rotationIntensity={0.05} floatIntensity={0.08}>{/*让里面的 3D物体产生轻微的漂浮、晃动效果*/}
          {/*rotationIntensity={0.05}旋转幅度很小   floatIntensity上下漂浮的幅度*/}
          <group position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, b.w]} />
              <meshStandardMaterial color={b.color} roughness={0.15} metalness={0.8} />
            </mesh>{/*一个真正可以显示出来的 3D 物体*/}
            {i === 3 && (
              <mesh position={[0, b.h + 0.4, 0]}>
                <coneGeometry args={[0.5, 1.2, 8, 1]} />
                <meshStandardMaterial color="#22d3ee" roughness={0.1} metalness={0.9} emissive="#22d3ee" emissiveIntensity={0.4} />
              {/*emissive这个物体自己“发光”的颜色emissiveIntensity自发光强度*/}
              </mesh>
            )}
            {[...Array(b.windows)].map((_, wi) => (
             //根据 windows 数量批量生成窗户
              <mesh key={`w-${i}-${wi}`} position={[0, 0.5 + wi * (b.h - 1) / b.windows, b.w / 2 + 0.01]}>
                {/*wi当前正在生成第几个窗户*/}
                <planeGeometry args={[b.w * 0.4, 0.2]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6 + Math.random() * 0.4} side={THREE.DoubleSide} />
              </mesh>
            ))}
            {[...Array(b.windows)].map((_, wi) => (
              <mesh key={`w2-${i}-${wi}`} position={[0, 0.5 + wi * (b.h - 1) / b.windows, -b.w / 2 - 0.01]}>
                <planeGeometry args={[b.w * 0.4, 0.2]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.4} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}

      <mesh position={[-1.8, 3.2, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 1.5, 0.3]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[1.8, 4.5, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 2, 0.3]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.7} />
      </mesh>

      {[...Array(6)].map((_, i) => (
        <mesh key={`lamp-${i}`} position={[-4 + i * 1.6, 0, 2.5]}>
          <cylinderGeometry args={[0.05, 0.06, 1.5, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
      {[...Array(6)].map((_, i) => (
        <mesh key={`lamp-top-${i}`} position={[-4 + i * 1.6, 0.85, 2.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1} />
        </mesh>
      ))}

      {[...Array(3)].map((_, i) => (
        <Float key={`drone-${i}`} speed={0.8 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <group position={[-2 + i * 2.5, 4 + i * 0.8, -2]}>
            <mesh><boxGeometry args={[0.15, 0.05, 0.1]} /><meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.7} /></mesh>
            <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} /></mesh>
            <mesh position={[0.15, 0, 0]}><boxGeometry args={[0.5, 0.02, 0.04]} /><meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} /></mesh>
            <mesh position={[-0.15, 0, 0]}><boxGeometry args={[0.5, 0.02, 0.04]} /><meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} /></mesh>
          </group>
        </Float>
      ))}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.1} />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <mesh key={`road-${i}`} position={[-4 + i * 2, -0.04, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.06]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </AnimatedGroup>
  );
}

function SmartwatchDesign() {
  return (
    <AnimatedGroup>
      <Float speed={0.6} rotationIntensity={0.25} floatIntensity={0.2}>
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.25, 64, 1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.08} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.02, 0.14]}>
            <cylinderGeometry args={[0.62, 0.62, 0.03, 64, 1]} />
            <meshStandardMaterial color="#334155" roughness={0.1} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.03, 0.16]}>
            <cylinderGeometry args={[0.55, 0.55, 0.02, 64, 1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.05} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.04, 0.17]}>
            <cylinderGeometry args={[0.48, 0.48, 0.01, 32, 1]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.8} emissive="#06b6d4" emissiveIntensity={0.25} />
          </mesh>

          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const cx = Math.cos(angle) * 0.4;
            const cy = Math.sin(angle) * 0.4;
            return (
              <mesh key={`tick-${i}`} position={[cx, cy + 0.05, 0.18]} rotation={[0, 0, angle]}>
                <boxGeometry args={[0.04, 0.02, 0.005]} />
                <meshStandardMaterial color={i % 3 === 0 ? '#22d3ee' : '#94a3b8'} emissive={i % 3 === 0 ? '#22d3ee' : '#94a3b8'} emissiveIntensity={i % 3 === 0 ? 0.6 : 0.3} />
              </mesh>
            );
          })}

          <mesh position={[0.05, 0.1, 0.18]}>
            <boxGeometry args={[0.03, 0.12, 0.005]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[0.05, -0.05, 0.18]}>
            <boxGeometry args={[0.08, 0.03, 0.005]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} />
          </mesh>

          <mesh position={[0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16, 1]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.8} />
          </mesh>

          {[...Array(8)].map((_, i) => (
            <mesh key={`crown-${i}`} position={[0.8 + i * 0.025, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.015, 16, 1]} />
              <meshStandardMaterial color="#475569" roughness={0.2} metalness={0.7} />
            </mesh>
          ))}

          {[...Array(14)].map((_, i) => {
            const a = -Math.PI / 3 + (i / 14) * (Math.PI * 2 / 3);
            const rx = Math.cos(a) * 1.1;
            const ry = Math.sin(a) * 1.1 + 0.4;
            return (
              <group key={`band-${i}`} position={[rx, ry, 0]} rotation={[0, 0, a + Math.PI / 3]}>
                <mesh>
                  <boxGeometry args={[0.45, 0.12, 0.1]} />
                  <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.75} />
                </mesh>
                <mesh position={[0, 0.07, 0]}>
                  <boxGeometry args={[0.4, 0.02, 0.08]} />
                  <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
                </mesh>
              </group>
            );
          })}

          <mesh position={[0, -0.25, -0.13]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[0.15, -0.25, -0.13]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </Float>

      {[...Array(10)].map((_, i) => (
        <Float key={`p-${i}`} speed={0.8 + i * 0.1} rotationIntensity={0.4} floatIntensity={0.2}>
          <mesh position={[Math.cos(i * Math.PI / 5) * 2.5, Math.sin(i * Math.PI / 5) * 2.5, -1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.7} />
          </mesh>
        </Float>
      ))}
    </AnimatedGroup>
  );
}

function MagicForestScene() {
  const trees = [
    { x: -3.5, z: -1.5, h: 1.5, s: 0.6 },
    { x: -1.8, z: 1, h: 2, s: 0.75 },
    { x: 0, z: -2, h: 2.5, s: 0.9 },
    { x: 1.5, z: 1.5, h: 1.8, s: 0.7 },
    { x: 3.2, z: -1, h: 2.2, s: 0.8 },
    { x: 4, z: 2, h: 1.4, s: 0.55 },
  ];

  return (
    <AnimatedGroup>
      <Stars radius={50} depth={30} count={3000} factor={3} saturation={0} fade speed={0.5} />

      {trees.map((t, i) => (
        <Float key={`tree-${i}`} speed={0.3} rotationIntensity={0.1} floatIntensity={0.12}>
          <group position={[t.x, 0, t.z]}>
            <mesh position={[0, t.h * 0.35, 0]}>
              <cylinderGeometry args={[0.08, 0.12, t.h * 0.7, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.5} metalness={0.05} />
            </mesh>
            <mesh position={[0, t.h * 0.55, 0]}>
              <coneGeometry args={[t.s * 0.7, t.h * 0.5, 8]} />
              <meshStandardMaterial color="#14532d" roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[0, t.h * 0.7, 0]}>
              <coneGeometry args={[t.s * 0.5, t.h * 0.4, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[0, t.h * 0.85, 0]}>
              <coneGeometry args={[t.s * 0.3, t.h * 0.3, 8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.35} metalness={0.05} />
            </mesh>
          </group>
        </Float>
      ))}

      {[...Array(8)].map((_, i) => (
        <Float key={`mush-${i}`} speed={0.25} rotationIntensity={0.08} floatIntensity={0.1}>
          <group position={[-2 + i * 0.6, 0, -2.5 + (i % 3) * 0.4]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.2, 6]} />
              <meshStandardMaterial color="#d4a574" roughness={0.4} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#ec4899' : '#a855f7'} roughness={0.3} metalness={0.1} emissive={i % 2 === 0 ? '#ec4899' : '#a855f7'} emissiveIntensity={0.4} />
            </mesh>
          </group>
        </Float>
      ))}

      {[...Array(4)].map((_, i) => (
        <Float key={`crystal-${i}`} speed={0.5} rotationIntensity={0.2} floatIntensity={0.15}>
          <mesh position={[-3 + i * 2, 0.6 + i * 0.2, 1.5 + (i % 2) * 0.5]} rotation={[0, i * 0.5, 0]}>
            <octahedronGeometry args={[0.25 + i * 0.05, 0]} />
            <meshStandardMaterial color="#22d3ee" roughness={0.1} metalness={0.7} emissive="#22d3ee" emissiveIntensity={0.6} />
          </mesh>
        </Float>
      ))}

      {[...Array(20)].map((_, i) => (
        <Float key={`firefly-${i}`} speed={1 + i * 0.08} rotationIntensity={0.5} floatIntensity={0.6}>
          <mesh position={[(Math.random() - 0.5) * 7, Math.random() * 2 + 0.2, (Math.random() - 0.5) * 6]}>
            <sphereGeometry args={[0.03 + Math.random() * 0.03, 4, 4]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#a7f3d0' : '#67e8f9'} emissive={i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#a7f3d0' : '#67e8f9'} emissiveIntensity={1.2} />
          </mesh>
        </Float>
      ))}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#064e3b" roughness={0.8} metalness={0.05} />
      </mesh>

      {[...Array(12)].map((_, i) => (
        <mesh key={`grass-${i}`} position={[(Math.random() - 0.5) * 8, 0.05, (Math.random() - 0.5) * 6]}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#047857' : '#059669'} roughness={0.4} metalness={0.05} />
        </mesh>
      ))}
    </AnimatedGroup>
  );
}

function AbstractGeometricArt() {
  const shapes = [
    { geo: 'dodecahedron', color: '#f59e0b' },
    { geo: 'icosahedron', color: '#ec4899' },
    { geo: 'octahedron', color: '#3b82f6' },
    { geo: 'tetrahedron', color: '#8b5cf6' },
    { geo: 'dodecahedron', color: '#06b6d4' },
    { geo: 'icosahedron', color: '#f59e0b' },
    { geo: 'octahedron', color: '#ec4899' },
    { geo: 'tetrahedron', color: '#22d3ee' },
    { geo: 'dodecahedron', color: '#a855f7' },
    { geo: 'icosahedron', color: '#3b82f6' },
    { geo: 'octahedron', color: '#f59e0b' },
    { geo: 'tetrahedron', color: '#ec4899' },
  ];

  return (
    <AnimatedGroup>
      {shapes.map((s, i) => {
        const angle = (i / shapes.length) * Math.PI * 2;
        const r = 2.8 + (i % 3) * 0.6;
        const h = Math.sin(i * 0.8) * 1.5;
        return (
          <Float key={`shape-${i}`} speed={0.4 + i * 0.04} rotationIntensity={0.5} floatIntensity={0.3}>
            <mesh position={[Math.cos(angle) * r, h, Math.sin(angle) * r]} rotation={[i * 0.5, i * 0.4, i * 0.3]}>
              {s.geo === 'dodecahedron' && <dodecahedronGeometry args={[0.35, 0]} />}
              {s.geo === 'icosahedron' && <icosahedronGeometry args={[0.35, 0]} />}
              {s.geo === 'octahedron' && <octahedronGeometry args={[0.35, 0]} />}
              {s.geo === 'tetrahedron' && <tetrahedronGeometry args={[0.35, 0]} />}
              <meshStandardMaterial color={s.color} roughness={0.1} metalness={0.9} emissive={s.color} emissiveIntensity={0.2} />
            </mesh>
          </Float>
        );
      })}

      <Float speed={0.7} rotationIntensity={0.5} floatIntensity={0.35}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.2, 2]} />
          <MeshDistortMaterial color="#8b5cf6" attach="material" distort={0.25} speed={2} roughness={0.08} metalness={0.9} emissive="#8b5cf6" emissiveIntensity={0.3} />
        </mesh>
      </Float>

      {[...Array(5)].map((_, i) => (
        <Float key={`ring-${i}`} speed={0.3 + i * 0.05} rotationIntensity={0.15} floatIntensity={0.15}>
          <mesh position={[0, -1 + i * 0.3, -1.5 - i * 1.2]} rotation={[Math.PI / 2.5 + i * 0.2, i * 0.4, 0]}>
            <torusGeometry args={[2.8 + i * 0.4, 0.04, 16, 80]} />
            <meshStandardMaterial color={['#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4'][i]} roughness={0.15} metalness={0.85} />
          </mesh>
        </Float>
      ))}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.05} />
      </mesh>
    </AnimatedGroup>
  );
}

function HumanAnatomyModel() {
  return (
    <AnimatedGroup>
      <Float speed={0.4} rotationIntensity={0.12} floatIntensity={0.15}>
        <group>
          <mesh position={[0, 2.8, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.3} metalness={0.15} />
          </mesh>
          <mesh position={[0, 3.1, 0.1]}>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.25} metalness={0.15} />
          </mesh>

          {[...Array(14)].map((_, i) => (
            <mesh key={`spine-${i}`} position={[0, 2.5 - i * 0.18, 0]}>
              <boxGeometry args={[0.15, 0.12, 0.1]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
            </mesh>
          ))}

          {[...Array(8)].map((_, i) => {
            const y = 2.1 - i * 0.22;
            const spread = 0.3 + Math.sin(i / 7 * Math.PI) * 0.4;
            return (
              <group key={`rib-${i}`}>
                <mesh position={[0.05, y, 0]} rotation={[0, 0, Math.PI / 2.5]}>
                  <torusGeometry args={[spread, 0.03, 8, 12, Math.PI]} />
                  <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
                </mesh>
                <mesh position={[-0.05, y, 0]} rotation={[0, 0, -Math.PI / 2.5]}>
                  <torusGeometry args={[spread, 0.03, 8, 12, Math.PI]} />
                  <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
                </mesh>
              </group>
            );
          })}

          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.25} metalness={0.1} emissive="#ef4444" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0.15, 1.25, 0.05]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.1} emissive="#dc2626" emissiveIntensity={0.2} />
          </mesh>

          {[-1, 1].map((side) => (
            <group key={`arm-${side}`}>
              <mesh position={[side * 0.35, 2.3, 0]} rotation={[0, 0, side * 0.3]}>
                <cylinderGeometry args={[0.06, 0.07, 0.9, 8]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
              </mesh>
              <mesh position={[side * 0.55, 1.6, 0]} rotation={[0, 0, side * 0.15]}>
                <cylinderGeometry args={[0.05, 0.06, 0.75, 8]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
              </mesh>
            </group>
          ))}

          {[-1, 1].map((side) => (
            <group key={`leg-${side}`}>
              <mesh position={[side * 0.12, 0.35, 0.05]}>
                <cylinderGeometry args={[0.08, 0.1, 1.1, 8]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
              </mesh>
              <mesh position={[side * 0.12, -0.45, 0.05]}>
                <cylinderGeometry args={[0.07, 0.08, 0.8, 8]} />
                <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
              </mesh>
            </group>
          ))}

          <mesh position={[-0.15, 0.6, 0]}>
            <boxGeometry args={[0.35, 0.2, 0.25]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.25} metalness={0.15} />
          </mesh>
        </group>
      </Float>

      {[...Array(16)].map((_, i) => (
        <Float key={`node-${i}`} speed={0.5 + i * 0.05} rotationIntensity={0.3} floatIntensity={0.2}>
          <mesh position={[Math.cos(i * Math.PI / 8) * 2.2, Math.sin(i * Math.PI / 8) * 2.2 + 1.5, Math.sin(i * 0.5) * 0.8]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#84cc16' : '#22d3ee'} emissive={i % 2 === 0 ? '#84cc16' : '#22d3ee'} emissiveIntensity={0.6} />
          </mesh>
        </Float>
      ))}
    </AnimatedGroup>
  );
}

function GreekTempleScene() {
  return (
    <AnimatedGroup>
      <Float speed={0.3} rotationIntensity={0.06} floatIntensity={0.08}>
        <group>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[6.5, 0.1, 5]} />
            <meshStandardMaterial color="#c0b9b0" roughness={0.35} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[6, 0.1, 4.5]} />
            <meshStandardMaterial color="#d4cfc9" roughness={0.3} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[5.5, 0.1, 4]} />
            <meshStandardMaterial color="#e8e4df" roughness={0.3} metalness={0.05} />
          </mesh>

          {[-1, 1].map((side, si) => (
            <group key={`col-row-${si}`}>
              {[...Array(6)].map((_, i) => (
                <group key={`col-f-${i}`}>
                  <mesh position={[-2 + i * 0.8, 0.45 + 1.2, side * 1.5]}>
                    <cylinderGeometry args={[0.1, 0.12, 2.4, 12]} />
                    <meshStandardMaterial color="#e8e4df" roughness={0.25} metalness={0.05} />
                  </mesh>
                  <mesh position={[-2 + i * 0.8, 0.45, side * 1.5]}>
                    <boxGeometry args={[0.28, 0.08, 0.28]} />
                    <meshStandardMaterial color="#d4cfc9" roughness={0.3} metalness={0.05} />
                  </mesh>
                  <mesh position={[-2 + i * 0.8, 0.45 + 2.45, side * 1.5]}>
                    <boxGeometry args={[0.26, 0.1, 0.26]} />
                    <meshStandardMaterial color="#d4cfc9" roughness={0.3} metalness={0.05} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}

          {[-1, 1].map((side) => (
            [...Array(3)].map((_, i) => (
              <group key={`col-s-${side}-${i}`}>
                <mesh position={[side * 2.8, 0.45 + 1.2, -0.8 + i * 0.8]}>
                  <cylinderGeometry args={[0.1, 0.12, 2.4, 12]} />
                  <meshStandardMaterial color="#d4cfc9" roughness={0.25} metalness={0.05} />
                </mesh>
              </group>
            ))
          ))}

          <mesh position={[0, 0.45 + 2.5, 0]}>
            <boxGeometry args={[5.5, 0.1, 4]} />
            <meshStandardMaterial color="#e8e4df" roughness={0.25} metalness={0.05} />
          </mesh>

          <mesh position={[0, 2.7, 1.2]}>
            <boxGeometry args={[5.5, 0.15, 1.6]} />
            <meshStandardMaterial color="#d4cfc9" roughness={0.25} metalness={0.08} />
          </mesh>

          <mesh position={[0, 2.85, 1.3]}>
            <coneGeometry args={[2.8, 0.8, 6, 1]} />
            <meshStandardMaterial color="#e8e4df" roughness={0.25} metalness={0.08} />
          </mesh>

          <mesh position={[0, 3.2, 1.3]}>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.15} metalness={0.3} emissive="#fcd34d" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[-1.5, 3.15, 1.3]}>
            <boxGeometry args={[0.2, 0.08, 0.2]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.15} metalness={0.3} />
          </mesh>
          <mesh position={[1.5, 3.15, 1.3]}>
            <boxGeometry args={[0.2, 0.08, 0.2]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.15} metalness={0.3} />
          </mesh>

          <mesh position={[0, 2.2, 1.9]}>
            <boxGeometry args={[3.5, 2.5, 0.15]} />
            <meshStandardMaterial color="#d4cfc9" roughness={0.3} metalness={0.05} />
          </mesh>
        </group>
      </Float>

      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} metalness={0.05} />
      </mesh>
    </AnimatedGroup>
  );
}

function EVCarDesign() {
  return (
    <AnimatedGroup>
      <Float speed={0.5} rotationIntensity={0.18} floatIntensity={0.15}>
        <group>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[3.2, 0.3, 1.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[2.5, 0.25, 1.1]} />
            <meshStandardMaterial color="#334155" roughness={0.08} metalness={0.9} />
          </mesh>
          <mesh position={[-0.3, 0.5, 0]}>
            <boxGeometry args={[1.8, 0.2, 1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.85} />
          </mesh>

          <mesh position={[-0.3, 0.55, 0.52]}>
            <planeGeometry args={[1.6, 0.35]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.7} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
          <mesh position={[1, 0.5, 0.52]}>
            <planeGeometry args={[0.5, 0.3]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.7} side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.3, 0.55, -0.52]}>
            <planeGeometry args={[1.6, 0.35]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.7} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>

          <mesh position={[-1.65, 0.3, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.2]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.9} emissive="#06b6d4" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-1.65, 0.3, 0.35]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.9} />
          </mesh>
          <mesh position={[-1.65, 0.3, -0.35]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.9} />
          </mesh>

          <mesh position={[1.65, 0.3, 0]}>
            <boxGeometry args={[0.15, 0.35, 0.6]} />
            <meshStandardMaterial color="#ef4444" roughness={0.05} metalness={0.9} emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.65, 0.3, 0.35]}>
            <boxGeometry args={[0.15, 0.35, 0.1]} />
            <meshStandardMaterial color="#dc2626" roughness={0.05} metalness={0.9} emissive="#dc2626" emissiveIntensity={0.3} />
          </mesh>

          {[-2.4, 2.4].map((x) => (
            [...Array(1)].map(() => (
              <group key={`wheel-${x}`}>
                {[-1, 1].map((z) => (
                  <group key={`wz-${z}`}>
                    <mesh position={[x * 0.38, 0.1, z * 0.65]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.22, 0.22, 0.15, 24, 1]} />
                      <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.3} />
                    </mesh>
                    <mesh position={[x * 0.38, 0.1, z * 0.68]} rotation={[0, 0, Math.PI / 2]}>
                      <torusGeometry args={[0.18, 0.02, 8, 24]} />
                      <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.85} />
                    </mesh>
                    {[...Array(5)].map((_, si) => (
                      <mesh key={`spoke-${x}-${z}-${si}`} position={[x * 0.38, 0.1 + Math.sin(si * 1.25) * 0.16, z * 0.68 + Math.cos(si * 1.25) * 0.16]} rotation={[0, Math.PI / 2, 0]}>
                        <cylinderGeometry args={[0.015, 0.015, 0.15, 6]} />
                        <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.7} />
                      </mesh>
                    ))}
                  </group>
                ))}
              </group>
            ))
          ))}

          <mesh position={[-0.8, 0.3, 0.68]}>
            <boxGeometry args={[0.06, 0.06, 0.04]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} metalness={0.7} />
          </mesh>
          <mesh position={[0.8, 0.3, 0.68]}>
            <boxGeometry args={[0.06, 0.06, 0.04]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} metalness={0.7} />
          </mesh>
        </group>
      </Float>

      {[...Array(8)].map((_, i) => (
        <Float key={`p-${i}`} speed={0.7 + i * 0.06} rotationIntensity={0.3} floatIntensity={0.2}>
          <mesh position={[Math.cos(i * Math.PI / 4) * 3.5, Math.sin(i * Math.PI / 4) * 1.2 + 0.5, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.7} />
          </mesh>
        </Float>
      ))}
    </AnimatedGroup>
  );
}

function CyberpunkStreet() {
  return (
    <AnimatedGroup>
      <Stars radius={40} depth={25} count={5000} factor={4} saturation={0} fade speed={0.4} />

      {[...Array(7)].map((_, i) => (
        <Float key={`bld-${i}`} speed={0.2} rotationIntensity={0.04} floatIntensity={0.06}>
          <group position={[-5.5 + i * 1.8, 0, -1 + (i % 2) * 1]}>
            <mesh position={[0, (2 + Math.sin(i * 1.2) * 2) / 2, 0]}>
              <boxGeometry args={[1.5, 2 + Math.sin(i * 1.2) * 2, 1.5]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#1e1b4b' : i % 3 === 1 ? '#312e81' : '#0f0a2e'} roughness={0.3} metalness={0.3} />
            </mesh>
            {[...Array(Math.floor(4 + Math.sin(i) * 3))].map((_, wi) => (
              <mesh key={`bw-${i}-${wi}`} position={[0.77, 0.5 + wi * 0.6, 0]}>
                <planeGeometry args={[0.6, 0.15]} />
                <meshStandardMaterial color={wi % 2 === 0 ? '#fef08a' : '#a78bfa'} emissive={wi % 2 === 0 ? '#fef08a' : '#a78bfa'} emissiveIntensity={0.6} side={THREE.DoubleSide} />
              </mesh>
            ))}
            <mesh position={[0.77, 1.5 + Math.sin(i) * 0.8, 0]}>
              <planeGeometry args={[1, 0.25]} />
              <meshStandardMaterial color={['#ef4444', '#22d3ee', '#a855f7', '#f59e0b', '#10b981'][i % 5]} emissive={['#ef4444', '#22d3ee', '#a855f7', '#f59e0b', '#10b981'][i % 5]} emissiveIntensity={1.2} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Float>
      ))}

      {[...Array(10)].map((_, i) => (
        <mesh key={`neon-ad-${i}`} position={[-4 + i * 1.2, 1 + Math.sin(i) * 1.5, 1.8]} rotation={[0, i * 0.1, 0.05]}>
          <planeGeometry args={[0.8, 0.4]} />
          <meshStandardMaterial color={['#ef4444', '#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#ec4899'][i % 6]} emissive={['#ef4444', '#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#ec4899'][i % 6]} emissiveIntensity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {[...Array(4)].map((_, i) => (
        <Float key={`flyer-${i}`} speed={0.6 + i * 0.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <group position={[-3 + i * 2.5, 3 + i * 0.6, -2]}>
            <mesh><boxGeometry args={[0.2, 0.06, 0.12]} /><meshStandardMaterial color="#64748b" roughness={0.15} metalness={0.7} /></mesh>
            <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} /></mesh>
            <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.06, 0.03, 0.06]} /><meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.7} /></mesh>
          </group>
        </Float>
      ))}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>

      {[...Array(10)].map((_, i) => (
        <mesh key={`ref-${i}`} position={[-5 + i * 1.2, -0.04, Math.sin(i) * 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#22d3ee' : '#ef4444'} side={THREE.DoubleSide} transparent opacity={0.25} />
        </mesh>
      ))}
    </AnimatedGroup>
  );
}

function DigitalSculpture() {
  return (
    <AnimatedGroup>
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const r = 2.5 + Math.sin(i * 0.5) * 0.5;
        const h = Math.cos(i * 0.8) * 1.8;
        const colors = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981'];
        return (
          <Float key={`frag-${i}`} speed={0.4 + i * 0.05} rotationIntensity={0.5} floatIntensity={0.35}>
            <mesh
              position={[Math.cos(angle) * r, h, Math.sin(angle) * r]}
              rotation={[i * 0.6, i * 0.8, i * 0.4]}
            >
              {i % 4 === 0 ? <dodecahedronGeometry args={[0.3, 0]} /> :
               i % 4 === 1 ? <icosahedronGeometry args={[0.3, 0]} /> :
               i % 4 === 2 ? <octahedronGeometry args={[0.35, 0]} /> :
               <tetrahedronGeometry args={[0.35, 0]} />}
              <meshStandardMaterial color={colors[i % 6]} roughness={0.08} metalness={0.9} emissive={colors[i % 6]} emissiveIntensity={0.2} />
            </mesh>
          </Float>
        );
      })}

      <Float speed={1} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#8b5cf6" attach="material" distort={0.35} speed={2.5} roughness={0.1} metalness={0.85} emissive="#8b5cf6" emissiveIntensity={0.35} />
        </mesh>
      </Float>

      {[...Array(7)].map((_, i) => (
        <Float key={`ring-${i}`} speed={0.3} rotationIntensity={0.2} floatIntensity={0.12}>
          <mesh position={[0, -1.5 + i * 0.3, -2.5 - i * 1.3]} rotation={[Math.PI / 2.5 + i * 0.3, i * 0.4, 0]}>
            <torusGeometry args={[3.2 + i * 0.4, 0.035, 16, 80]} />
            <meshStandardMaterial color={['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#fcd34d'][i]} roughness={0.15} metalness={0.8} emissive={['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#fcd34d'][i]} emissiveIntensity={0.3} />
          </mesh>
        </Float>
      ))}

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.05} />
      </mesh>
    </AnimatedGroup>
  );
}

function SolarSystemModel() {
  return (
    <AnimatedGroup>
      <Stars radius={70} depth={50} count={6000} factor={3} saturation={0} fade speed={0.2} />

      <Float speed={0.2} rotationIntensity={0.08} floatIntensity={0.08}>
        <group position={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[1.2, 48, 48]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.2} emissive="#fbbf24" emissiveIntensity={1} />
          </mesh>
          {[...Array(3)].map((_, i) => (
            <mesh key={`corona-${i}`} rotation={[0, i * 0.5, 0]}>
              <torusGeometry args={[1.35 + i * 0.1, 0.06, 16, 40]} />
              <meshStandardMaterial color="#fef08a" roughness={0.1} metalness={0.2} emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      </Float>

      {[
        { dist: 2.5, size: 0.08, color: '#9ca3af', name: 'mercury' },
        { dist: 3.3, size: 0.16, color: '#d97706', name: 'venus' },
        { dist: 4.3, size: 0.18, color: '#3b82f6', name: 'earth' },
        { dist: 5.3, size: 0.13, color: '#ef4444', name: 'mars' },
        { dist: 7.2, size: 0.65, color: '#f59e0b', name: 'jupiter' },
        { dist: 8.8, size: 0.55, color: '#d4a574', name: 'saturn' },
        { dist: 10.2, size: 0.32, color: '#22d3ee', name: 'uranus' },
        { dist: 11.2, size: 0.3, color: '#0ea5e9', name: 'neptune' },
      ].map((planet, i) => {
        return (
          <Float key={planet.name} speed={0.15 + i * 0.02} rotationIntensity={0.05} floatIntensity={0.06}>
            <group>
              <mesh position={[Math.cos(i * 0.9) * planet.dist, Math.sin(i * 0.7) * planet.dist * 0.3, Math.sin(i * 0.5) * planet.dist * 0.3]}>
                <sphereGeometry args={[planet.size, 20, 20]} />
                <meshStandardMaterial color={planet.color} roughness={0.3} metalness={0.3} />
              </mesh>
              {planet.name === 'saturn' && (
                <group position={[Math.cos(i * 0.9) * planet.dist, Math.sin(i * 0.7) * planet.dist * 0.3, Math.sin(i * 0.5) * planet.dist * 0.3]} rotation={[Math.PI / 2.3, 0.3, 0]}>
                  <torusGeometry args={[planet.size * 2.2, 0.12, 16, 48]} />
                  <meshStandardMaterial color="#d4a574" roughness={0.35} metalness={0.2} side={THREE.DoubleSide} />
                  <torusGeometry args={[planet.size * 2.5, 0.08, 16, 48]} />
                  <meshStandardMaterial color="#c4a064" roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
                  <torusGeometry args={[planet.size * 1.9, 0.05, 16, 48]} />
                  <meshStandardMaterial color="#e4b474" roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
                </group>
              )}
              {planet.name === 'jupiter' && (
                <>
                  <mesh position={[Math.cos(i * 0.9) * planet.dist, Math.sin(i * 0.7) * planet.dist * 0.3 + 0.15, Math.sin(i * 0.5) * planet.dist * 0.3]}>
                    <torusGeometry args={[planet.size * 1.05, 0.04, 8, 32]} />
                    <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.2} />
                  </mesh>
                  <mesh position={[Math.cos(i * 0.9) * planet.dist, Math.sin(i * 0.7) * planet.dist * 0.3 - 0.1, Math.sin(i * 0.5) * planet.dist * 0.3]}>
                    <torusGeometry args={[planet.size * 1.05, 0.04, 8, 32]} />
                    <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.2} />
                  </mesh>
                </>
              )}
              {planet.name === 'earth' && (
                <mesh position={[Math.cos(i * 0.9) * planet.dist + planet.size * 1.5, Math.sin(i * 0.7) * planet.dist * 0.3, Math.sin(i * 0.5) * planet.dist * 0.3]}>
                  <sphereGeometry args={[0.03, 6, 6]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.3} />
                </mesh>
              )}
            </group>
          </Float>
        );
      })}

      {[...Array(8)].map((_, i) => (
        <mesh key={`orbit-${i}`} rotation={[Math.PI / 2.5, 0, i * 0.2]}>
          <ringGeometry args={[2.5 + i * 1.2, 2.53 + i * 1.2, 80]} />
          <meshBasicMaterial color="#334155" side={THREE.DoubleSide} transparent opacity={0.35} />
        </mesh>
      ))}

      {[...Array(40)].map((_, i) => (
        <mesh key={`belt-${i}`} position={[Math.cos(i * 0.16 + 1) * (6 + Math.random() * 0.5), Math.sin(i * 0.16 + 1) * (6 + Math.random() * 0.5) * 0.2, Math.sin(i * 0.08 + 1) * 0.3]}>
          <sphereGeometry args={[0.03 + Math.random() * 0.02, 4, 4]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </AnimatedGroup>
  );
}

function FutureCommunity() {
  return (
    <AnimatedGroup>
      <Float speed={0.3} rotationIntensity={0.06} floatIntensity={0.08}>
        <group>
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.5} metalness={0.08} />
          </mesh>

          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.15} metalness={0.7} />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
            <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
          </mesh>

          <mesh position={[-2.5, 0.8, -0.5]}>
            <boxGeometry args={[1, 1.6, 1]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.15} metalness={0.65} />
          </mesh>
          <mesh position={[2.5, 0.8, -0.5]}>
            <boxGeometry args={[1, 1.6, 1]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.15} metalness={0.65} />
          </mesh>
          <mesh position={[-1.8, 0.6, 2]}>
            <boxGeometry args={[0.8, 1.3, 0.8]} />
            <meshStandardMaterial color="#10b981" roughness={0.15} metalness={0.65} />
          </mesh>
          <mesh position={[1.8, 0.6, 2]}>
            <boxGeometry args={[0.8, 1.3, 0.8]} />
            <meshStandardMaterial color="#10b981" roughness={0.15} metalness={0.65} />
          </mesh>

          {[-0.6, 0.6].map((x) => (
            <mesh key={`bld-s-${x}`} position={[x, 0.45, 2.3]}>
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color="#8b5cf6" roughness={0.15} metalness={0.65} />
            </mesh>
          ))}

          <mesh position={[0, 0.12, 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.2} />
          </mesh>

          {[-2, 0, 2].map((x) => (
            <mesh key={`path-${x}`} position={[x, 0.02, -2.5]}>
              <boxGeometry args={[0.2, 0.02, 4.5]} />
              <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.1} />
            </mesh>
          ))}

          {[...Array(6)].map((_, i) => (
            <group key={`tree-${i}`}>
              <mesh position={[-3.5 + i * 1.5, 0.15, 3]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
                <meshStandardMaterial color="#451a03" roughness={0.4} metalness={0.05} />
              </mesh>
              <mesh position={[-3.5 + i * 1.5, 0.35, 3]}>
                <coneGeometry args={[0.2, 0.5, 8]} />
                <meshStandardMaterial color="#15803d" roughness={0.35} metalness={0.05} />
              </mesh>
            </group>
          ))}

          {[...Array(8)].map((_, i) => (
            <mesh key={`lamp-${i}`} position={[-3 + i * 0.9, 0.6, -3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          ))}

          <mesh position={[-2, 0.02, -2.5]}>
            <boxGeometry args={[0.4, 0.02, 0.6]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh position={[2, 0.02, -2.5]}>
            <boxGeometry args={[0.4, 0.02, 0.6]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      </Float>

      {[...Array(6)].map((_, i) => (
        <Float key={`fp-${i}`} speed={0.4} rotationIntensity={0.12} floatIntensity={0.15}>
          <mesh position={[-2 + i * 0.8, 2 + Math.sin(i) * 0.3, -1]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
          </mesh>
        </Float>
      ))}
    </AnimatedGroup>
  );
}

function SmartHomeHub() {
  return (
    <AnimatedGroup>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.18}>
        <group>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.8, 2.2, 0.25]} />
            <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.85} />
          </mesh>

          <mesh position={[0, 0.2, 0.13]}>
            <boxGeometry args={[1.5, 1.6, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.05} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.25, 0.14]}>
            <boxGeometry args={[1.3, 1.3, 0.01]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.08} metalness={0.85} emissive="#06b6d4" emissiveIntensity={0.15} />
          </mesh>

          {[...Array(4)].map((_, ri) => (
            [...Array(3)].map((_, ci) => (
              <mesh key={`icon-${ri}-${ci}`} position={[-0.35 + ci * 0.35, 0.3 - ri * 0.35, 0.15]}>
                <boxGeometry args={[0.12, 0.12, 0.005]} />
                <meshStandardMaterial color={['#22d3ee', '#84cc16', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#ec4899'][ri * 3 + ci]} emissive={['#22d3ee', '#84cc16', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#ec4899'][ri * 3 + ci]} emissiveIntensity={0.4} />
              </mesh>
            ))
          ))}

          <mesh position={[0, 1.25, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.05} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.45, 0.06]}>
            <circleGeometry args={[0.04, 12]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.05} metalness={0.8} />
          </mesh>

          <mesh position={[-0.6, -0.4, 0.13]}>
            <boxGeometry args={[0.12, 0.12, 0.015]} />
            <meshStandardMaterial color="#ef4444" roughness={0.15} metalness={0.6} />
          </mesh>
          <mesh position={[-0.35, -0.4, 0.13]}>
            <boxGeometry args={[0.12, 0.12, 0.015]} />
            <meshStandardMaterial color="#10b981" roughness={0.15} metalness={0.6} />
          </mesh>
          <mesh position={[-0.1, -0.4, 0.13]}>
            <boxGeometry args={[0.12, 0.12, 0.015]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.15} metalness={0.6} />
          </mesh>

          <mesh position={[0, 0.2, -0.13]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.01]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.5} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <mesh key={`grill-${i}`} position={[-0.3 + i * 0.12, 0.2, -0.14]}>
              <boxGeometry args={[0.08, 0.35, 0.005]} />
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.5} />
            </mesh>
          ))}

          <mesh position={[0.5, -0.65, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.25, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.7} />
          </mesh>
          <mesh position={[-0.5, -0.65, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.25, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.7} />
          </mesh>

          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.55, 0.6, 0.15, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} metalness={0.8} />
          </mesh>
          <mesh position={[0, -1.35, 0]}>
            <cylinderGeometry args={[0.6, 0.65, 0.08, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.7} />
          </mesh>
        </group>
      </Float>

      {[...Array(10)].map((_, i) => (
        <Float key={`p-${i}`} speed={0.6 + i * 0.08} rotationIntensity={0.35} floatIntensity={0.25}>
          <mesh position={[Math.cos(i * Math.PI / 5) * 2.5, Math.sin(i * Math.PI / 5) * 2.5, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color={['#06b6d4', '#84cc16', '#a855f7', '#f59e0b', '#22d3ee'][i % 5]} emissive={['#06b6d4', '#84cc16', '#a855f7', '#f59e0b', '#22d3ee'][i % 5]} emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </AnimatedGroup>
  );
}

function SceneRenderer({ exhibit }: { exhibit: Exhibit }) {
  //根据作品的 id，决定显示哪一个 3D 场景
  const id = exhibit.id;
  if (id === 1) return <FutureCitySkyline />;
  {/*分别代表不同作品的 3D 场景*/}
  if (id === 2) return <SmartwatchDesign />;
  if (id === 3) return <MagicForestScene />;
  if (id === 4) return <AbstractGeometricArt />;
  if (id === 5) return <HumanAnatomyModel />;
  if (id === 6) return <GreekTempleScene />;
  if (id === 7) return <EVCarDesign />;
  if (id === 8) return <CyberpunkStreet />;
  if (id === 9) return <DigitalSculpture />;
  if (id === 10) return <SolarSystemModel />;
  if (id === 11) return <FutureCommunity />;
  if (id === 12) return <SmartHomeHub />;
  return <FutureCitySkyline />;
}

interface SceneContentProps {
  //SceneContent 需要从父组件那里接收一个 exhibit
  exhibit: Exhibit;
}

export function SceneContent({ exhibit }: SceneContentProps) {
  return (
    <>
      {exhibit.category !== 'Art' && (
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
        />
      )}
      {exhibit.category === 'Art' && (
        <>
          <PerspectiveCamera makeDefault position={[0, 2, 6]} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate autoRotateSpeed={0.5} />
        </>
      )}
      <SceneRenderer exhibit={exhibit} />
    </>
  );
}