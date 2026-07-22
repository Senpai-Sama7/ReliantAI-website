export type ExperienceZoneId =
  | 'hero'
  | 'worlds'
  | 'work'
  | 'services'
  | 'testimonials'
  | 'about'
  | 'faq'
  | 'contact';

export interface ExperienceZone {
  id: ExperienceZoneId;
  sector: string;
  label: string;
  tagline: string;
  mood: 'dawn' | 'void' | 'forge' | 'lab' | 'signal' | 'archive' | 'intel' | 'beacon';
  glow: string;
  particleDensity: number;
}

export const experienceZones: ExperienceZone[] = [
  {
    id: 'hero',
    sector: '01',
    label: 'HOME',
    tagline: 'Reliant AI · Houston',
    mood: 'dawn',
    glow: 'rgba(255, 110, 0, 0.22)',
    particleDensity: 0.9,
  },
  {
    id: 'worlds',
    sector: '02',
    label: 'INDUSTRIES',
    tagline: 'Who we build for',
    mood: 'void',
    glow: 'rgba(255, 110, 0, 0.35)',
    particleDensity: 1.4,
  },
  {
    id: 'work',
    sector: '03',
    label: 'WORK',
    tagline: 'Case studies',
    mood: 'forge',
    glow: 'rgba(255, 140, 40, 0.28)',
    particleDensity: 1.1,
  },
  {
    id: 'services',
    sector: '04',
    label: 'SERVICES',
    tagline: 'What we build',
    mood: 'lab',
    glow: 'rgba(255, 110, 0, 0.18)',
    particleDensity: 0.85,
  },
  {
    id: 'testimonials',
    sector: '05',
    label: 'RESULTS',
    tagline: 'Client outcomes',
    mood: 'signal',
    glow: 'rgba(255, 110, 0, 0.3)',
    particleDensity: 1.2,
  },
  {
    id: 'about',
    sector: '06',
    label: 'ABOUT',
    tagline: 'Who you work with',
    mood: 'archive',
    glow: 'rgba(200, 200, 220, 0.12)',
    particleDensity: 0.7,
  },
  {
    id: 'faq',
    sector: '07',
    label: 'FAQ',
    tagline: 'Common questions',
    mood: 'intel',
    glow: 'rgba(255, 110, 0, 0.14)',
    particleDensity: 0.65,
  },
  {
    id: 'contact',
    sector: '08',
    label: 'CONTACT',
    tagline: 'Start your project',
    mood: 'beacon',
    glow: 'rgba(255, 110, 0, 0.42)',
    particleDensity: 1.3,
  },
];

export function getZoneById(id: string): ExperienceZone | undefined {
  return experienceZones.find((z) => z.id === id);
}
