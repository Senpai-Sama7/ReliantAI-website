# Ultimate Reliant AI Website

## Merged Synthesis Plan

> Build the final Reliant AI website on the Next.js application in `/home/donovan/Projects/source-code`, then selectively transplant the highest-value immersive motion from `/home/donovan/Projects/ReliantAI-website`.

## Executive Decision

Keep the Next.js architecture, port immersive motion selectively, scope Lenis to the home page, and treat light mode, strict TypeScript, and additional immersive effects as follow-up hardening rather than prerequisites.

This creates a single product with:

- Next.js App Router and server-rendered content pages.
- Totalum-backed content with fallback data.
- Working quote, lead, admin, authentication, and Stripe infrastructure.
- A premium home experience with restrained 3D, scroll storytelling, and motion.
- A unified industrial editorial design system.
- Better SEO, conversion paths, and long-term content scalability.

## Why Next.js Is the Foundation

| Capability | Vite SPA | Next.js application |
|---|---:|---:|
| File-based routes and dynamic detail pages | Requires rework | Already available |
| Server-side data access | Requires an external backend | Already available |
| Totalum CMS integration | Rebuild required | Already available |
| Auth and admin lead management | Rebuild required | Already available |
| Stripe checkout and webhooks | Rebuild required | Already available |
| Per-route metadata and sitemap | Manual | Native App Router support |
| Premium motion and 3D | Already available | Portable through client boundaries |

The business layer is harder to recreate than the motion layer. The Next.js project should therefore be the working application, while the Vite project becomes the source for selected experience components, assets, and interaction patterns.

## Product Direction

### Positioning

Use the source-code positioning as the foundation:

> **Websites that mean business.**

The site should communicate that Reliant AI builds fast, cinematic, measurable digital experiences for industrial and service businesses. The visual quality should feel premium without making the business appear inaccessible to the target buyer.

### Visual language

- Industrial, cinematic, editorial, and precise.
- Near-black warm background.
- Amber accent and controlled glow.
- Blueprint grid and subtle grain texture.
- Teko for display headlines.
- Manrope for body copy.
- JetBrains Mono for kickers, metadata, and technical labels.
- Sharp borders and restrained radii.
- Motion used to clarify hierarchy and quality, not to decorate every element.

### Brand decisions

- Primary accent: source-code amber, normalized through one CSS token system.
- Initial theme: dark only.
- Future theme: light mode may be added after the dark experience is stable and fully designed.
- Home headline: “Websites that mean business.”
- Avoid leading with “Luxury Web Design”; it overstates the offer for the intended market.
- Keep the founder's AI and cybersecurity expertise as a differentiator, not the primary narrative.

## Best-of Inventory

### Preserve from `source-code`

- `src/lib/site.ts` site configuration and navigation data.
- `src/lib/site-data.ts` types, fallback content, and Totalum fetchers.
- Better-Auth integration and Totalum adapter.
- Stripe client and API routes.
- Quote API, schema, form, and admin lead pipeline.
- App Router route structure:
  - `/`
  - `/about`
  - `/services`
  - `/services/[slug]`
  - `/work`
  - `/work/[slug]`
  - `/pricing`
  - `/journal`
  - `/journal/[slug]`
  - `/contact`
  - Authentication and admin routes.
- `SiteShell`, `Header`, `Footer`, `PageHero`, `Kicker`, `SectionHeading`, `Reveal`, `Stars`, and `Marquee` patterns.
- Pricing tiers, guarantees, service cards, work grid, process timeline, testimonials wall, FAQ, and quote form.
- Cloudflare/OpenNext configuration after it is verified.
- Existing robots, sitemap, metadata, and `public/llms.txt` foundations.

### Selectively port from `ReliantAI-website`

Port only components that improve the home page or a clearly defined conversion moment:

