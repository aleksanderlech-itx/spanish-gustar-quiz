Use `BoardTile` for every activity on the board home: one pinned tile, then a 2-up grid.

```jsx
<BoardTile variant="pinned" title="Preterite vs Imperfect" todayCorrect={3} todayTotal={10} dailyPercent={30} completed={12} total={60} />
<BoardTile variant="due" kind="deck" title="Spanish Verb Flashcards" due={12} mastered={41} total={500} todayCorrect={8} todayTotal={20} />
<BoardTile variant="quiet" title="Por vs Para" percent={92} todayDone />
```

Only pinned and due tiles carry the 4px offset; quiet tiles sit flat on `--panel-soft`.
