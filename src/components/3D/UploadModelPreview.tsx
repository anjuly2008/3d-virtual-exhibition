import {useState, useEffect } from 'react';
import {OrbitControls, useGLTF } from '@react-three/drei';
import Scene from './Scene';

function SceneContent({ modelFile }: { modelFile: File | null }) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!modelFile) {
      setModelUrl(null);
      return;
    }

    const url = URL.createObjectURL(modelFile);
    setModelUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [modelFile]);

  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
      />

      {modelUrl && <UploadedModel url={modelUrl} />}
    </>
  );
}

interface UploadModelPreviewProps {
  modelFile: File | null;
}

export default function UploadModelPreview({
  modelFile,
}: UploadModelPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-300">
              正在加载预览... / Loading preview...
            </span>
          </div>
        </div>
      )}

      <Scene>
        <SceneContent modelFile={modelFile} />
      </Scene>
    </div>
  );
}

function UploadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} />;
}