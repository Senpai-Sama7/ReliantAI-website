import { useEffect, useState } from 'react';
import { experienceZones, type ExperienceZone } from '@/data/experienceZones';
import { onZoneChange } from '@/lib/experienceBus';
import { prefersReducedMotion } from '@/lib/motion';

export default function ZoneHud() {
  const [zone, setZone] = useState<ExperienceZone>(experienceZones[0]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    return onZoneChange((next) => {
      setZone(next);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 600);
    });
  }, []);

  if (prefersReducedMotion()) return null;

  const progress = ((experienceZones.findIndex((z) => z.id === zone.id) + 1) / experienceZones.length) * 100;

  return (
    <div className="zone-hud hidden lg:block fixed top-24 right-4 lg:right-8 z-[90] pointer-events-none select-none" aria-hidden="true">
      <div
        className={`glass-dark rounded-lg px-4 py-3 min-w-[148px] border border-white/10 transition-all duration-500 ${
          pulse ? 'scale-[1.03] border-orange/40 shadow-lg shadow-orange/10' : ''
        }`}
      >
        <p className="font-opensans text-[9px] uppercase tracking-[0.45em] text-white/60 mb-1">
          Now viewing
        </p>
        <p className="font-teko text-2xl text-white leading-none">
          {zone.sector}
          <span className="text-orange ml-2">{zone.label}</span>
        </p>
        <p className="font-opensans text-[10px] text-white/60 mt-1 tracking-wide">{zone.tagline}</p>
        <div className="mt-3 h-px bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-orange transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-2 mt-4 items-end">
        {experienceZones.map((z) => (
          <div
            key={z.id}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              z.id === zone.id ? 'w-8 bg-orange' : 'w-3 bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
