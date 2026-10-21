---
name: frontend-design
description: Design or restyle interfaces for this competitive-programming lesson platform while preserving its established educational design system. Use for pages, lesson components, visualizers, responsive layout, interaction polish, or accessibility-focused UI changes.
---

# Design for learning clarity

Create production-quality interfaces that feel like one coherent CP learning product. The goal is rapid comprehension and deliberate practice, not visual novelty for its own sake.

Before changing a lesson or visualizer, read `docs/TEMPLATE_LESSON.md` completely. It overrides generic design preferences. Inspect the closest existing component and reuse shared primitives from `src/components` and `src/components/lesson`.

## Established visual language

- Support the current light-first interface and dark IDE mode rather than inventing a separate theme.
- Use the established typography: Inter or Roboto for prose and JetBrains Mono or Fira Code for code.
- Preserve the semantic accent mapping: cyan for pointer/state A, amber for pointer/state B, fuchsia for the active item, emerald for success, and rose for invalid states.
- Prefer a readable single-column lesson flow, restrained cards, thin borders, stable layouts, and compact metadata.
- Use the installed Lucide icon set. Do not add decorative emoji or another icon library.
- Avoid purple-gradient AI styling, excessive glass effects, animated decoration, oversized hero copy, and motion that competes with algorithm state.

## Interaction quality

- Make each control's state and affordance obvious at keyboard, touch, and desktop sizes.
- Preserve WCAG AA contrast, visible focus states, semantic labels, and `aria-live="polite"` for step explanations.
- Keep array cells and graph nodes spatially stable while values, borders, and state colors change.
- Respect `prefers-reduced-motion`; educational meaning must not depend on animation alone.
- On small screens, preserve algorithm state and primary controls before secondary prose or metadata.

## Final design check

Confirm visual hierarchy, responsive behavior, both themes, focus order, loading/empty/error states, and consistency with neighboring lessons. Run the project's lint and production build after implementation.
