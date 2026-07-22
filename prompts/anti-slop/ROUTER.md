# Universal Router (run before any design decision)

## Step 1 — Classify the job

1. **Primary user verb:** feel / evaluate / buy / read / do
2. **Visit frequency:** once (impress) vs daily (respect time)
3. **Content half-life:** permanent brand vs changing data

## Step 2 — Pick the execution tier

| Tier | Name | Motion budget | Wins for |
|------|------|---------------|----------|
| **T0** | Static craft | CSS transitions only | Docs, dashboards, checkout, legal |
| **T1** | Editorial motion | CSS scroll-driven reveals, one accent | Local business, SaaS marketing, e-com browse |
| **T2** | Cinematic scroll | Lenis + GSAP pins/scrub | Campaign, portfolio, brand homes |
| **T3** | Immersive world | T2 + justified WebGL/video | Award pushes, product-as-experience |

Rules: when in doubt, pick the lower tier and execute it perfectly.
Escalate only when content earns it. De-escalate for forms, daily tools, low-end devices.

## Step 3 — Reliant AI default playbooks

| Use case | Tier | Spend craft on |
|----------|------|----------------|
| Houston contractor marketing site | **T1** | Real trust signals, NAP/SEO, emergency CTA, asymmetric layout, CSS reveals |
| Reliant AI agency homepage | **T2** | One signature scroll story; restraint elsewhere |
| Docs / legal / settings | **T0** | Reading speed, focus, zero jank |

## Output before code

```
JOB: [verb] / [once|daily] / [permanent|changing]
TIER: T[0-3]
PLAYBOOK: [row]
MOTION ALLOWED: [list]
MOTION FORBIDDEN: [list]
IDENTITY LOCK: color tokens + type pairing + one layout break
```
