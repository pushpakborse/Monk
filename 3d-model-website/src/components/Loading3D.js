import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Loading3D() {
  const meshRef = useRef();
  const ringRefs = useRef([]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
    
    ringRefs.current.forEach((ring, index) => {
      if (ring) {
        ring.rotation.x += 0.01 * (index + 1);
        ring.rotation.z += 0.005 * (index + 1);
      }
    });
  });

  return (
    <group ref={meshRef}>
      {/* Central spinning cube */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          emissive="#4a90e2" 
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Orbiting rings */}
      {[1, 1.5, 2].map((radius, index) => (
        <mesh
          key={index}
          ref={(el) => (ringRefs.current[index] = el)}
          position={[0, 0, 0]}
        >
          <torusGeometry args={[radius, 0.05, 8, 32]} />
          <meshStandardMaterial 
            color={['#7b68ee', '#4ecdc4', '#ff6b6b'][index]}
            emissive={['#7b68ee', '#4ecdc4', '#ff6b6b'][index]}
            emissiveIntensity={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

export default Loading3D;