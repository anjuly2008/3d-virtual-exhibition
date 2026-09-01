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

    // 控制模型整体大小
    const targetSize = 1.4;

    if (maxSize > 0) {
      const scale = targetSize / maxSize;
      cloned.scale.setScalar(scale);
    }

    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const center = scaledBox.getCenter(new THREE.Vector3());

    // 模型整体居中
    cloned.position.x -= center.x;
    cloned.position.y -= center.y;
    cloned.position.z -= center.z;

    return cloned;
  }, [scene]);

  useFrame((_, delta) => {
    model.rotation.y += delta * 0.5;
  });

  return <primitive object={model} />;
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
    <div className="absolute inset-0 z-10 overflow-hidden">
      {/* 3D预览背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

      <Canvas
        camera={{
          position: [0, 1.1, 5],
          fov: 40,
        }}
        dpr={[1, 1.5]}
      >
        {/* 环境光 */}
        <ambientLight intensity={1.2} />

        {/* 主光源 */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={2}
        />

        {/* 补光 */}
        <directionalLight
          position={[-4, 2, -4]}
          intensity={0.8}
        />

        {/* 地面网格 */}
        <gridHelper
          args={[5, 5, '#334155', '#1e293b']}
        />

        {/* 真实GLB模型 */}
        <PreviewModel modelUrl={modelUrl} />

        {/* 用户不能缩放和平移，只允许观看 */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>

      {/* 3D Preview 标签 */}
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-xs text-white">
        3D Preview
      </div>
    </div>
  );
}