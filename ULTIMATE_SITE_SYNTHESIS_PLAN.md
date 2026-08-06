# Ultimate Website — Synthesis Plan

**Goal:** Merge the best elements of two existing codebases into one "ultimate" Reliant AI website.

- **`ReliantAI-website`** (this repo) — React 19 + Vite + TS marketing SPA. Premium motion layer (GSAP + ScrollTrigger + Lenis), Three.js immersive scenes, industrial dark/glass design, best-in-class SEO.
- **`source-code`** (sibling repo) — Next.js 15.3.9 + Tailwind 4 full-stack app. Real business layer: Stripe billing, better-auth, admin leads/CRM, CMS-backed content (Totalum), pricing, work/services/journal pages, quote + email.

Both codebases are the **same business** (Reliant AI, Houston TX, founder Douglas Mitchell). This is not a merge of two different products — it is reuniting the two layers (visual experience + business functionality) that were split across stacks.

---

## 1. Key Strategic Decision (read first)

### Recommended: build the ultimate site on the **Next.js stack** (`source-code`).

| Criterion | Vite SPA (ReliantAI-website) | Next.js (source-code) |
|---|---|---|
| Server routes (Stripe webhook, auth, quote, leads) | ❌ Not possible without adding a backend/functions layer | ✅ Native (`src/app/api/*`) |
| SSR / dynamic slug pages (`/work/[slug]`, `/services/[slug]`, `/journal/[slug]`) | ❌ Would need client-side fetch + routing rework | ✅ Native file-based routing |
| CMS-driven content (Totalum) | ❌ Would re-implement fetchers client-side | ✅ Already built (`site-data.ts`) |
| Auth + admin dashboard | ❌ Rebuild from scratch | ✅ Already built (better-auth + Totalum adapter) |
| Premium motion / 3D (GSAP, Lenis, R3F) | ✅ Already built | ⚠️ Must be **ported in** (the migration work) |
| Deployment | Vercel SPA | Cloudflare Workers (opennext) / Vercel |

**Rationale:** The functional/business layer is far harder to recreate in a static SPA than the motion layer is to port into Next.js. The motion components (GSAP/ScrollTrigger/Lenis/Canvas/Three.js) are client-only components that work fine inside Next.js — they simply need `"use client"` directives. Therefore the synthesis direction is:

> **Take the premium visual/motion layer from `ReliantAI-website` and transplant it onto the full-stack shell of `source-code`.**

Accent brand note: current site uses orange `#ff6e00`; source-code uses amber OKLCH (`oklch(0.74 0.16 62)`). Decide one brand color early and normalize (see Phase 0). Recommend keeping source-code's "amber-on-near-black" as the default dark base, but offer the light mode from the current site via the `useTheme` toggle.

---

## 2. Best-of Inventory

### 2a. Keep / port FROM `source-code` (the functional layer)

| Asset | Files | Why it's best-of |
|---|---|---|
| Stripe billing ("products in code" pattern) | `src/lib/stripe.ts`, `src/app/api/stripe/*`, `src/app/stripe/*` | Cloudflare-ready, code-defined products, checkout + customer portal + async webhook |
| Auth (better-auth + Totalum adapter) | `src/lib/auth.ts`, `auth-client.ts`, `better-auth-totalum-adapter.ts`, `src/middleware.ts`, `src/app/api/auth/*` | Custom DB adapter; Edge middleware protection |
| Leads / CRM | `src/app/api/quote/route.ts`, `quote-schema.ts`, `quote-form.tsx`, `admin-leads.tsx`, `src/app/api/admin/leads/route.ts`, `src/app/admin/page.tsx` | Zero-maintenance CRM; Zod validation; transactional emails on lead |
| CMS content engine | `src/lib/site-data.ts`, `src/lib/totalum.ts`, `src/lib/site.ts` | Types + robust `parseList` + DB-fetch-with-fallback to seed data |
| Content/Dynamic pages | `work`, `services`, `journal` (+ `[slug]`), `about`, `contact`, `pricing`, legal pages | Real routes for SEO and scale |
| Reveal-on-scroll (IntersectionObserver) | `src/components/site/reveal.tsx`, `ui-bits.tsx`, `sections.tsx`, `dynamic-icon.tsx` | Lightweight, SSR-safe baseline for content sections |
| Design tokens (OKLCH, Tailwind v4 `@theme`) | `src/app/globals.css` | Modern, accessible, cohesive amber-on-dark |
| CORS/CSP middleware + workers config | `src/middleware.ts`, `wrangler.jsonc`, `open-next.config.ts` | Production-hardened headers |

