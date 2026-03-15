import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text, Html } from '@react-three/drei';
import { brainRegions, BrainRegion } from '../data/neuroscience';

interface BrainModelProps {
  onSelectRegion: (region: BrainRegion) => void;
  selectedRegionId?: string;
}

export const BrainModel: React.FC<BrainModelProps> = ({ onSelectRegion, selectedRegionId }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Brain Mass - Stylized with particles */}
      <BrainParticles />
      
      {/* Respiratory Cycle Visualization */}
      <BreathingCycle />

      {/* Interactive Regions */}
      {brainRegions.map((region) => (
        <RegionNode
          key={region.id}
          region={region}
          isSelected={selectedRegionId === region.id}
          onClick={() => onSelectRegion(region)}
        />
      ))}
    </group>
  );
};

const BreathingCycle = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Simulate a breathing rhythm (approx 12-16 breaths per minute)
      const time = state.clock.getElapsedTime();
      const breath = Math.sin(time * 0.8) * 0.5 + 0.5; // 0 to 1
      const s = 2.5 + breath * 0.3;
      meshRef.current.scale.set(s, s, s);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + breath * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.1} wireframe />
    </mesh>
  );
};

const BrainParticles = () => {
  const count = 2000;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Ellipsoid shape for brain
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.2;
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.5;
      p[i * 3 + 2] = r * Math.cos(phi) * 1.8;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      pointsRef.current.scale.set(s, s, s);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const RegionNode = ({ region, isSelected, onClick }: { region: BrainRegion, isSelected: boolean, onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        position={region.position}
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={isSelected ? 2 : 0.5}
          transparent
          opacity={0.8}
        />
        
        <Html distanceFactor={10}>
          <div className={`pointer-events-none select-none transition-all duration-300 ${isSelected ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
            <div className="px-2 py-1 rounded bg-black/80 border border-white/20 text-[10px] font-mono whitespace-nowrap">
              {region.name}
            </div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};
