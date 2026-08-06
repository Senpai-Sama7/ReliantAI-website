# Ultimate Reliant AI Website — Synthesis Plan

> Strategic plan for merging the best elements of `/home/donovan/Projects/ReliantAI-website` (Vite + React SPA) and `/home/donovan/Projects/source-code` (Next.js 15 + Cloudflare Workers) into a single, unified Reliant AI marketing site.

---

## The Core Insight

Both codebases target the same business (Reliant AI, Houston web design) but solved the problem very differently.

| Dimension | ReliantAI-website (Vite + React) | source-code (Next.js 15 + CF Workers) |
|---|---|---|
| **Personality** | Cinematic, deep, "Apple-tier motion" | Editorial, confident, "small lethal shop" |
| **Visual language** | Teko + Open Sans, **orange #ff6e00**, dark/light theme | Teko + Manrope + JetBrains Mono, **amber #f59e42**, dark-only |
| **Depth** | 3D hero, pinned story, LivingField particles, zone HUD, intro overlay | Flat 2D, CSS-only reveals, no GSAP/3D |
| **Architecture** | SPA, no router, simulated contact form, single-page | Full Next.js App Router, real DB (Totalum), auth, Stripe, dynamic routes |
| **Content surface** | 1 long page, 3 demo portfolio iframes, no blog/pricing/team pages | 9 real routes: services, work, pricing, journal, about, contact, login, admin, legal |
| **Engineering rigor** | Premium animations, GSAP hygiene, a11y, SEO depth, llms.txt | Server components, parallel fetching, real data layer, auth |
| **Biggest gap** | Single page, no CMS, no real routing, no blog/journal | No 3D, no scroll storytelling, no premium motion, 7 pages off-brand |

**The synthesis is obvious**: source-code has the **architecture, content surface, and editorial polish**; ReliantAI-website has the **premium motion vocabulary, 3D, and scroll storytelling**. Merge them.

---

## Recommended Direction

**Build on the Next.js foundation** (real routes, real data, auth, Stripe) and **port the motion system** (3D hero, pinned story, LivingField, zone HUD, intro overlay, GSAP/Lenis) from the Vite site. This is a 6–8 week project, not a refactor.

### Why Next.js as the base (not Vite)

- You need real routes (`services/[slug]`, `work/[slug]`, `journal/[slug]`) — hand-rolled path checks won't scale past 5 pages.
- The data layer (Totalum) is already wired and battle-tested for Cloudflare Workers.
- Better-Auth + Stripe + admin are all working infra you'd have to rebuild.
- Per-page metadata + JSON-LD + dynamic sitemap only work properly in Next.

### Keep (don't touch) from Next.js codebase

- `src/lib/site.ts`, `src/lib/site-data.ts` (all types + FB_* fallback content).
- `src/lib/auth.ts` + `better-auth-totalum-adapter.ts`.
- `src/lib/stripe.ts` + API routes (`/api/quote`, `/api/stripe/*`, `/api/auth/*`, `/api/admin/*`).
- `src/middleware.ts` (after fixing `allowedDevOrigins: ["*"]`).
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- The full `src/app/(marketing)/*` route structure.
- `next.config.ts` cache rules for `/_next/static/*`.
- `public/llms.txt`.

### Port from Vite codebase (motion + 3D)

1. **Hero 3D** — `TorusKnot3D.tsx` + `load-three.ts` (adapt for Next `dynamic` import + `Suspense`).
2. **Intro overlay** — `IntroOverlay.tsx` (stroke-dash skyline + failsafe).
3. **Pinned scroll story** — `PinnedStory.tsx` + `data/chapters.ts` (flagship section).
4. **Scene portal** — `ScenePortal.tsx` + `data/worlds.ts` (FORGE / FIELD / HOME / CARE).
5. **Living field particles** — `LivingField.tsx` + `ImmersiveAtmosphere.tsx`.
6. **Zone HUD** — `ZoneHud.tsx` + `ExperienceZoneTracker.tsx` + `data/experienceZones.ts`.
7. **GSAP + Lenis provider** — `SmoothScrollProvider.tsx`, `lib/lenis.ts`, `lib/reveal.ts`, `lib/recovery.ts`.
8. **Popups & consent** — `ExitIntentPopup.tsx`, `CookieConsent.tsx`, `FloatingCTA.tsx`.
9. **CountUp** — `CountUp.tsx` (better than the source-code manual counters).
10. **Theme toggle** — `useTheme.ts` + `ThemeToggle.tsx` (adds light mode to the Next site).