### 2b. Keep / port FROM `ReliantAI-website` (the experience layer)

| Asset | Files | Why it's best-of |
|---|---|---|
| Smooth scroll (Lenis + GSAP ticker sync) | `src/components/SmoothScrollProvider.tsx`, `src/lib/lenis.ts` | Buttery scroll, reduced-motion aware |
| Scroll story (vertical→horizontal pinned case studies) | `src/sections/PinnedStory.tsx`, `src/data/chapters.ts` | The signature "premium" interaction |
| 3D hero visual | `src/sections/HeroV2.tsx` + `src/components/TorusKnot3D.tsx` | Lazy-loaded R3F scene, auto-pauses off-screen, CLS-protected |
| Immersive atmosphere layer | `src/components/immersive/*` (ImmersiveAtmosphere, LivingField, ZoneHud, ExperienceZoneTracker), `src/data/experienceZones.ts`, `src/data/worlds.ts` | Particle field + scroll-driven HUD — the "app-level" feel |
| Interactive worlds/portal | `src/components/ScenePortal.tsx` | Unique industry-switcher interaction |
| Count-up stats + section reveals | `src/components/CountUp.tsx`, `src/sections/*V2.tsx` | Polished motion polish |
| Intro overlay + logo reveal | `src/components/IntroOverlay.tsx`, `LogoReveal.tsx`, `src/hooks/useIntroAnimations.ts` | Cinematic boot that hides asset load |
| Conversion chrome | `FloatingCTA.tsx`, `ExitIntentPopup.tsx`, `CookieConsent.tsx` | Lead-gen / UX safety |
| SEO/schema approach | `index.html` (JSON-LD: Organization, WebSite, Service, FAQPage; semantic anchors; noscript) | Masterclass SEO hygiene (must be re-expressed as Next `Metadata`/`layout.tsx`) |
| Light/dark `useTheme` | `src/hooks/useTheme.ts`, `src/components/ThemeToggle.tsx` | Clean custom theme hook (no lib bloat) |
| Design utilities | `.glass`, `.glow-orange`, `Teko/Open Sans` in `src/index.css`, `tailwind.config.js` | Cohesive industrial brand |



---

## 3. Target Architecture (ultimate site)

```
Next.js 15 app (single home: source-code)
│
├── src/app/                    # File-based routes (SSR)
│   ├── layout.tsx              # ThemeProvider, fonts (Teko/Manrope/JetBrains),
│   │                           # Metadata + JSON-LD (SEO), Toaster, analytics
│   ├── page.tsx                # Home: immersive hero + pinned story + sections
│   ├── work/, services/, journal/ (+ [slug]), about/, contact/,
│   │   pricing/, privacy-policy/, terms-of-service/
│   ├── api/                    # Stripe, auth, quote, admin/leads (all kept)
│   └── admin/, login/, register/, profile/, stripe/  (kept)
│
├── src/components/
│   ├── site/                   # shell, header, footer, reveal, ui-bits, quote-form…
│   │                            # (kept; upgraded nav to GSAP ScrollTo)
│   ├── immersive/              # PORTED from ReliantAI-website
│   ├── motion/                 # SmoothScrollProvider, CountUp, Lenis, GSAP utils (PORTED)
│   └── three/                  # TorusKnot3D, ScenePortal (PORTED, lazy)
│
├── src/sections/               # PORTED premium sections + new data-driven variants
├── src/lib/                    # site.ts, site-data.ts, totalum.ts, stripe.ts, auth…
│                                # plus motion/lenis/scroll utils (PORTED)
└── src/hooks/                  # useTheme, usePopupTrigger, useIntroAnimations (PORTED)
```

Key hybridization pattern:
- **Content sections** (`services`, `work`, `pricing`, `journal`, `faq`) stay **data-driven** (Totalum via `site-data.ts`) but get the **premium reveal/motion treatment** from ReliantAI.
- **Experience sections** (`PinnedStory`, `ScenePortal`, hero immersive) stay **client-only**, data attached via local files or optional CMS.


