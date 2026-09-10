import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function HeroDecorModel() {
  const groupRef = useRef<THREE.Group>(null);
  const dragRef = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  const baseUrl = import.meta.env.BASE_URL;

  const { scene } = useGLTF(`${baseUrl}models/hero-decor.glb`);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    clone.position.sub(center);

    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!dragRef.current.active) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const handlePointerDown = (
    e: THREE.Event & { clientX?: number; clientY?: number }
  ) => {
    const event = e as unknown as PointerEvent;

    dragRef.current.active = true;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;

    const target = e.target as unknown as {
      setPointerCapture?: (pointerId: number) => void;
    };

    if (target.setPointerCapture && 'pointerId' in event) {
      target.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (
    e: THREE.Event & { clientX?: number; clientY?: number }
  ) => {
    if (!dragRef.current.active || !groupRef.current) return;

    const event = e as unknown as PointerEvent;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    groupRef.current.rotation.y += dx * 0.01;
    groupRef.current.rotation.x += dy * 0.005;

    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
  };

  const handlePointerUp = (
    e: THREE.Event & { clientX?: number; clientY?: number }
  ) => {
    const event = e as unknown as PointerEvent;

    dragRef.current.active = false;

    const target = e.target as unknown as {
      releasePointerCapture?: (pointerId: number) => void;
    };

    if (target.releasePointerCapture && 'pointerId' in event) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, -1]}
      scale={[0.18, 0.18, 0.18]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/hero-decor.glb`);