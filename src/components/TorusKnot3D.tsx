import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

// 3D Metallic Object Component - Optimized
const MetallicObject = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0.75, 0, 0]} castShadow>
      <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
      <meshStandardMaterial
        color="#ff6e00"
        metalness={0.45}
        roughness={0.35}
        emissive="#ff6e00"
        emissiveIntensity={0.28}
      />
    </mesh>
  );
};

const TorusKnot3D = () => {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-[80%] z-[1] hidden lg:block pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-orange/15 via-orange/5 to-transparent dark:from-orange/25 dark:via-orange/10 rounded-full blur-2xl"
      />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#ffffff', '#e8e8e8', 0.9]} />
        <directionalLight position={[6, 8, 6]} intensity={1.6} color="#fffaf5" />
        <directionalLight position={[-4, -1, -3]} intensity={0.55} color="#ff6e00" />
        <spotLight position={[8, 10, 8]} angle={0.4} penumbra={1} intensity={3} color="#fff5eb" />
        <pointLight position={[-6, 2, 5]} intensity={0.9} color="#ff6e00" />
        <MetallicObject />
      </Canvas>
    </div>
  );
};

export default TorusKnot3D;
