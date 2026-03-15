import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { BrainModel } from './components/BrainModel';
import { BrainWaves } from './components/BrainWaves';
import { UIOverlay } from './components/UIOverlay';
import { BrainRegion } from './data/neuroscience';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  return (
    <div className="relative w-full h-screen bg-[#050505]">
      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <BrainModel 
              onSelectRegion={setSelectedRegion} 
              selectedRegionId={selectedRegion?.id} 
            />
            <BrainWaves />
          </group>
          
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          autoRotate={!selectedRegion}
          autoRotateSpeed={0.5}
          makeDefault
        />
      </Canvas>

      {/* UI Layer */}
      <UIOverlay 
        selectedRegion={selectedRegion} 
        onCloseRegion={() => setSelectedRegion(null)} 
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.05),transparent_70%)]" />
      </div>
    </div>
  );
}
