# Phase prompts (decision-first workflow)

Never generate the whole product at once. Approve each phase.

## 1. Route + lock identity

```
Run prompts/anti-slop/ROUTER.md for this project.
Return JOB / TIER / PLAYBOOK / MOTION ALLOWED / FORBIDDEN.
Then lock DESIGN DIRECTION: OKLCH token table, type pairing + justification,
section order, one named symmetry break. No code yet.
```

## 2. Foundation only

```
Implement design tokens only (CSS variables / @theme).
Fonts wired with font-display: swap.
No components. No indigo/blue identity leftovers.
```

## 3. Hero / first viewport only

```
Build ONLY the first viewport.
Brand is hero-level. One headline, one sentence, one CTA group, one dominant visual.
Full-bleed / edge-to-edge visual plane. No cards, badges, stat strips, or overlays.
Show alone before continuing.
```

## 4. Scene / section N only

```
Build section [N]: [purpose].
Reuse the locked identity. One job, one headline, one short supporting sentence.
Describe how it connects to section N+1 before coding.
```

## 5. Polish

```
Fix ease-in-out spam, non-compositor animation, CLS, buzzwords,
off-palette gradients, missing form/data states, weak focus rings.
```

## 6. God-tier gate

```
Run prompts/anti-slop/AUDIT.md against codebase + rendered output.
Fix every violation. Do not add techniques above the declared tier.
```
