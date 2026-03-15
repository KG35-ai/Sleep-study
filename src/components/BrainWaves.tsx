import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BrainWaves = () => {
  const count = 50;
  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < count; i++) {
      const points = [];
      const radius = 4 + Math.random() * 2;
      const yOffset = (Math.random() - 0.5) * 10;
      for (let j = 0; j <= 100; j++) {
        const angle = (j / 100) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius
        ));
      }
      l.push({
        points: new THREE.CatmullRomCurve3(points).getPoints(100),
        speed: 0.2 + Math.random() * 0.5,
        amplitude: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    return l;
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <WaveLine key={i} line={line} />
      ))}
    </group>
  );
};

const WaveLine = ({ line }: { line: any }) => {
  const lineRef = useRef<THREE.Line>(null);
  const [hovered, setHovered] = useState(false);
  const originalPoints = useMemo(() => line.points.map((p: THREE.Vector3) => p.clone()), [line.points]);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate wave points
      for (let i = 0; i < originalPoints.length; i++) {
        const p = originalPoints[i];
        const wave = Math.sin(time * line.speed + i * 0.1 + line.phase) * line.amplitude;
        positions[i * 3] = p.x + wave;
        positions[i * 3 + 1] = p.y + wave * 2;
        positions[i * 3 + 2] = p.z + wave;
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;

      // Smoothly transition scale and opacity
      const targetScale = hovered ? 1.1 : 1.0;
      const targetOpacity = hovered ? 0.6 : 0.15;
      
      lineRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      if (lineRef.current.material instanceof THREE.LineBasicMaterial) {
        lineRef.current.material.opacity = THREE.MathUtils.lerp(
          lineRef.current.material.opacity,
          targetOpacity,
          0.1
        );
      }
    }
  });

  return (
    <line 
      ref={lineRef as any}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={line.points.length}
          array={new Float32Array(line.points.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
};
