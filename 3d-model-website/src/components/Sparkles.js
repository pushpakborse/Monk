import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Sparkles() {
  const waveRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const waveCount = 100;

  const waves = useMemo(() => {
    const temp = [];
    for (let i = 0; i < waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2;
      const delay = Math.random() * 3;
      const speed = 0.02 + Math.random() * 0.03;
      temp.push({ angle, delay, speed, distance: 0, life: 0 });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    waves.forEach((wave, i) => {
      wave.life += 0.016;
      
      if (wave.life > wave.delay) {
        wave.distance += wave.speed;
        
        const x = Math.cos(wave.angle) * wave.distance;
        const y = Math.sin(wave.angle) * wave.distance;
        const z = -2.5 + Math.sin(wave.distance * 2) * 0.3;
        
        dummy.position.set(x, y, z);
        
        const fadeOut = Math.max(0, 1 - wave.distance / 6);
        const pulse = Math.sin(time * 3 + i * 0.5) * 0.3 + 0.7;
        const hoverBoost = isHovered ? 2 : 1;
        
        const scale = fadeOut * pulse * 0.05 * hoverBoost;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        
        waveRef.current.setMatrixAt(i, dummy.matrix);
        
        if (wave.distance > 6) {
          wave.distance = 0;
          wave.life = 0;
          wave.delay = Math.random() * 2;
        }
      } else {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        waveRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    waveRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={waveRef} args={[null, null, waveCount]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial 
        color={"#FFD700"} 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default Sparkles;