/** Scene portal worlds — imagery aligned with case study chapters. */
export interface PortalWorld {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  image: string;
  imageAlt: string;
  coords: string;
}

export const portalWorlds: PortalWorld[] = [
  {
    id: 'forge',
    eyebrow: 'World 01 — Industrial',
    title: 'FORGE',
    accent: 'THE FUTURE',
    image: '/project-metalforge.webp',
    imageAlt: 'Metal fabrication workshop in Houston',
    coords: '29.7604° N · Houston',
  },
  {
    id: 'field',
    eyebrow: 'World 02 — Energy',
    title: 'FIELD',
    accent: 'OPERATIONS',
    image: '/project-oilfield.webp',
    imageAlt: 'Oilfield equipment and operations',
    coords: '29.4241° N · Katy',
  },
  {
    id: 'home',
    eyebrow: 'World 03 — Services',
    title: 'HOME',
    accent: 'EXCELLENCE',
    image: '/project-homeservices.webp',
    imageAlt: 'Home services professional at work',
    coords: '29.6197° N · Sugar Land',
  },
  {
    id: 'care',
    eyebrow: 'World 04 — Medical',
    title: 'CARE',
    accent: 'REDEFINED',
    image: '/project-medical.webp',
    imageAlt: 'Modern medical practice interior',
    coords: '30.1658° N · The Woodlands',
  },
];
