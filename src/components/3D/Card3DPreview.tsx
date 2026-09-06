import { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Card3DPreviewProps {
  modelUrl: string;
  isHovered: boolean;
}

function PreviewModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const targetSize = 1.4;
    if (maxSize > 0) {
      const scale = targetSize / maxSize;
      cloned.scale.setScalar(scale);
    }
    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const center = scaledBox.getCenter(new THREE.Vector3());
    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;
    return cloned;
  }, [scene]);
  useFrame((_, delta) => {
    model.rotation.y += delta * 0.35;
  });
  return <primitive object={model} />;
}

function DisplayStand() {
  return (
    <mesh position={[0, -0.78, 0]}>
      <cylinderGeometry args={[0.85, 0.85, 0.06, 64]} />
      <meshPhysicalMaterial
        color="#c9e7f7"
        transparent
        opacity={0.22}
        roughness={0.2}
        metalness={0.1}
        transmission={0.2}
      />
    </mesh>
  );
}

export default function Card3DPreview({
  modelUrl,
  isHovered,
}: Card3DPreviewProps) {
  console.log('当前Card的模型地址:', modelUrl);

  if (!isHovered || !modelUrl) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 42%, rgba(220,245,255,0.20) 0%, transparent 28%),
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.12) 0%, transparent 8%),
            radial-gradient(circle at 82% 24%, rgba(190,230,255,0.12) 0%, transparent 7%),
            radial-gradient(circle at 30% 78%, rgba(255,255,255,0.10) 0%, transparent 6%),
            rgba(180,220,245,0.16)
          `,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.38)',
          boxShadow: `
            inset 0 0 30px rgba(255,255,255,0.08),
            inset 0 0 60px rgba(170,220,255,0.08)
          `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <span
          className="absolute top-[18%] left-[18%] w-1 h-1 rounded-full bg-white opacity-80"
          style={{
            boxShadow: '0 0 8px rgba(220,245,255,0.9)',
          }}
        />

        <span
          className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full bg-white opacity-70"
          style={{
            boxShadow: '0 0 8px rgba(220,245,255,0.9)',
          }}
        />

        <span
          className="absolute bottom-[28%] left-[30%] w-0.5 h-0.5 rounded-full bg-white opacity-70"
          style={{
            boxShadow: '0 0 6px rgba(220,245,255,0.9)',
          }}
        />

        <span
          className="absolute bottom-[20%] right-[26%] w-1 h-1 rounded-full bg-white opacity-60"
          style={{
            boxShadow: '0 0 7px rgba(220,245,255,0.9)',
          }}
        />
      </div>

      <Canvas
        camera={{
          position: [0, 1.1, 5],
          fov: 40,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.4} />

        <directionalLight
          position={[4, 6, 4]}
          intensity={1.8}
        />

        <directionalLight
          position={[-4, 3, 2]}
          intensity={0.8}
        />

        <pointLight
          position={[0, 4, 2]}
          intensity={1.2}
        />

        <DisplayStand />
        <PreviewModel modelUrl={modelUrl} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>

      <div
        className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs text-white bg-[rgba(185,220,245,0.20)] backdrop-blur-md border border-white/35"
        style={{
          boxShadow: `
            inset 0 0 12px rgba(255,255,255,0.06),
            0 0 12px rgba(180,220,255,0.12)
          `,
        }}
      >
        3D Preview
      </div>
    </div>
  );
}