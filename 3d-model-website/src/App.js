import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model3D from './components/Model3D';
import Sparkles from './components/Sparkles';
import AnimatedText from './components/AnimatedText';
import MonkModeText from './components/MonkModeText';
import RevealingSoon from './components/RevealingSoon';
import './App.css';

function App() {
  return (
    <div className="App">
      <AnimatedText />
      <MonkModeText />
      <Canvas camera={{ position: [0, -1.2, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Sparkles />
          <Model3D />
        </Suspense>
        <OrbitControls enableZoom={true} enableRotate={true} />
      </Canvas>
      <RevealingSoon />
    </div>
  );
}

export default App;