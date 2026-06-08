import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
}

interface LivingFieldProps {
  density?: number;
  moodGlow?: string;
}

export default function LivingField({ density = 1, moodGlow = 'rgba(255,110,0,0.6)' }: LivingFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollVelRef = useRef(0);
  const lastScrollRef = useRef(0);
  const densityRef = useRef(density);
  const glowRef = useRef(moodGlow);

  useEffect(() => {
    densityRef.current = density;
  }, [density]);

  useEffect(() => {
    glowRef.current = moodGlow;
  }, [moodGlow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((w * h) / 14000) * densityRef.current;
      particles = Array.from({ length: Math.min(220, Math.max(60, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 0.6 + Math.random() * 1.8,
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };

    const onScroll = () => {
      const y = window.scrollY;
      scrollVelRef.current = y - lastScrollRef.current;
      lastScrollRef.current = y;
    };

    const draw = (time: number) => {
      const breath = 0.5 + Math.sin(time * 0.0008) * 0.5;
      const wind = scrollVelRef.current * 0.08;
      scrollVelRef.current *= 0.92;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      for (const p of particles) {
        p.x += p.vx + wind * (0.4 + p.z);
        p.y += p.vy + Math.sin(time * 0.001 + p.z * 10) * 0.12;

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 180) {
          p.x -= (dx / dist) * 0.35 * (1 - dist / 180);
          p.y -= (dy / dist) * 0.35 * (1 - dist / 180);
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const alpha = (0.15 + p.z * 0.55) * (0.7 + breath * 0.3);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 110, 0, ${alpha})`;
        ctx.arc(p.x, p.y, p.size * (0.6 + p.z), 0, Math.PI * 2);
        ctx.fill();
      }

      // Neural mesh lines — metaverse fabric
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            const lineAlpha = (1 - d / 90) * 0.12 * breath;
            ctx.strokeStyle = `rgba(255, 110, 0, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="living-field absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
