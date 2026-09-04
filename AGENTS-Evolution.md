# AGENTS Evolution

## Stable learnings

- 2026-09-04: Shadow-mind self-evolution should support direct updates to global AGENTS.md, project AGENTS.md, existing/new SKILL.md files, durable memory, and paired evolution logs. Evidence: user clarified the desired model during design discussion. Applied: global self-evolution skill and evolution shadow created outside the package source.
- 2026-09-04: Avoid generated regions inside AGENTS.md/SKILL.md; keep evolution evidence in paired logs and keep stable rule files clean. Evidence: user explicitly rejected marker-based generated blocks. Applied: use `AGENTS-Evolution.md` and `SKILL-Evolution.md` according to the owning stable file.
- 2026-09-04: Rule/log pairs must stay compact, around 5K tokens, through active distillation rather than append-only growth. Applied: encoded in the self-evolution skill.
- 2026-09-04: All-tools authorization must follow the live Main Session registry rather than duplicate a static list that silently drifts. Evidence: code-health shadow identified the mismatch after broad access was configured manually. Applied: `tools: ["*"]` wildcard resolution, tests, documentation, and the global self-evolution shadow definition.
- 2026-09-04: Tag-driven automation owns validation and formal release artifacts; local release work should only prepare a versioned commit and push its matching tag. Evidence: the user found the local eight-step packaging and repeated validation procedure unnecessarily long after release automation was established. Applied: local instructions delegate verification, building, packing, smoke tests, checksums, OIDC publishing, and GitHub Release creation to the workflow.
- 2026-09-04: Release latency optimization must preserve the security boundary of the privileged publish job. Evidence: the latest release spent 204 of 234 job seconds in `npm ci`, but restoring a shared dependency cache in the OIDC-enabled workflow triggered zizmor's cache-poisoning error. Applied: retain cache isolation, install from the lockfile with lifecycle scripts/audit/funding work disabled, and run verification and build concurrently.

## Candidates

- If future package releases should bundle a default self-evolution shadow, add package-level docs and tests rather than relying only on global configuration.

## Retired

- Proposal-only meta-shadow model; retired because the requested system should be able to write AGENTS.md and skills.
- The local Delivery quality gate requiring full typecheck, tests, build, and project-wide diagnostics on every delivery; retired by explicit user instruction because its recurring time cost outweighed its value. Release tags remain protected by the complete automated workflow, while ordinary work may use task-proportionate verification.
- Shared npm caching inside the privileged release workflow; retired because cached runtime inputs can cross the OIDC publishing boundary and zizmor correctly flags the resulting cache-poisoning path.
