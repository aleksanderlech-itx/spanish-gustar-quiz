# 0010. One schema version for stored data, upgraded in one place

- Status: Accepted
- Date: 2026-11-21
- Source: issues #161 and #141

## Context

Progress lives in the learner's browser for months, and a backup file can be
restored long after it was made. The backup wrote `version: 1` and nothing
read it. Each module migrated its own data (notebook v1 to v2, the legacy
flashcard key, the streak counter v1 to v2), and import wrote whatever a file
held without checking it. Several planned changes alter stored shapes: the
base question type (#152), Sentence Builder (#72), the board choice (#117)
and numeric flashcard ids.

## Decision

1. `app/stored-data.ts` owns one schema version for everything in browser
   storage (`SCHEMA_VERSION`), the shape check for every key a backup carries
   (`BACKUP_KEYS`), and the upgrade steps.
2. The data the code read on 2026-11-21 is schema 1, including what the
   existing per-module readers already convert. Those readers stay as they
   are. A device without `spanish-quiz-schema-version`, and a backup without a
   version or with `version: 1`, is schema 1.
3. To change a stored shape:
   - raise `SCHEMA_VERSION` by one;
   - add `STEPS[old]`, a pure function from the old snapshot to the new one;
   - update the key's shape check in `BACKUP_KEYS`, and add any new key there;
   - add a test that upgrades a fixture of the old shape, keeping
     `tests/fixtures/storage-2026-11.json` restorable.
   Never change a shape without a step.
4. The same steps run on page load (`StoredDataUpgrade` in the root layout,
   before any reader) and on restore, so a device and an old backup end up in
   the same shape.
5. Import checks the whole file before writing anything: a known version, at
   least one recognised key, every recognised key in the expected shape. A
   newer version is refused with its own message. After the user confirms, the
   backup replaces what is stored: keys it lacks are cleared.
6. Backup and reset cover progress and settings (quiz round length, answer
   mode, filters, flashcard difficulty). One-off screen flags (tutorial,
   celebration) stay out. Reset and restore also clear the legacy flashcard
   key so it cannot be migrated back in.

## Consequences

- An old backup restores into new code converted, or is refused with a clear
  message; it can no longer leave a mix of old and new data.
- Every new stored key must be added to `BACKUP_KEYS` with a shape check, or
  it is neither backed up nor reset.
- A device that has run a newer build and then gets an older one (a rollback)
  keeps its newer stamp and is not upgraded again.
