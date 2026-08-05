import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { useTheme } from '@/hooks/useTheme';
import { loadVendorThree } from '@/lib/load-three';

const MetallicObject = ({ isDark }: { isDark: boolean }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[1.35, 0, 0]}>
      <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
      <meshStandardMaterial
        color="#ff6e00"
        metalness={0.45}
        roughness={0.35}
        emissive="#ff6e00"
        emissiveIntensity={isDark ? 0.22 : 0.3}
      />
    </mesh>
  );
};

const SceneLights = ({ isDark }: { isDark: boolean }) => {
  const sky = isDark ? '#f5f5f5' : '#ffffff';
  const ground = isDark ? '#141414' : '#e8e8e8';

  return (
    <>
      <ambientLight intensity={isDark ? 0.55 : 0.7} />
      <hemisphereLight args={[sky, ground, 0.9]} />
      <directionalLight position={[6, 8, 6]} intensity={1.6} color="#fffaf5" />
      <directionalLight position={[-4, -1, -3]} intensity={0.55} color="#ff6e00" />
      <spotLight position={[8, 10, 8]} angle={0.4} penumbra={1} intensity={3} color="#fff5eb" />
      <pointLight position={[-6, 2, 5]} intensity={0.9} color="#ff6e00" />
      <MetallicObject isDark={isDark} />
    </>
  );
};

const TorusKnot3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  // start hidden to avoid mounting heavy canvas on first paint
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setPrefersReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    return () => media.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(node);

    // Pre-request the vendor-three chunk when the container is near the viewport
    const preloader = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // fire-and-forget the vendor chunk loader; loader is idempotent
          loadVendorThree().catch(() => {});
          preloader.disconnect();
        }
      });
    }, { rootMargin: '400px' });

    preloader.observe(node);

    return () => {
      observer.disconnect();
      preloader.disconnect();
    };
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute right-[-2%] top-1/2 -translate-y-1/2 w-[52%] h-[78%] z-[1] hidden lg:block pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-orange/15 via-orange/5 to-transparent dark:from-orange/25 dark:via-orange/10 rounded-full blur-2xl" />
      {isVisible && (
        <Canvas
          camera={{ position: [0.35, 0, 7], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
          frameloop="always"
          style={{ background: 'transparent' }}
        >
          <SceneLights isDark={isDark} />
        </Canvas>
      )}
    </div>
  );
};

export default TorusKnot3D;
