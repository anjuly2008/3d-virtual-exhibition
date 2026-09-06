import { Canvas } from '@react-three/fiber';

interface SceneProps {
  children: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 2.2, 8],
        fov: 45,
      }}
      style={{
        background: `
          radial-gradient(circle at 50% 35%, rgba(220,245,255,0.18), transparent 30%),
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.10), transparent 12%),
          radial-gradient(circle at 80% 25%, rgba(190,230,255,0.10), transparent 12%),
          linear-gradient(180deg, rgba(190,225,245,0.22) 0%, rgba(140,190,220,0.14) 100%)
        `,
      }}
    >
      <ambientLight intensity={0.8} />

      <directionalLight
        position={[8, 10, 6]}
        intensity={1.4}
        castShadow
      />

      <directionalLight
        position={[-8, 4, 2]}
        intensity={0.7}
      />

      <pointLight
        position={[0, 5, 4]}
        intensity={1}
        color="#bde7ff"
      />

      <pointLight
        position={[5, -1, -4]}
        intensity={0.4}
        color="#c8b6ff"
      />

      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.14, 64]} />
        <meshPhysicalMaterial
          color="#c8e9fa"
          transparent
          opacity={0.28}
          roughness={0.18}
          metalness={0.05}
          transmission={0.25}
          thickness={0.3}
        />
      </mesh>

      <mesh position={[0, -1.46, 0]}>
        <cylinderGeometry args={[1.62, 1.62, 0.025, 64]} />
        <meshBasicMaterial
          color="#eefaff"
          transparent
          opacity={0.16}
        />
      </mesh>

      <group>
        <mesh position={[-2.2, 1.4, -1]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh position={[2.1, 1.8, -1.2]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
          />
        </mesh>

        <mesh position={[-1.5, -0.2, -1]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.65}
          />
        </mesh>

        <mesh position={[1.7, -0.4, -1]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {children}
    </Canvas>
  );
}