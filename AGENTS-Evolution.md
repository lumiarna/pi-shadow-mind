# AGENTS Evolution

## Stable learnings

- 2026-09-04: Shadow-mind self-evolution should support direct updates to global AGENTS.md, project AGENTS.md, existing/new SKILL.md files, durable memory, and paired evolution logs. Evidence: user clarified the desired model during design discussion. Applied: global self-evolution skill and evolution shadow created outside the package source.
- 2026-09-04: Avoid generated regions inside AGENTS.md/SKILL.md; keep evolution evidence in paired logs and keep stable rule files clean. Evidence: user explicitly rejected marker-based generated blocks. Applied: use `AGENTS-Evolution.md` and `SKILL-Evolution.md` according to the owning stable file.
- 2026-09-04: Rule/log pairs must stay compact, around 5K tokens, through active distillation rather than append-only growth. Applied: encoded in the self-evolution skill.
- 2026-09-04: All-tools authorization must follow the live Main Session registry rather than duplicate a static list that silently drifts. Evidence: code-health shadow identified the mismatch after broad access was configured manually. Applied: `tools: ["*"]` wildcard resolution, tests, documentation, and the global self-evolution shadow definition.

## Candidates

- If future package releases should bundle a default self-evolution shadow, add package-level docs and tests rather than relying only on global configuration.

## Retired

- Proposal-only meta-shadow model; retired because the requested system should be able to write AGENTS.md and skills.
