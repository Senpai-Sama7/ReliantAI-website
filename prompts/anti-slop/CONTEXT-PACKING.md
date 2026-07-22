# Context injection order (from Agentic Practitioner Playbook)

Use when loading anti-slop prompts into an agent. Ordering is mechanistic.

## Budget allocation (approximate)

| Layer | Budget | What |
|-------|--------|------|
| System | ≤10% | `SYSTEM.md` hard bans + identity |
| Task | ≤15% | Filled `MASTER-BRIEF.md` + tier from `ROUTER.md` |
| Playbook | ≤15% | One playbook file only (e.g. houston-contractor-t1) |
| Retrieved | ≤40% | Brand facts, photos, NAP, prior approvals |
| Working | ≤20% | Current phase from `phases/SEQUENCE.md` |
| Output | ≤15% | Reserved for generation |

## Injection order

1. **Primacy:** SYSTEM.md
2. **Early:** ROUTER output + locked DESIGN DIRECTION
3. **Middle:** Playbook + brand facts (Select: only this trade)
4. **Recency:** Current phase prompt + approved storyboard/inventory
5. **Final:** User instruction for this turn only

## Strategies

- **Write:** Persist approved identity locks and Motion Scripts outside the chat
- **Select:** Load one playbook; do not dump the whole Master Guide
- **Compress:** Prefer SYSTEM.md over pasting the 900-line guide verbatim
- **Isolate:** Separate agents/phases for hero vs sections vs audit

## Anti-patterns

- Monolithic "build the whole site" prompts
- Loading T2/T3 motion docs for a T1 contractor page
- Mixing three portfolio brand identities in one context window
