# Anti-slop prompts for Reliant AI

Use these files when generating or revising marketing surfaces so output does not
collapse to 2026 AI defaults.

## Start here

1. `SYSTEM.md` — pinned bans + invariants
2. `ROUTER.md` — classify job, pick tier
3. `playbooks/*.md` — use-case craft budget (one file only per run)
4. `identity-locks/*.md` — Write: persist brand tokens outside chat
5. `MASTER-BRIEF.md` — fill every bracket
6. `CONTEXT-PACKING.md` — injection order + budgets (no context rot)
7. `phases/SEQUENCE.md` — build one phase at a time
8. `AUDIT.md` — anti-slop + tier excellence gate
9. `PEEM.md` — structural/output eval + hill-climb loop

## Source material

- Master Guide: anti-AI-slop cinematic websites (audited 2026-07-17)
- Context engineering patterns: [Agentic Practitioner Playbook](https://context-engineering-site.vercel.app)
  (5-layer context, write/select/compress/isolate, PEEM-style gates)

## Portfolio demos

Houston contractor demos in `public/portfolio/*` follow
`playbooks/houston-contractor-t1.md` plus the matching `identity-locks/*` file.
Never load more than one identity lock into a single generation context.

Agency homepage work uses `playbooks/agency-homepage-t2.md`.
