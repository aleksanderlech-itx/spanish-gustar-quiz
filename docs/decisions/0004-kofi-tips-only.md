# 0004. Ko-fi is for tips only

- Status: Accepted
- Date: 2026-10-18
- Source: Aleksander, docs and content audit of 2026-10-18 (PR link added when
  opened)

## Context

The app is free, needs no account and has no paid tier. The Facebook page plan
described Ko-fi as having monthly membership tiers with member-only posts and
perks. That does not match the real setup, and public copy built on it would
mislead visitors.

## Decision

Ko-fi is used for one-time tips that support development. There are no
membership tiers, no member-only content and no perks. No copy, post, doc or
UI text may describe any.

## Consequences

- The Facebook page plan and any social content must drop the membership
  wording.
- Support prompts (results screen, menu, footer) stay worded as an optional
  tip, as they are now.
- If membership is ever introduced, add a new record that supersedes this one
  before any copy changes.
