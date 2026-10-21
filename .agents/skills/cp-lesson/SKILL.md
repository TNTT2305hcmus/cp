---
name: cp-lesson
description: Create or substantially update an interactive competitive-programming lesson, month overview, practice set, or contest test in this repository. Use when work combines algorithm pedagogy, curriculum data, React lesson UI, and an interactive visualizer.
---

# Build a complete CP lesson

Use this skill together with `cook` for lesson implementation and with `frontend-design` for the interface. This skill owns lesson-specific curriculum and pedagogy decisions.

## Read before editing

1. Read `docs/TEMPLATE_LESSON.md` completely; it is authoritative.
2. Find the requested ID in `docs/ROADMAP.md`, `docs/PLANNING.md`, and `src/data/roadmapData.ts`.
3. Inspect the closest completed lesson, its `.data.tsx` file, its visualizer, and shared lesson components.

Do not invent a lesson ID, exercise list, difficulty, or prerequisite when project documents define it. If sources conflict, follow `docs/TEMPLATE_LESSON.md` for structure and flag curriculum conflicts before choosing silently.

## Lesson outcome

- Start with data limits and derive the target Big-O.
- Show why brute force fails using concrete operation counts.
- State one memorable core rule and one loop invariant.
- Give a short correctness proof: initialization, maintenance, termination.
- Include recognition signals, when not to use the technique, and the nearest confusing pattern.
- Cover applicable CP failure cases: minimal input, duplicates, negatives, sorted or reversed data, overflow, and off-by-one boundaries.
- Provide clean C++20 first, then Python and TypeScript when required by the lesson specification.
- Order practice as Warm-up -> Core Pattern -> CP Twist/Hard with three progressive hint tiers and no immediate full-solution reveal.

## Visualizer contract

- Put simulation logic in a pure step builder instead of calculating transitions during render.
- Each step exposes algorithm state plus `observation`, `decision`, and `reason`.
- Provide representative success, no-solution, and boundary datasets or validated custom input.
- Support reset, back, play/pause, forward, speed control, keyboard controls, final-step stop, and timer cleanup.
- Keep visual positions stable, announce changes accessibly, and preserve meaning with reduced motion enabled.

## Integration and verification

- Reuse shared lesson sections and types; keep content data separate where the project pattern supports it.
- Register the lesson in `src/App.tsx` and keep `hasInteractiveLesson`, progress IDs, next-lesson navigation, and roadmap metadata consistent.
- Validate sample traces and code against a brute-force oracle when practical.
- Run `npm.cmd run lint` and `npm.cmd run build`, then inspect mobile and desktop layouts in both themes when UI tooling is available.

## Lesson

<lesson>$ARGUMENTS</lesson>
