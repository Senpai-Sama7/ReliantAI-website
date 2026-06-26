import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceZones } from '@/data/experienceZones';
import { emitZoneChange } from '@/lib/experienceBus';
import { telegraphZone } from '@/lib/telemetry';
import { onScrollLayoutReady } from '@/lib/scrollLayout';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceZoneTrackerProps {
  enabled?: boolean;
}

function findZoneAtViewport(): string | null {
  const marker = window.innerHeight * 0.5;
  for (const zone of experienceZones) {
    const el = document.getElementById(zone.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) {
      return zone.id;
    }
  }
  return experienceZones[0]?.id ?? null;
}

/** Tracks scroll sector and drives ZoneHud + atmosphere mood. No layout/warp side effects. */
export default function ExperienceZoneTracker({ enabled = true }: ExperienceZoneTrackerProps) {
  const activeRef = useRef('');
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!enabled) return;

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

    function setup() {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];

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

      const initial = findZoneAtViewport();
      if (initial) activate(initial);
      ScrollTrigger.refresh();
    }

    const unsub = onScrollLayoutReady(setup);

    return () => {
      unsub();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      document.documentElement.removeAttribute('data-experience-zone');
      activeRef.current = '';
    };
  }, [enabled]);

  return null;
}
