import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import * as THREE from 'three';

function Model3D() {
  const meshRef = useRef();
  const glowRef = useRef();
  const [model, setModel] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    mtlLoader.load(
      '/monk.mtl',
      (loadedMaterials) => {
        loadedMaterials.preload();
        objLoader.setMaterials(loadedMaterials);
        objLoader.load(
          '/monk.obj',
          (loadedModel) => {
            const box = new THREE.Box3().setFromObject(loadedModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            loadedModel.position.sub(center);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            loadedModel.scale.setScalar(scale);
            
            setModel(loadedModel);
          }
        );
      },
      undefined,
      (error) => {
        objLoader.load(
          '/monk.obj',
          (loadedModel) => {
            loadedModel.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: '#8B4513' });
              }
            });
            
            const box = new THREE.Box3().setFromObject(loadedModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            loadedModel.position.sub(center);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            loadedModel.scale.setScalar(scale);
            
            setModel(loadedModel);
          }
        );
      }
    );
  }, []);

  const handlePointerMove = (event) => {
    if (!isHovered) {
      const x = (event.point.x / 3) * 0.3;
      const y = (event.point.y / 3) * 0.3;
      setMousePos({ x, y });
    }
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => setIsHovered(false);

  useFrame((state) => {
    if (meshRef.current && !isHovered) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mousePos.y, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mousePos.x, 0.1);
    }
    
    // Smooth glow transition
    const targetOpacity = isHovered ? 0.3 : 0;
    setGlowOpacity(prev => THREE.MathUtils.lerp(prev, targetOpacity, 0.05));
    
    if (glowRef.current) {
      glowRef.current.material.opacity = glowOpacity;
      
      // Apply gradient texture if not already applied
      if (!glowRef.current.material.map) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        
        const glowTexture = new THREE.CanvasTexture(canvas);
        glowRef.current.material.map = glowTexture;
        glowRef.current.material.needsUpdate = true;
      }
    }
  });

  if (!model) return null;

  return (
    <group>
      <primitive 
        ref={meshRef} 
        object={model} 
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial 
          transparent 
          opacity={glowOpacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default Model3D;