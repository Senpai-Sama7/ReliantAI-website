# Playbook: Houston home-service contractor (T1)

## Job classification

- Verb: **buy** (call / book) with a trust beat first
- Visit: mostly **once**
- Content: mostly **permanent** + seasonal promo slots

## Tier

**T1 editorial motion.** CSS scroll-driven reveals. One accent moment max.
No Lenis pins, no WebGL, no custom cursors.

## Section order (refuse the SaaS formula)

Do **not** ship: hero → three feature cards → testimonials → pricing → CTA.

Preferred order:

1. Full-bleed hero (brand + outcome headline + one sentence + call CTA)
2. Trust strip as typography/NAP — not icon pills
3. Services as asymmetric list or editorial index (not equal cards)
4. Proof: one long quote or job story with neighborhood name
5. Pricing transparency OR "how we quote" (pick one; be specific)
6. Service area / license / insurance
7. Contact / emergency — form states designed

## Identity locks (pick one per brand; never share across demos)

Each Reliant portfolio demo must fail the "swap the logo" test against the others.

| Brand | Atmosphere | Display + body | Accent logic |
|-------|------------|----------------|--------------|
| Plumbing | Wet slate, copper, paper white | `Newsreader` + `IBM Plex Sans` | Copper `#b87333` on cool gray |
| Electrical | Blueprint black, hazard mark | `Syne` + `IBM Plex Mono` | Signal yellow `#f5c518` on `#0c0d10` |
| HVAC | Cool steel day, warm dusk accent | `Archivo` + `Source Serif 4` | Steel `#3d4f5f` + single heat accent `#d97706` — **never cream/terracotta base** |

## Copy requirements

- Headline fits only this trade in Houston
- Include: license placeholder, insurance, service cities (Katy, Sugar Land, The Heights, etc.)
- Emergency phone as `tel:` link above the fold on mobile
- Ban buzzword list from SYSTEM.md

## Interaction grammar (one system)

- Text links: underline offset on hover
- Buttons: solid fill, 2px focus ring in accent
- Reveals: `animation-timeline: view()` opacity/translateY once
- Reduced motion: reveals disabled

## Output stack

Single-file vanilla HTML in `public/portfolio/[slug]/index.html` for iframe demos.
Semantic landmarks, JSON-LD LocalBusiness optional but preferred.
