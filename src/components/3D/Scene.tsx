import { Canvas } from '@react-three/fiber';
{/*React Three Fiber 提供的 React 组件*/}
{/*让你用 React 的写法来使用 Three.js*/}

interface SceneProps {
  children: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 8], fov: 45 }}
      style={{
        background:
          'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
      }}
    >
      <ambientLight intensity={0.4} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      <directionalLight
        position={[-10, -5, -5]}
        intensity={0.5}
      />

      <pointLight
        position={[0, 5, 5]}
        intensity={0.5}
        color="#06b6d4"
      />

      <pointLight
        position={[5, -2, -5]}
        intensity={0.3}
        color="#8b5cf6"
      />

      <gridHelper
        args={[10, 10, '#475569', '#334155']}
      />

      {children}
    </Canvas>
  );
}