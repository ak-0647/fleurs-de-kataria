import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const ParticleSwarm = () => {
  const ref = useRef();
  
  const sphere = useMemo(() => {
    const temp = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        const phi = Math.acos(-1 + (2 * i) / 5000);
        const theta = Math.sqrt(5000 * Math.PI) * phi;
        const r = 3 + Math.random() * 4;
        temp[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        temp[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        temp[i * 3 + 2] = r * Math.cos(phi);
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 6;
      ref.current.rotation.y += delta / 8;
    }
  });

  const { theme } = useTheme();
  const color = theme === 'dark' ? '#E60045' : '#FF85A1';

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={0.025} opacity={0.6} sizeAttenuation={true} depthWrite={false} blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending} />
    </Points>
  );
};

const AbstractRose = () => {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (ref.current) {
        // Spins continuously while fully bloomed
        ref.current.rotation.y += delta * 0.4;
    }
  });

  const petals = [];
  const layers = 8; // More layers for a dense rose look
  
  const { theme } = useTheme();
  const color = theme === 'dark' ? '#E60045' : '#FF85A1';
  const emissive = theme === 'dark' ? '#8A0029' : '#FFB3C6';

  for (let layer = 0; layer < layers; layer++) {
    const petalsInLayer = 3 + layer * 3;
    
    // Force the outer layers to tilt heavily outwards so it looks completely EXPOSED and BLOOMED
    const tilt = (layer / layers) * (Math.PI * 0.4);
    const yOffset = -0.5 + layer * 0.15;
    
    for (let i = 0; i < petalsInLayer; i++) {
      // Add a twist offset so petals interlock beautifully like a real rose
      const angle = (i / petalsInLayer) * Math.PI * 2 + (layer * 0.5);
      
      petals.push(
        <group key={`layer-${layer}-petal-${i}`} rotation={[0, angle, 0]} position={[0, yOffset, 0]}>
          <group rotation={[tilt, 0, 0]}>
            <mesh position={[0, 0.8 + layer * 0.15, 0]} scale={[0.6 + layer * 0.1, 1.4 + layer * 0.1, 0.03]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial 
                color={color} 
                emissive={emissive} 
                emissiveIntensity={theme === 'dark' ? 0.4 : 0.2} 
                roughness={0.5} 
                metalness={0.2} 
                transparent 
                opacity={0.95 - (layer * 0.02)}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      );
    }
  }

  return (
    <group ref={ref} position={[0, 0, -3]} scale={1.1} rotation={[Math.PI / 2.2, 0, 0]}>
      {petals}
    </group>
  );
};

export default function HeroScene() {
  const { theme } = useTheme();
  const lightColor = theme === 'dark' ? '#E60045' : '#FFB3C6';
  const secondaryLightColor = theme === 'dark' ? '#9C1355' : '#A0C4FF';

  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={theme === 'dark' ? 1.5 : 2.5} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} color={lightColor} />
      <directionalLight position={[-10, -10, -10]} intensity={1} color={secondaryLightColor} />
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <AbstractRose />
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <ParticleSwarm />
      </Float>
    </Canvas>
  );
}
