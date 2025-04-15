import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#000000"
          transparent
          opacity={1.0}
          shininess={150}
        />
      </Sphere>
      <lineSegments ref={gridRef}>
        <sphereGeometry args={[1.005, 38, 38]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </lineSegments>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
    </>
  );
}