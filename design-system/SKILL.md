---
name: spanish-quizzes-design
description: Use this skill to generate well-branded interfaces and assets for Spanish Quizzes, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Keep previous versions

When you significantly revise or rebuild a screen, UI kit, template or component, keep the previous version:

- Copy it to a sibling folder with a version suffix before editing (e.g. `ui_kits/spanish-quizzes-app-v1/`), or save the new work as `<Name> v2` next to the original.
- Never delete the old version as part of the same change. Only remove it when the user asks.
- Mark the old copy as superseded at the top of the file and link to the current version.
- Keep superseded copies out of the design system: no `@dsCard` or `@template` tag, and no `.d.ts` files, so they are not compiled or offered to consumers.
- List each archived version in `readme.md` under "Previous versions" with a one-line note on what changed.
