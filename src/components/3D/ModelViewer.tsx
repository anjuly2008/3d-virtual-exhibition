import { useState, useEffect, useMemo } from 'react';
{/*useState保存状态  useEffect组件加载后执行一些代码*/}
//import { SceneContent } from './ModelScene';
import Scene from './Scene';
import type { Exhibit } from '@/types';
{/*作品类型*/}
import * as THREE from 'three';
import { OrbitControls,useGLTF} from '@react-three/drei';

interface ModelViewerProps {
  exhibit: Exhibit;
}{/*ModelViewer 这个组件要求父组件必须给我一个 exhibit*/}


function UploadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const normalizedScene = useMemo(() => {
    const model = scene.clone(true);

    // 1. 计算模型原始尺寸
    const box = new THREE.Box3().setFromObject(model);

    const size = box.getSize(new THREE.Vector3());

    // 2. 找到模型最长的一条边
    const maxSize = Math.max(size.x, size.y, size.z);

    // 3. 规定模型最大尺寸为 3
    const targetSize = 3;

    // 防止出现异常尺寸
    if (maxSize > 0) {
      const scale = targetSize / maxSize;
      model.scale.setScalar(scale);
    }

    // 4. 缩放以后重新计算模型边界
    const scaledBox = new THREE.Box3().setFromObject(model);

    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    const scaledMin = scaledBox.min;

    // 5. X、Z方向居中
    model.position.x -= scaledCenter.x;
    model.position.z -= scaledCenter.z;

    // 6. Y方向让模型底部贴在水平面 y=0
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
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />

            <span className="text-slate-300 text-lg">
              正在加载 {exhibit.title} ...
              <br />
              <span className="text-xs text-slate-500">
                Loading
              </span>
            </span>
          </div>
        </div>
      )}

    <Scene>
  <OrbitControls
    enableZoom={true}
    //允许用户缩放模型视角
    enablePan={true}
    //允许平移视角
    enableRotate={true}
    //允许旋转视角
    minDistance={2}
    //相机离模型最近不能小于 2
    maxDistance={15}
    //相机离模型最远不能超过 15
    target={[0, 1.2, 0]}
    //OrbitControls 旋转和观察时，围绕哪个点进行
  />

  {exhibit.model_url && (
    <UploadedModel url={exhibit.model_url} />
  )}
   </Scene>
    </div>
  );
}
