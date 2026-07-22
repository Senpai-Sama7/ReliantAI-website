# Playbook: Reliant AI agency homepage (T2)

## Job classification

- Verb: **feel** then **evaluate** (book a call)
- Visit: mostly **once**
- Content: **permanent** brand statement + rotating case proof

## Tier

**T2 cinematic scroll.** Lenis + GSAP pins/scrub allowed on the brand story only.
Forms, legal, and dense proof stay T0/T1. When in doubt, de-escalate.

## What god-tier means here

One unforgettable scroll story that proves taste. Restraint everywhere else.
This page is the studio's portfolio piece; median SaaS layout fails the job.

## Section order (refuse the average startup page)

Do **not** ship: hero → three feature cards → testimonials → pricing → CTA.

Preferred order:

1. Full-bleed brand hero (Reliant as hero-level signal; one thesis line; one CTA)
2. Industrial proof strip (named industries + Houston — not icon pills)
3. One pinned/scrubbed signature scene (process or case narrative)
4. Portfolio as editorial index (asymmetric; live iframes OK)
5. One long client or job story (specific outcome, not star ratings)
6. Services as indexed list or poster grid — never three equal cards
7. Contact with designed form states

## Identity lock (Reliant house)

| Token | Direction |
|-------|-----------|
| Accent | Brand orange `#ff6e00` — neutrals carry UI |
| Display | `Teko` uppercase industrial |
| Body | `Open Sans` |
| Atmosphere | Dark industrial / metal / oilfield honesty — not purple glow SaaS |
| Layout break | Asymmetry + full-bleed proof; never centered three-up feature grid |

Hard exclusions still apply from `SYSTEM.md` (no cream/terracotta cluster, no Inter-only, no glow stacks as identity).

## Motion budget

- Allowed: Lenis sync to ScrollTrigger; ≤1 pinned scrub scene (pin distance ≤ ~2000px); kinetic type on the thesis line only
- Forbidden: WebGL unless content earns T3; custom cursor; fade-in spam; pins on forms

## Interaction grammar

- Links: underline offset
- Primary CTA: solid orange, visible focus ring
- Scroll: one signature scene; CSS or GSAP elsewhere only when it carries meaning
- `prefers-reduced-motion`: static path first; Lenis off

## Output

React sections under `src/sections/*` wired in `App.tsx`. Register ScrollTrigger once; `gsap.context` + cleanup. Keep portfolio demos in `public/portfolio/*` as separate T1 identities.
