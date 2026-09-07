import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function HeroDecorModel() {
  const groupRef = useRef<THREE.Group>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const { scene } = useGLTF('/models/hero-decor.glb');

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    clone.position.sub(center);

    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current || dragRef.current.active) return;

    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, -1]}
      scale={[0.18, 0.18, 0.18]}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragRef.current.active = true;
        dragRef.current.x = e.clientX;
        dragRef.current.y = e.clientY;
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active || !groupRef.current) return;

        const dx = e.clientX - dragRef.current.x;
        const dy = e.clientY - dragRef.current.y;

        groupRef.current.rotation.y += dx * 0.01;
        groupRef.current.rotation.x = THREE.MathUtils.clamp(
          groupRef.current.rotation.x + dy * 0.01,
          -0.6,
          0.6,
        );

        dragRef.current.x = e.clientX;
        dragRef.current.y = e.clientY;
      }}
      onPointerUp={() => {
        dragRef.current.active = false;
      }}
      onPointerOut={() => {
        dragRef.current.active = false;
      }}
      onPointerCancel={() => {
        dragRef.current.active = false;
      }}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload('/models/hero-decor.glb');