### Resolve conflicts (rebrand → unified)

| Conflict | Decision |
|---|---|
| **Accent color** | **Amber `#f59e42`** wins. Warmer, more "industrial/premium" than pure orange. ReliantAI-website's `#ff6e00` is too pure-orange. |
| **Font stack** | **3 fonts** from Next.js site: Teko (display) + Manrope (body) + JetBrains Mono (kickers). Vite site is missing JetBrains Mono which is a huge miss for editorial rhythm. |
| **Theme** | **Dark default + light toggle** (best of both). Next.js is dark-only; Vite has both. |
| **3D / canvas** | **Home only** (per the Vite site guidance: desktop-first, lazy-loaded, `dpr={[1, 1.5]}`, `low-power`). Skip on mobile. |
| **Reveal pattern** | **Hybrid.** Use `Reveal` (CSS+IO) from Next site for **content pages** (about, pricing, services). Use **GSAP+ScrollTrigger** for the **home page** (pinned story, zone HUD, LivingField, 3D hero). |
| **Smooth scroll** | **Lenis for home only.** Lenis is overkill for content pages and causes iOS Safari issues with anchor links from header. |
| **shadcn/ui** | **Use for forms/dialogs** (login, register, admin, modals). **Don't use for marketing content** — marketing stays hand-rolled with `SectionHeading` / `Kicker` / `Reveal`. This is what Next.js already does; keep it. |
| **3D vendor chunk** | Don't pre-inject by hash. Use `await import('three')` inside a Next `dynamic()` with `ssr: false` and `loading={null}`. |
| **Iframe portfolio** | Drop the `PortfolioSection` iframes. Replace with **proper `/work/[slug]` pages** that Next.js already has — those are far more valuable than demo sites. |
| **VideoShowcase / VideoHero** | Delete entirely. `video: ''` for all acts, ships as dead code in both. |
| **"LUXURY WEB DESIGN"** | Drop. Tonally off for Houston small businesses. Use source-code's positioning: **"Websites that mean business."** |
| **About mismatch** | Rewrite About to be about web/AI/cybersecurity as **differentiators**, not the main act. Use source-code's "team" 3-card layout but with Douglas as founder + 2 collaborators. |
| **Testimonials** | Source-code's masonry with star ratings + avatars > Vite's numbered editorial cards. Use source-code's pattern. |
| **Pricing** | Source-code's 4-tier with guarantee cards is exceptional. Keep as-is. |
| **Journal** | Source-code has the structure; Vite has nothing. Keep Next.js. Need to write 3+ real articles. |
| **Privacy / Terms** | Both are bad. Rewrite as actual legal copy styled to the site, generated from a real policy template. |
| **Login / Register / Profile / Admin** | Rebuild with the marketing design system (currently off-brand in source-code). Use the amber palette, Teko headings, dark cards. |
| **Hero copy** | Use source-code's headline "Websites that mean business." + the Vite site's typewriter logo reveal. |
| **Stats strip** | Use Vite site's animated `CountUp` with source-code's numbers (48hr, 97+, 5, 12yr). |
| **Process timeline** | Both have similar 4–5 step. Use source-code's `ProcessTimeline` (01–05 with icons). Add the SVG illustrations from Vite's `PinnedStory` per step. |

### New things to build (neither has these well)

