import { useState, useEffect, useMemo } from 'react';
import Scene from './Scene';
import type { Exhibit } from '@/types';
import * as THREE from 'three';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface ModelViewerProps {
  exhibit: Exhibit;
}

function UploadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const normalizedScene = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const targetSize = 3;

    if (maxSize > 0) {
      const scale = targetSize / maxSize;
      model.scale.setScalar(scale);
    }

    const scaledBox = new THREE.Box3().setFromObject(model);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    const scaledMin = scaledBox.min;

    model.position.x -= scaledCenter.x;
    model.position.z -= scaledCenter.z;
    model.position.y -= scaledMin.y;

    return model;
  }, [scene]);

  return <primitive object={normalizedScene} />;
}

export default function ModelViewer({ exhibit }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      style={{
        background: 'rgba(210, 230, 242, 1)',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />

            <span className="text-slate-300 text-lg">
              正在加载 {exhibit.title} ...
              <br />
              <span className="text-xs text-slate-500">Loading</span>
            </span>
          </div>
        </div>
      )}

      <Scene>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          target={[0, 1.2, 0]}
        />

        {exhibit.model_url && (
          <UploadedModel url={exhibit.model_url} />
        )}
      </Scene>
    </div>
  );
}