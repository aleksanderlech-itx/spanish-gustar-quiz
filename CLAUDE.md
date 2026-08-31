# Working agreement: git & deployment

The user (aleksander.lech@itixo.com) works from Linux, Windows, the desktop
app, and mobile — this file is the source of truth for workflow rules in
every session, since local settings don't follow across devices.

## Branching

- `main` = production (deploys to https://spanish-quizz.es)
- `staging` = staging (deploys to https://staging.spanish-quizz.es)
- Feature work happens on a branch off `staging`, merged via PR.

## Rules

1. **Commit after every meaningful change.** Don't batch unrelated work into
   one commit; don't leave finished work uncommitted at the end of a turn.
2. **Open a PR for changes and share the preview link.** Every PR into
   `staging` or `main` gets an automatic preview Worker deployment
   (`.github/workflows/pr-preview.yml`), which comments the preview URL on
   the PR. Tell the user the PR link and the preview link once it's up —
   don't just say "pushed."
3. **Never deploy to production without an explicit greenlight.** The
   `Deploy Production` workflow (`.github/workflows/deploy-production.yml`)
   is `workflow_dispatch`-only — merging to `main` does NOT auto-deploy.
   Only trigger it (or ask the user to) after they explicitly say to ship
   to prod in that conversation. A prior approval does not carry over to a
   later, unrelated change.
4. **Delete obsolete/merged branches.** `.github/workflows/branch-cleanup.yml`
   auto-deletes a PR's head branch once merged. If you create a branch that
   ends up abandoned (superseded, closed without merging), delete it
   yourself once you're done with it.
