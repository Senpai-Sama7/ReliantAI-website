import { useEffect, useState } from 'react';
import LivingField from './LivingField';
import { experienceZones, type ExperienceZone } from '@/data/experienceZones';
import { onZoneChange } from '@/lib/experienceBus';
import { prefersReducedMotion } from '@/lib/motion';

export default function ImmersiveAtmosphere() {
  const [zone, setZone] = useState<ExperienceZone>(experienceZones[0]);

  useEffect(() => onZoneChange(setZone), []);

  if (prefersReducedMotion()) {
    return (
      <div
        className="immersive-atmosphere fixed inset-0 -z-10 pointer-events-none bg-[#f7f7f7] dark:bg-[#050505]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="immersive-atmosphere fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      data-mood={zone.mood}
      aria-hidden="true"
    >
      <div className="atmosphere-base absolute inset-0 transition-colors duration-1000" />
      <div
        className="atmosphere-glow absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 35%, ${zone.glow}, transparent 68%)`,
          opacity: 0.85,
        }}
      />
      <div className="atmosphere-horizon absolute inset-x-0 bottom-0 h-[45%] opacity-60" />
      <div className="atmosphere-scan absolute inset-0 opacity-[0.04]" />
      <div className="atmosphere-vignette absolute inset-0" />
      <LivingField density={zone.particleDensity} moodGlow={zone.glow} />
    </div>
  );
}