1. **Real case study screenshots** — replace stock `project-*.jpg` with real client work (even if mocked for launch).
2. **Per-page JSON-LD** — Service, Article, FAQPage, BreadcrumbList, Review. Source-code has only Organization.
3. **Review platform links** — Google, Clutch, etc. to back the "98% satisfaction" claim.
4. **Sitemap fixes** — add `/privacy-policy` and `/terms-of-service`.
5. **OG image per route** — Next.js `openGraph.images` with dynamic generation.
6. **Custom 404 + error pages** matching the brand (source-code's 404 is good; `error.tsx` is dev-facing garbage).
7. **Auth pages redesigned** in brand (login, register, profile, forgot-password).
8. **Stripe pages redesigned** in brand (or remove if not launching commerce).
9. **A "process" section** that matches the HowTo schema in ReliantAI-website's `index.html`.
10. **Real client logos** / "as seen in" / press strip.

---

## Implementation Roadmap

### Phase 1: Foundation reset (week 1)

- [ ] Move working tree to `ReliantAI-website-v2/` (keep old one for asset extraction).
- [ ] Use **Next.js codebase as base**, rename `contacto@speedparadigm.com` → `hello@reliantai.org`.
- [ ] Fix `next.config.ts`: `allowedDevOrigins: []` for prod.
- [ ] Fix `tsconfig.json`: turn on `strict: true`.
- [ ] Strip `next-themes` (not used), keep all other deps.
- [ ] Fix Privacy/Terms placeholders.

### Phase 2: Design system unification (week 2)

- [ ] Update `globals.css`: add **amber** palette, keep dark default, add light theme variables.
- [ ] Add `useTheme()` hook (port from Vite).
- [ ] Add `ThemeToggle` to header.
- [ ] Add 3D canvas container CSS.
- [ ] Add `industrial-precision` / `fluid-motion` easings.

### Phase 3: Motion layer (weeks 3–4)

- [ ] Port `SmoothScrollProvider` + `Lenis` (home only).
- [ ] Port `IntroOverlay` + `LogoReveal` (post-paint, 1.5s).
- [ ] Port `Reveal` (CSS+IO) as the default.
- [ ] Port `CountUp` + `useInView` helpers.
- [ ] Port GSAP cleanup utilities (`useGsapContext`, `triggersRef`).

### Phase 4: Home page rebuild (weeks 4–5)

- [ ] Hero with 3D torus knot (desktop only, lazy via `next/dynamic`, `dpr-[1, 1.5]`, `low-power`).
- [ ] Hero copy: "Websites that mean business." + amber "Start a project" CTA.
- [ ] Stats strip with animated `CountUp`.
- [ ] Marquee.
- [ ] Services grid (5 cards from source-code).
- [ ] Featured work (5 from source-code with real images).
- [ ] **Pinned story** (4 industries) — port `PinnedStory.tsx` + `chapters.ts`.
- [ ] **Scene portal** — port as the "Worlds" section.
- [ ] **Living field + zone HUD + atmosphere** — port entire immersive system.
- [ ] Process timeline (with ported SVGs).
- [ ] Pricing (4 tiers with guarantee cards).
- [ ] Testimonials (masonry from source-code).
- [ ] FAQ (native `<details>`, from source-code).
- [ ] Quote form (RHF + zod, from source-code).
- [ ] Footer (from source-code, with blueprint grid + grain).

### Phase 5: Content pages polish (week 6)

- [ ] Redesign **login, register, profile, admin** with the marketing design system.
- [ ] Redesign **`/privacy-policy`, `/terms-of-service`** with real copy + brand.
- [ ] Redesign **`/error`** and **`/global-error`** (kill "Let AI fix this" gimmick).
- [ ] Add per-page **JSON-LD** (Service, FAQPage, Article, BreadcrumbList, Review).
- [ ] Add per-page **OG image** via `openGraph.images` + dynamic generation.
- [ ] Add `loading.tsx` skeletons.
- [ ] Fix `force-dynamic` to `revalidate: 60` where data is fallback-only.

### Phase 6: Performance + launch (weeks 7–8)

- [ ] Lighthouse 95+ on every route (LCP < 2.0s, CLS < 0.05, INP < 200ms).
- [ ] Replace all raw `<img>` with `next/image` + add `sizes` + `placeholder="blur"`.
- [ ] Convert hero / project / og images to AVIF + WebP.
- [ ] Service worker for offline.
- [ ] Crawl all routes, validate JSON-LD, validate sitemap.
- [ ] Replace placeholder IDs (GA4 already done, Meta + Clarity still placeholders).
- [ ] Add real client logos if available.
- [ ] **Delete**: `VideoShowcase`, `VideoHero`, `testi-3d-stage` CSS, `INFLUENCE_MATRIX_IMPLEMENTATION.md`, `public/testimonial-*.{jpg,webp}`.

---

## What This Gets You

- **9 SEO-indexable routes** instead of 1 page.
- **Real auth + admin + Stripe** instead of simulated form.
- **Pinned scroll storytelling + 3D hero + LivingField particles + zone HUD** — Apple/Stripe-tier motion.
- **3-font industrial editorial system** (Teko + Manrope + JetBrains Mono) on a unified amber palette.
- **Dark default + light toggle** (reach).
- **Real case studies** with metrics and process SVGs.
- **Per-page JSON-LD** for AI/LLM retrieval.
- **Lighthouse 95+ on every page**.
- **One coherent codebase** instead of two divergent attempts.

---

## Open Decisions

These need user input before work begins:

1. **Base framework**: Next.js 15 (source-code) as base + port motion (recommended) **vs.** Vite + React as base + add routes **vs.** Greenfield Next.js cherry-picking both.
2. **Accent color**: Amber `#f59e42` (recommended) **vs.** Orange `#ff6e00` **vs.** Both.
3. **Theme mode**: Dark-only **vs.** Dark default + light toggle (recommended) **vs.** Light-only.

---

## Key File References (current state)

### ReliantAI-website (Vite)
- Sections: `src/sections/HeroV2.tsx:175-349`, `PinnedStory.tsx:127-581`, `ServicesV2.tsx:11-40`, `TestimonialsV2.tsx:11-42`, `About.tsx:29-286`, `Contact.tsx:13-409`, `FAQ.tsx:10-148`, `PortfolioSection.tsx:8-225`.
- Components: `src/components/ScenePortal.tsx:16-246`, `TorusKnot3D.tsx:48-116`, `IntroOverlay.tsx:23-203`, `LivingField.tsx:29-182`, `ZoneHud.tsx:6-57`, `Navigation.tsx:31-271`, `SmoothScrollProvider.tsx:17-79`.
- Motion: `src/lib/reveal.ts:34-73`, `src/lib/lenis.ts`, `src/lib/recovery.ts:62`, `src/hooks/useIntroAnimations.ts:11-47`.
- Data: `src/data/chapters.ts`, `src/data/worlds.ts`, `src/data/experienceZones.ts`.

### source-code (Next.js)
- Routes: `src/app/page.tsx:1-257`, `src/app/about/page.tsx:1-142`, `src/app/services/[slug]/page.tsx:1-153`, `src/app/work/[slug]/page.tsx:1-181`, `src/app/pricing/page.tsx:1-90`, `src/app/journal/page.tsx:1-92`, `src/app/contact/page.tsx:1-90`, `src/app/login/page.tsx:1-129`, `src/app/register/page.tsx:1-150`, `src/app/admin/page.tsx:1-107`, `src/app/privacy-policy/page.tsx:1-265`, `src/app/terms-of-service/page.tsx:1-320`.
- Site components: `src/components/site/sections.tsx:1-245`, `src/components/site/header.tsx:1-134`, `src/components/site/footer.tsx:1-103`, `src/components/site/quote-form.tsx:1-212`, `src/components/site/reveal.tsx:1-51`, `src/components/site/ui-bits.tsx:1-78`, `src/components/site/page-hero.tsx:1-36`, `src/components/site/site-shell.tsx:1-13`.
- Lib: `src/lib/site.ts:1-68`, `src/lib/site-data.ts:1-456`, `src/lib/auth.ts:1-274`, `src/lib/better-auth-totalum-adapter.ts:1-592`, `src/lib/stripe.ts:1-191`, `src/lib/quote-schema.ts:1-31`.
- API: `src/app/api/quote/route.ts:1-156`, `src/app/api/stripe/webhook/route.ts:1-163`, `src/app/api/admin/leads/route.ts:1-45`.
- SEO: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx:31-130`, `public/llms.txt`, `public/_headers`.