1. `SmoothScrollProvider` and Lenis synchronization, scoped to the home page.
2. `TorusKnot3D` as a desktop-only, lazy-loaded hero enhancement.
3. `PinnedStory` and `chapters.ts` as the signature work narrative.
4. `CountUp` for hero and results metrics.
5. `LogoReveal` for a restrained brand entrance.
6. `IntroOverlay` only if production testing proves it does not delay the first meaningful interaction.
7. `LivingField` and `ImmersiveAtmosphere` only if they meet performance budgets after the core home page is complete.
8. `ZoneHud` and `ExperienceZoneTracker` only if the home page has enough distinct experience zones to justify the added cognitive and technical complexity.
9. `ScenePortal` only after the pinned story and core conversion flow are stable.
10. `FloatingCTA`, `CookieConsent`, and `ExitIntentPopup` after consent and accessibility behavior are audited.

Do not port every immersive feature by default. The goal is a focused premium experience, not maximum animation density.

## Target Architecture

```text
source-code/                         # working Next.js application
├── src/app/                         # server routes and page composition
├── src/components/site/             # shell and content primitives
├── src/components/motion/           # home-scoped client motion infrastructure
├── src/components/immersive/        # optional atmosphere and zone components
├── src/components/three/            # lazy client-only 3D components
├── src/sections/                    # home-specific premium sections
├── src/hooks/                       # client hooks, theme later, popup triggers
├── src/lib/                         # data, auth, Stripe, SEO, motion utilities
└── public/                          # optimized local assets and SEO files
```

### Rendering boundaries

- Server components remain the default for all content pages.
- Client components are limited to interactive forms, navigation state, motion, 3D, and browser-only effects.
- No GSAP, Lenis, Three.js, or browser APIs may be imported into server components.
- `HomeMotionProvider` should wrap only the home page experience.
- Content pages use the existing CSS and IntersectionObserver `Reveal` pattern.

## Home Page Composition

The home page should follow this order:

1. Header and accessible skip link.
2. Hero with the headline, two CTAs, optional desktop 3D visual, and measurable stats.
3. Industry marquee.
4. Services grid.
5. Featured work grid.
6. Pinned case-study story.
7. Process timeline.
8. Pricing tiers and guarantees.
9. Testimonials wall with substantiated attribution where available.
10. FAQ.
11. Quote form.
12. Footer conversion band.

Atmosphere, zone HUD, and ScenePortal should remain optional enhancements rather than structural dependencies.

## Motion Strategy

### Home page

Use GSAP and ScrollTrigger for:

- Hero entrance sequencing.
- Count-up metrics.
- Pinned case-study transitions.
- High-value section reveals.
- Optional 3D exit/parallax behavior.

Use Lenis only within a home-specific provider. Do not put Lenis in the global root layout. This prevents smooth-scroll behavior from affecting forms, legal pages, journal reading, authentication, and admin workflows.

### Content pages

Use lightweight CSS transitions and IntersectionObserver reveals for:

- Services index and detail pages.
- Work index and detail pages.
- Pricing.
- About.
- Journal index and articles.
- Contact.
- Legal and utility pages.

This keeps content pages faster, more accessible, and easier to maintain.

### Reduced motion

Every ported motion component must have a clear reduced-motion path:

- No Lenis when reduced motion is enabled.
- No continuous particle loops.
- No pinned transitions that obscure content.
- No intro overlay that delays access.
- Static content remains fully visible.

## Implementation Phases

### Phase 0: Baseline and change control

- Create a synthesis branch in `source-code`.
- Preserve both original repositories.
- Do not physically move or delete either repository.
- Audit environment variables and secrets before changing infrastructure.
- Verify the existing quote, lead, admin, auth, Totalum fallback, Stripe, and deployment paths.
- Choose one deployment target and remove contradictory deployment assumptions.
- Normalize contact information and remove the unrelated `speedparadigm.com` address.

**Exit criteria:** existing business workflows pass before visual migration begins.

### Phase 1: Design system foundation

- Establish one amber token system in `globals.css`.
- Preserve the near-black background, blueprint grid, grain, and brand glow.
- Normalize Teko, Manrope, and JetBrains Mono usage.
- Port only required utilities from the Vite site: glass, gradient text, controlled glow, and motion easings.
- Keep dark mode as the only supported theme for this phase.

