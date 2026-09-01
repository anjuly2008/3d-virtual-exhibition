import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
//import { MeshDistortMaterial, Float, OrbitControls } from '@react-three/drei';
import { MeshDistortMaterial, Float, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
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
//function SceneContent(){
 //function SceneContent({ modelFile }: { modelFile: File | null }) {
  //const meshRef = useRef<THREE.Mesh>(null);

  //useFrame(({ clock }) => {
  // if (meshRef.current) {
  //    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
  // }
  //});

  //return (
    {/*<>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
      />*/}
      {/*<Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 1, 0]}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <mesh position={[-2, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[2, 0.3, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ec4899" roughness={0.3} metalness={0.6} />
      </mesh>

      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} />
      </mesh>*/}
     {/*</>*/} 
    
//  );
//}

//export default function UploadModelPreview() {
//const [isLoading, setIsLoading] = useState(true);
  interface UploadModelPreviewProps {
  modelFile: File | null;
}

export default function UploadModelPreview({ modelFile }: UploadModelPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  //UploadModelPreview 要接收一个叫 modelFile 的参数，而且它必须是 File 或者 null。

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
            <span className="text-slate-300">正在加载预览... / Loading preview...</span>
          </div>
        </div>
      )}
      {/*<Scene>
        <SceneContent />
      </Scene>*/}
      <Scene>
       <SceneContent modelFile={modelFile} />
      </Scene>
    </div>
  );
}
function UploadedModel({ url }: { url: string }) {
  //  ({ url }: { url: string })   UploadedModel 需要一个叫 url 的字符串
  const { scene } = useGLTF(url);
  //用 React Three Fiber / Drei 提供的 useGLTF 加载这个 .glb

  return <primitive object={scene} />;
  //把这个 Three.js 对象直接放进当前 3D 场景
}