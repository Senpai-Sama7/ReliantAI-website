import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceZones } from '@/data/experienceZones';
import { emitZoneChange } from '@/lib/experienceBus';
import { telegraphZone } from '@/lib/telemetry';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceZoneTrackerProps {
  enabled?: boolean;
}

/** Tracks scroll sector and drives ZoneHud + atmosphere mood. No layout/warp side effects. */
export default function ExperienceZoneTracker({ enabled = true }: ExperienceZoneTrackerProps) {
  const activeRef = useRef('');
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const timer = window.setTimeout(() => {
      experienceZones.forEach((zone) => {
        const el = document.getElementById(zone.id);
        if (!el) return;

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => activate(zone.id),
          onEnterBack: () => activate(zone.id),
        });
        triggersRef.current.push(trigger);
      });

      activate('hero');
      ScrollTrigger.refresh();
    }, 200);

    function activate(id: string) {
      if (activeRef.current === id) return;
      const zone = experienceZones.find((z) => z.id === id);
      if (!zone) return;

      const prev = activeRef.current;
      activeRef.current = id;
      document.documentElement.setAttribute('data-experience-zone', id);
      emitZoneChange(zone);
      telegraphZone(prev || 'none', `${zone.sector} ${zone.label}`, 'scroll-trigger');

      const announcer = document.getElementById('zone-announcer');
      if (announcer) {
        announcer.textContent = `Sector ${zone.sector} ${zone.label}. ${zone.tagline}`;
      }
    }

    return () => {
      window.clearTimeout(timer);
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      document.documentElement.removeAttribute('data-experience-zone');
    };
  }, [enabled]);

  return null;
}