**Explicitly deferred:** light mode and broad theme abstraction.

### Phase 2: Motion infrastructure

- Add GSAP and ScrollTrigger.
- Add Lenis only through a home-specific `HomeMotionProvider`.
- Port `CountUp`, `LogoReveal`, and selected reveal helpers.
- Add cleanup utilities using `gsap.context` and tracked ScrollTriggers.
- Add browser guards and reduced-motion handling.
- Add a production build smoke test before adding Three.js.

**Exit criteria:** the home motion shell mounts and unmounts without console errors or scroll lockups.

### Phase 3: Hero and signature work story

- Port the hero structure and copy.
- Add the lazy desktop-only Torus Knot scene.
- Replace the hard-coded vendor chunk hash with build-safe Next.js dynamic loading.
- Port `PinnedStory` and adapt its data to the Next.js work model where practical.
- Keep a stacked mobile fallback without pinning.

**Exit criteria:** hero and work story work on desktop, mobile, reduced motion, and production builds.

### Phase 4: Home content integration

- Connect the source-code services, work, pricing, testimonials, process, FAQ, and quote form to the home composition.
- Keep content data-driven through `site-data.ts`.
- Add motion only where it reinforces hierarchy.
- Add the home-specific footer and conversion paths.

**Exit criteria:** the complete home funnel is usable without immersive enhancements.

### Phase 5: Optional immersive enhancements

Evaluate each enhancement against real measurements:

- LivingField.
- ImmersiveAtmosphere.
- ZoneHud.
- ExperienceZoneTracker.
- ScenePortal.
- IntroOverlay.
- Exit-intent and floating CTA.

Add only components that preserve performance, accessibility, and conversion clarity.

**Exit criteria:** each accepted enhancement has a mobile fallback, reduced-motion behavior, cleanup, and measured performance impact.

### Phase 6: Content and utility routes

- Apply the design system to login, register, profile, admin, and Stripe pages.
- Rewrite and brand privacy and terms pages.
- Replace the developer-facing error-page copy with customer-appropriate error states.
- Add loading states where server fetches can delay navigation.
- Ensure all route transitions preserve navigation and accessibility expectations.

### Phase 7: SEO and credibility

- Move the strongest Vite JSON-LD concepts into Next-native metadata and page schemas.
- Add Service, Article, FAQPage, BreadcrumbList, Review, and Organization schema where justified.
- Add route-specific OG images.
- Add privacy and terms to the sitemap.
- Replace stock case-study imagery with real work or clearly labeled concepts.
- Add verified review links and client logos only when substantiated.
- Expand journal content with useful, original articles.

### Phase 8: Performance and release verification

- Run `next build`, lint, and typecheck.
- Run a production browser smoke test for the 3D hero.
- Test all dynamic routes with CMS data and fallback data.
- Test quote submission through the admin pipeline.
- Test Stripe checkout, webhook, and database updates if commerce remains enabled.
- Test keyboard navigation, focus management, touch targets, and reduced motion.
- Run Lighthouse with targets of LCP under 2 seconds, CLS under 0.05, and INP under 200ms where realistic.
- Optimize images with local responsive assets, `next/image`, `sizes`, and modern formats.

## Migration Map

