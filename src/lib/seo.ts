/**
 * Client-side per-route SEO head manager for the SPA.
 *
 * The static index.html ships canonical homepage metadata. Standalone routes
 * (privacy, terms, showcase, 404) are client-rendered, so this module updates
 * document.title, description, canonical, Open Graph, Twitter, and robots
 * directives to match the active route. Crawlers that execute JS (Googlebot,
 * Bingbot, AI search bots) pick up these values after render.
 */

export const SITE_ORIGIN = 'https://www.reliantai.org';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;
const INDEXABLE = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX = 'noindex, follow';

export interface RouteSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

function setMetaByName(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Applies a route's metadata to the document head. */
export function setPageSeo(seo: RouteSeo): void {
  if (typeof document === 'undefined') return;

  const url = `${SITE_ORIGIN}${seo.path === '/' ? '/' : seo.path}`;
  const image = seo.image ?? DEFAULT_OG_IMAGE;

  document.title = seo.title;
  setMetaByName('description', seo.description);
  setMetaByName('robots', seo.noindex ? NOINDEX : INDEXABLE);
  setCanonical(url);

  setMetaByProperty('og:title', seo.title);
  setMetaByProperty('og:description', seo.description);
  setMetaByProperty('og:url', url);
  setMetaByProperty('og:image', image);

  setMetaByName('twitter:title', seo.title);
  setMetaByName('twitter:description', seo.description);
  setMetaByName('twitter:image', image);
}

/** Route metadata table. Home is served statically from index.html. */
export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    path: '/',
    title: 'Reliant AI | Houston Web Design for Small Businesses',
    description:
      "Houston's custom web design agency for small businesses — hand-coded React & TypeScript sites for metal fabrication, oilfield, home services & medical practices. 150+ sites built, 98% client satisfaction.",
  },
  '/portfolio': {
    path: '/portfolio',
    title: 'Portfolio | Reliant AI — Houston Web Design Work',
    description:
      'Explore live Reliant AI demo sites for Houston trades: Copperline Plumbing, Linework Electric, and Stillair Comfort HVAC. Custom React & TypeScript builds — three sites, zero templates.',
  },
  '/showcase': {
    path: '/showcase',
    title: 'Video Showcase | Reliant AI — Houston Web Design',
    description:
      'See Reliant AI in motion: cinematic web design showcases for Houston small businesses across metal fabrication, oilfield, home services, and medical practices.',
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | Reliant AI',
    description:
      'How Reliant AI collects, uses, and protects your information. Read the privacy policy for reliantai.org.',
  },
  '/terms-of-service': {
    path: '/terms-of-service',
    title: 'Terms of Service | Reliant AI',
    description:
      'The terms governing use of Reliant AI services and the reliantai.org website.',
  },
};

const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: 'Page Not Found | Reliant AI',
  description: 'The page you requested could not be found. Explore Reliant AI Houston web design services.',
  noindex: true,
};

/** Resolves and applies SEO for a given pathname. Unknown paths are treated as 404. */
export function applyRouteSeo(pathname: string): void {
  const known = ROUTE_SEO[pathname];
  if (known) {
    setPageSeo(known);
    return;
  }
  // Keep the real unknown path in the URL/meta (noindex) instead of canonicalizing to /404,
  // which would create a soft-404 signal for crawlers that execute JS.
  setPageSeo({ ...NOT_FOUND_SEO, path: pathname || '/404' });
}