---

## 4. Phased Implementation Plan

### Phase 0 — Alignment & foundations (still in `source-code`)
1. Decide **brand color** (orange `#ff6e00` vs amber `oklch(0.74 0.16 62)`) and normalize tokens.
2. Decide **theme model**: dark-only (source-code current) vs light+dark (ReliantAI current). Recommend dark-only for a cinematic industrial brand, but port `useTheme` if dual-mode desired.
3. Back up both repos (git commit both) — **do not** delete either; the plan is additive/migratory.
4. Audit `.env` / secrets: Stripe, Totalum, Auth secret, analytics IDs.
5. Add `gsap`, `lenis`, `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`(already), `clsx` (already) to `package.json` of `source-code`.

### Phase 1 — Port the motion infrastructure (client-only)
- `SmoothScrollProvider` → Next client `MotionProvider` (Lenis + ScrollTrigger ticker, reduced-motion guard).
- `src/lib/lenis.ts`, `src/lib/scroll.ts`, `src/lib/motion.ts`, `scrollLayout.ts` utils.
- `CountUp`, `LogoReveal`, `IntroOverlay`, `useIntroAnimations`.
- Register providers in `layout.tsx` (client boundary around `{children}`).
- ⚠️ Guard: ensure these only instantiate on the client (`typeof window`), no SSR crash.

### Phase 2 — Port the signature immersive sections
- `HeroV2` (with lazy `TorusKnot3D`, desktop-only 3D, CLS protections) → integrate into home `page.tsx`.
- `PinnedStory` + `chapters.ts` → "Our Work / Case studies" (data-driven later).
- `ScenePortal` + `worlds.ts` → industry switcher.
- `src/components/immersive/*` (ImmersiveAtmosphere, LivingField, ZoneHud, ExperienceZoneTracker) + `experienceZones.ts`.
- Attach `ExperienceZoneTracker` scroll logic (already ScrollTrigger-based; keep it client-only).

### Phase 3 — Hybridize content sections with motion
- Wrap `source-code`'s existing `ServicesGrid`, `WorkGrid`, `PricingGrid`, `TestimonialsWall`, `FaqAccordion` with ReliantAI-style reveals/glow.
- Replace the plain `Reveal` on the home hero with ReliantAI's staggered GSAP reveals and `CountUp` stats.
- Keep all data coming from `site-data.ts` / Totalum so content stays CMS-editable.

### Phase 4 — Unify design system
- Merge CSS: keep Tailwind v4 `@theme` OKLCH tokens as source of truth; port ReliantAI utility classes (`.glass`, `.glow-orange`, `.gradient-text`) into globals.
- Normalize fonts: **Teko** display + **Manrope** body + JetBrains Mono (source-code already loads these via `next/font`).
- Reconcile `CtaButton`/nav styling across header/footer so the glass/glow treatment is consistent.

### Phase 5 — Upgrade navigation to GSAP ScrollTo
- Current site uses GSAP `ScrollToPlugin` with 80px offset; source-code uses route links.
- Keep route-based pages in the nav; use scroll-to-section for home anchors.
- Wire mobile menu with same industrial styling.

### Phase 6 — SEO re-expression (Next-native)
- Move `index.html` JSON-LD (Organization, WebSite, Service, FAQPage) into Next `layout.tsx` + page-level `Metadata`.
- Keep semantic anchors for AI/LLM crawlers.
- Replace GA4/Meta/Clarity placeholders with env-driven `<script>` tags (Next `next/script`).

### Phase 7 — Conversion chrome + polish
- Port `FloatingCTA`, `ExitIntentPopup`, `CookieConsent` to client components.
- Ensure correct deployment: `vercel.json` OR Cloudflare `wrangler.jsonc` + `open-next.config.ts`.

### Phase 8 — Verification
- `npm run check-types-errors` (source-code) + `npm run lint` + `next build`.
- Lighthouse (CLS < 0.1, TBT, LCP).
- Reduced-motion pass (all animations disable).
- Mobile pass (3D hidden on mobile, touch targets ≥44px).
- Test full funnel: quote → lead → admin; pricing → Stripe checkout → webhook → DB.
- Test all dynamic routes with + without CMS fallback.



