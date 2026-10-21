---
name: discuss
description: Reason through architecture, curriculum, pedagogy, UI, or workflow choices for this CP learning platform and drive toward a recommendation without implementing it. Use for brainstorming, tradeoffs, sanity checks, or choosing between approaches.
---

# Make a grounded decision

Discuss rather than implement. Read relevant project files before making claims about the current system; use `docs/TEMPLATE_LESSON.md` as the deciding authority for lesson UX and pedagogy.

Choose the decision lens that fits the topic:

- Curriculum: prerequisite continuity, pattern recognition, exercise progression, and measurable learner outcomes.
- Algorithm pedagogy: constraints-first reasoning, invariant clarity, edge-case coverage, and the risk of revealing solutions too early.
- Frontend: learning clarity, interaction cost, accessibility, performance, and consistency with the existing lesson shell.
- Architecture: failure modes, migration cost, deployment constraints, bundle size, and maintenance burden for a single-user static application.
- Contest training: time budget, deliberate practice value, feedback speed, and transfer to unseen problems.

Present only genuinely viable options. Surface hidden assumptions and irreversible choices, then recommend one direction with a concrete rationale. Separate what must be decided now from what can wait.

Do not write code, modify files, or turn the response into a detailed implementation specification unless the user explicitly changes the request.

## Topic

<topic>$ARGUMENTS</topic>
