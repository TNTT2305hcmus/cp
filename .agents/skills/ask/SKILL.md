---
name: ask
description: Explain this CP learning platform's code, architecture, algorithms, or technical tradeoffs without changing files. Use when the user wants to understand why or how something works; do not use for implementation, debugging, planning, or code review.
---

# Explain from verified project evidence

Read the relevant source before answering. For project-wide questions, inspect the smallest useful set among `package.json`, `vite.config.ts`, `src/App.tsx`, shared components, lesson data, visualizers, and `docs/`.

Distinguish verified behavior from inference. Verify current library or platform behavior from primary documentation when it could have changed.

## Project context

- The application is a client-only React 19, TypeScript, Vite 8, and Tailwind CSS 4 site.
- Lesson navigation currently lives in React state; progress and theme live in `localStorage`.
- `docs/TEMPLATE_LESSON.md` is the authoritative lesson specification. `docs/ROADMAP.md` and `docs/PLANNING.md` define curriculum scope.
- GitHub Pages deployment uses a repository subpath, so root-relative asset behavior is relevant when explaining deployment.

For algorithm questions, lead with constraints and target complexity, then explain the invariant, edge cases, and CP-specific implementation tradeoffs. Do not reveal a full solution when the user asks for a hint; follow the three-tier hint model in `AGENTS.md`.

## Boundary

Explain only. Do not edit files, provide implementation patches, or silently turn the question into a review. Small illustrative pseudocode is acceptable only when necessary to explain an algorithm and when it does not bypass the requested hint level.

## Question

<question>$ARGUMENTS</question>
