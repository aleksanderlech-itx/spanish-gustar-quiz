# Learning content sources

Spanish-English sentence pairs used by quizzes and flashcards come from two
royalty-free sources. The generator selects unchanged pairs from the Tatoeba
Project corpus distributed by ManyThings. It uses original pairs where an
unchanged corpus sentence would not preserve the exercise's exact grammar
target. Those original pairs are published under CC BY 4.0.

- Source: https://www.manythings.org/anki/
- Upstream: https://tatoeba.org/
- License: CC BY 2.0 France
- License text: https://creativecommons.org/licenses/by/2.0/fr/deed.en
- Corpus snapshot used: `spa-eng.zip`, dated 2026-02-13

Original sentence pairs:

- Author: Spanish Editorial Learning
- Project: https://github.com/aleksanderlech-itx/spanish-gustar-quiz
- License: CC BY 4.0
- License text: https://creativecommons.org/licenses/by/4.0/

The 500-verb ranking comes from FrequencyWords:

- Source: https://github.com/hermitdave/FrequencyWords
- Content license: CC BY-SA 4.0

Each unchanged Tatoeba row retains both sentence IDs and contributor names.
Each original row names the project author and its CC BY 4.0 license. The public
manifest (`docs/content-attribution.csv`, also served from `public/`) records the
source, license and modification status of every runtime sentence pair. The
corpus itself is research input and is not committed to this repository.

## Regenerating

The generator needs no outside file:

```
node --experimental-strip-types scripts/build-sourced-content.mjs
```

Every corpus pair in use is pinned in `scripts/pinned-corpus-pairs.mjs`, and its
text is recorded in `docs/content-attribution.csv`. The generator reads that
record back, so the manifest is both its output and its memory of past corpus
picks. Do not delete the manifest or edit it by hand.

`npm test` runs the generator with `--check`
(`tests/generated-content.test.mjs`), which fails when a generated file was
edited by hand or a source table changed without a new run.

New sentences should be original pairs, added to the override table of their
activity. The corpus file is needed only to pick a new, unchanged Tatoeba
sentence for an item that has no override and no pin:

```
curl -sSLO https://www.manythings.org/anki/spa-eng.zip
unzip spa-eng.zip spa.txt -d /tmp/corpus
node --experimental-strip-types scripts/build-sourced-content.mjs /tmp/corpus/spa.txt
```

The generator prints the pin for each new pick. Add it to
`scripts/pinned-corpus-pairs.mjs` in the same change, so the pick is recorded
and later runs do not need the corpus. Any snapshot works for new picks; the
pairs chosen before November 2026 came from the 2026-02-13 snapshot. Pinning
also means that changing one item's source never shifts the sentence another
item or flashcard gets.

Tatoeba warns that community data can contain mistakes. Every selected pair
must therefore pass the automated content checks and a human-language review
before release.
