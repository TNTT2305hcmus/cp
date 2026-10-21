---
name: review-code
description: Review existing changes in this CP learning platform for correctness, pedagogy, React quality, accessibility, and deployment fit. Use for diffs, commits, branches, PRs, or files when the user wants judgment rather than fixes.
---

# Evidence-first review

Review only; do not modify files. Identify the explicit target first, otherwise use changes made in the conversation or the current working diff. Read surrounding code and the applicable specification before judging intent.

For lesson-related changes, read `docs/TEMPLATE_LESSON.md` and matching entries in `docs/ROADMAP.md` or `docs/PLANNING.md`.

## Review priorities

1. Correctness: algorithm invariant, complexity, overflow, indexing, duplicates, empty inputs, timer boundaries, stale state, and cleanup.
2. Pedagogy: constraints-first framing, brute-force contrast, progressive hints, proof, edge cases, and no premature solution spoilers.
3. Integration: lesson IDs, navigation registration, progress keys, shared types/components, and consistency between lesson data and UI.
4. React quality: derived state, hook dependencies, deterministic step generation, render stability, and unnecessary rerenders.
5. UX and accessibility: keyboard controls, semantic labels, focus, contrast, responsive layout, `aria-live`, and reduced motion.
6. Production fit: Vite base-path safety, bundle impact, localStorage failure handling, external runtime dependencies, and CI/build behavior.

Run read-only checks when they materially strengthen the review. A passing build does not prove algorithmic or pedagogical correctness.

## Report format

Lead with findings ordered by severity. Every finding must include a clickable file and line, the observable failure or risk, and why it matters.

- Critical: broken correctness, data loss, security, inaccessible core flow, or failure to build/deploy.
- Major: likely wrong behavior, violated lesson specification, serious performance issue, or missing integration.
- Minor: localized quality or maintainability issue worth fixing.
- Question: material intent cannot be established from available evidence.

After findings, provide a verdict (`Approve`, `Request changes`, or `Reject`) and a short summary. If there are no findings, say so explicitly and mention remaining verification gaps.

## Target

<target>$ARGUMENTS</target>