---

## 5. File-by-File Migration Map

| Destination (`source-code/src/…`) | Source (`ReliantAI-website/src/…`) | Action |
|---|---|---|
| `components/motion/SmoothScrollProvider` | `components/SmoothScrollProvider.tsx` → client | port |
| `lib/motion.ts`, `lib/scroll.ts`, `lib/scrollLayout.ts`, `lib/lenis.ts` | `lib/*` equivalents | port |
| `components/count-up.tsx` | `components/CountUp.tsx` | port (client) |
| `components/intro-overlay.tsx`, `logo-reveal.tsx` | `components/IntroOverlay.tsx`, `LogoReveal.tsx` | port (client) |
| `hooks/use-intro-animations.ts`, `use-theme.ts`, `use-popup-trigger.ts` | `hooks/*` | port |
| `components/three/torus-knot-3d.tsx` | `components/TorusKnot3D.tsx` | port (lazy) |
| `sections/hero.tsx` | `sections/HeroV2.tsx` | port + data hookup |
| `sections/pinned-story.tsx`, `data/chapters.ts` | `sections/PinnedStory.tsx`, `data/chapters.ts` | port |
| `components/immersive/*` | `components/immersive/*` | port (client) |
| `components/three/scene-portal.tsx`, `data/worlds.ts`, `data/experienceZones.ts` | `components/ScenePortal.tsx`, `data/*` | port |
| `components/site/reveal.tsx` | (source-code existing) | keep, optionally upgrade |
| home `page.tsx` | compose HeroV2 + PinnedStory + ServicesGrid + Pricing + Work + Testimonials + Quote + FAQ | build |
| `lib/seo.ts`, JSON-LD, metadata | `index.html` schema | re-express in Next |
| `components/floating-cta.tsx`, `exit-intent-popup.tsx`, `cookie-consent.tsx` | `components/*` | port (client) |

---

## 6. Risks & Considerations

1. **SSR vs client-only motion.** Every ported motion component must be `"use client"` and guarded with `typeof window`. Lenis/GSAP must not run during SSR. Wrap in a `mounted` gate.
2. **Double scroll systems.** source-code uses native scroll; ReliantAI uses Lenis. Do **not** import `SmoothScrollProvider` twice. One global Lenis + ScrollTrigger sync in `layout.tsx` only.
3. **Theme mismatch.** source-code forces `<html class="dark">`; current site supports light+dark. Decide and lock early to avoid class conflicts.
4. **Brand color.** Orange vs amber — normalize all CSS vars in one sweep (Phase 0) or you'll get mixed accents.
5. **Stripe webhook on Workers.** Keep the async `constructEventAsync` + `SubtleCryptoProvider` path (already done). Don't regress to sync verifier.
6. **Deploy target.** `source-code` currently targets Cloudflare Workers (opennext). `ReliantAI-website` targets Vercel. Choose **one** to avoid divergent configs; Cloudflare Workers needs `requireServerComponent`-safe deps (Three.js is client-only, fine).
7. **Bundle size.** Porting R3F/Three adds ~150–200 KB gz. Keep lazy-loading + desktop-only 3D + dpr capping from the current site.
8. **`force-dynamic` + `revalidate = 0`** in `layout.tsx`. Keep for CMS freshness but be aware it disables static caching — acceptable for a marketing + CRM site.
9. **Legal/SEO routes** must keep working (`/privacy-policy`, `/terms-of-service`, robots, sitemap).

---

## 7. Definition of Done (ultimate site)

- Full-stack business layer intact: Stripe checkout + portal + webhook, better-auth login/register/profile/admin, quote→lead→admin pipeline, CMS content.
- Premium experience layer ported: Lenis smooth scroll, GSAP reveals, 3D hero, pinned horizontal case-study story, immersive atmosphere/zones.
- Unified dark/industrial design system (single brand color + Teko/Manrope/JetBrains).
- Next-native SEO (Metadata + JSON-LD + semantic anchors) at parity with the Vite version.
- Passes: `next build`, lint, typecheck, Lighthouse, reduced-motion, mobile, full funnel tests.
- Both original repos preserved (no destructive deletion).

