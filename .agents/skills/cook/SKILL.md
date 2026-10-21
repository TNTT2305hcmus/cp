---
name: cook
description: Implement features and code changes in this React/Vite competitive-programming learning platform. Use for building, adding, fixing, refactoring, or production-hardening working code; do not use for explanation-only, brainstorming, or review-only requests.
---

# Implement in the existing project

Deliver a working, verified change that fits the current architecture. Inspect nearby code and the working tree first, preserve unrelated user changes, and make the smallest coherent change that satisfies the request.

## Sources of truth

- Follow `AGENTS.md` for coaching behavior and CP correctness.
- For lessons, tests, month overviews, or visualizers, read `docs/TEMPLATE_LESSON.md` completely before editing. Use `docs/ROADMAP.md` and `docs/PLANNING.md` to resolve IDs, sequencing, and exercises.
- Reuse `src/components`, `src/components/lesson`, existing types, and the closest completed lesson before introducing new abstractions.
- Preserve the React 19 + TypeScript + Vite 8 + Tailwind CSS 4 stack unless the user explicitly requests a migration.

## Implementation invariants

- Keep learner-facing Vietnamese UTF-8 text intact.
- Keep lesson data separate from rendering where the surrounding feature already follows that pattern.
- Visualizer state must be deterministic: derive a complete `Step[]` from input, render one step, support reset/back/play-pause/forward, stop at the last step, and clean up timers.
- Preserve accessibility: semantic controls, keyboard access, visible focus, adequate contrast, `aria-live` for changing explanations, and reduced-motion behavior where animation is used.
- Treat algorithm code as CP code: derive allowed Big-O from constraints, prove the invariant, cover boundary cases, and avoid overflow or off-by-one errors.
- Keep public assets compatible with Vite's configured base path. Do not assume deployment at `/`.
- Do not add a backend, authentication, router, state library, or dependency unless the requested outcome requires it.

## Verification

Verify in proportion to risk:

1. Run the narrowest relevant checks while iterating.
2. Run `npm.cmd run lint` and `npm.cmd run build` on Windows before completion.
3. For deployment work, also build with the intended base path and inspect the generated artifact for broken root-relative URLs.
4. Review the final diff for unrelated edits, encoding damage, stale imports, and lesson registration gaps in `src/App.tsx` and `src/data/roadmapData.ts`.

If a check cannot run, report the exact reason and what remains unverified. Do not claim completion from inspection alone when executable verification is available.

## Request

<request>$ARGUMENTS</request>
