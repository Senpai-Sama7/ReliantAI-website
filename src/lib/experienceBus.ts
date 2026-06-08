import type { ExperienceZone } from '@/data/experienceZones';

export const EXPERIENCE_ZONE_EVENT = 'experience:zone';

export function emitZoneChange(zone: ExperienceZone): void {
  window.dispatchEvent(new CustomEvent<ExperienceZone>(EXPERIENCE_ZONE_EVENT, { detail: zone }));
}

export function onZoneChange(handler: (zone: ExperienceZone) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<ExperienceZone>).detail);
  window.addEventListener(EXPERIENCE_ZONE_EVENT, listener);
  return () => window.removeEventListener(EXPERIENCE_ZONE_EVENT, listener);
}
