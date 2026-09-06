import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function HeroDecorModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/1.glb');

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    clone.position.sub(center);

    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, -1]}
      scale={[0.18, 0.18, 0.18]}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload('/models/1.glb');