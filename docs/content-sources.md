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
manifest records the source, license and modification status for all 1,400
runtime sentence pairs. The corpus itself is research input and is not committed
to this repository.

To regenerate, download the snapshot and run the generator on `spa.txt` (it
checks the SHA-256):

```
curl -sSLO https://www.manythings.org/anki/spa-eng.zip
unzip spa-eng.zip spa.txt -d /tmp/corpus
node --experimental-strip-types scripts/build-sourced-content.mjs /tmp/corpus/spa.txt
```

Every corpus-sourced item is pinned to its row in
`scripts/pinned-corpus-pairs.mjs`, so changing one item's source never shifts
the sentence another item or flashcard gets.

Tatoeba warns that community data can contain mistakes. Every selected pair
must therefore pass the automated content checks and a human-language review
before release.