| Destination in Next.js | Source | Action |
|---|---|---|
| `src/components/motion/HomeMotionProvider` | `components/SmoothScrollProvider.tsx` | Adapt; home-only Lenis and ScrollTrigger sync |
| `src/components/motion/count-up.tsx` | `components/CountUp.tsx` | Port as client component |
| `src/components/motion/logo-reveal.tsx` | `components/LogoReveal.tsx` | Port selectively |
| `src/components/motion/intro-overlay.tsx` | `components/IntroOverlay.tsx` | Optional after performance validation |
| `src/components/three/torus-knot-3d.tsx` | `components/TorusKnot3D.tsx` | Port with `dynamic(..., { ssr: false })` |
| `src/sections/pinned-story.tsx` | `sections/PinnedStory.tsx` | Port and adapt data |
| `src/data/chapters.ts` | `data/chapters.ts` | Port, then reconcile with CMS work data |
| `src/components/immersive/*` | `components/immersive/*` | Optional, measured port |
| `src/components/three/scene-portal.tsx` | `components/ScenePortal.tsx` | Defer until core experience is stable |
| `src/hooks/use-popup-trigger.ts` | `hooks/usePopupTrigger.ts` | Port after consent review |
| `src/components/site/sections.tsx` | Existing Next.js component | Keep data model; add restrained motion |
| `src/components/site/quote-form.tsx` | Existing Next.js component | Keep as conversion source of truth |
| `src/lib/site-data.ts` | Existing Next.js file | Keep as CMS and fallback source |

## Scope Cuts and Non-Goals

- Do not rebuild the backend in Vite.
- Do not physically merge git histories before the architecture is proven.
- Do not use Lenis globally by default.
- Do not add light mode during the first implementation pass.
- Do not enable strict TypeScript during visual migration.
- Do not port every immersive component just because it exists.
- Do not keep the empty VideoShowcase/VideoHero implementation.
- Do not keep the iframe portfolio as the primary proof of work.
- Do not ship fabricated testimonials or unsupported metrics as verified claims.
- Do not optimize for animation density over conversion clarity.

## Deferred Hardening

These are valuable but not prerequisites for the first synthesis milestone:

1. Light theme and full theme abstraction.
2. `strict: true` TypeScript migration.
3. Full LivingField and atmosphere system.
4. Zone HUD and multi-zone navigation state.
5. ScenePortal industry worlds.
6. Service worker and offline behavior.
7. Full image AVIF pipeline.
8. Advanced per-route OG image generation.
9. Additional admin and CRM features.

Each deferred item should be implemented only after the core site has measurable value and stable release verification.

## Risks and Controls

| Risk | Control |
|---|---|
| SSR crash from browser APIs | Keep motion and Three.js behind client boundaries and browser guards |
| Lenis conflicts with forms or mobile browsers | Scope Lenis to home; test iOS and reduced motion |
| Three.js bundle growth | Lazy-load, desktop-gate, cap DPR, measure production bundle |
| ScrollTrigger pin instability | Use cleanup, refresh discipline, mobile fallback, and no-pinning reduced-motion path |
| Theme token drift | One CSS variable source of truth |
| CMS outage | Preserve fallback content and test both paths |
| Stripe regression | Run checkout/webhook tests before and after migration |
| Off-brand utility routes | Rebuild shared shells and error states before launch |
| Unsupported claims | Require evidence for testimonials, metrics, and logos |
| Deployment divergence | Choose Cloudflare or Vercel and remove stale configuration |

## Definition of Done

- Next.js remains the single application foundation.
- Existing quote, lead, admin, auth, CMS fallback, and Stripe workflows remain functional.
- Home page includes the premium hero, measurable stats, services, work, process, pricing, testimonials, FAQ, quote form, and footer.
- Selective motion is implemented with proper client boundaries and cleanup.
- Lenis is scoped to the home page only.
- 3D is lazy, desktop-first, reduced-motion safe, and production-tested.
- Content pages remain fast and data-driven without global smooth scrolling.
- Dark industrial design is unified across marketing and utility routes.
- Per-route metadata and meaningful JSON-LD are implemented.
- Legal, error, auth, and Stripe routes no longer look like unrelated templates.
- Both source repositories remain preserved.
- Build, lint, typecheck, accessibility, mobile, reduced-motion, funnel, and deployment checks pass.

## Follow-Up Decisions

These decisions can be made after the first implementation milestone:

1. Whether to add light mode.
2. When to enable strict TypeScript.
3. Which immersive effects justify their performance cost.
4. Whether Stripe should remain part of the public product flow.
5. Which client work, review links, and case-study evidence can be published.
