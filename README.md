# buzz-night

A party quiz game. One self-contained `index.html`, no build step.

Live: https://pauljepson1983-sketch.github.io/buzz-night/

**Every push to `main` republishes the live site.** There is no staging copy,
so a push is a live change.

## Adding questions

Written questions live in `questions.js`, next to `index.html`. That is the
only file to edit — the game reads it at run time, so a new category needs no
change to `index.html`.

It holds three things:

| | |
|---|---|
| `window.QUESTIONS` | multiple choice, four options — the **Fastest finger** round |
| `window.CLOSEST` | number facts in templated categories — the **Closest wins** round |
| `window.CLOSEST_ONEOFFS` | one-off numbers whose units differ per question |

After editing, run:

```bash
node tools/check-questions.js
```

It prints what the bank holds and anything structurally wrong with it. It
**cannot** tell you whether a fact is true — that is still a person's job.
What it does catch:

- the same question written twice
- the answer sitting inside its own question
- a "wrong" option that is really the answer again
- wording that will be out of date in a year ("currently", "latest")
- the length tell — if the right answer is visibly the longest option, people
  guessing just pick the long one
- units that disagree between the bank and the game
- one round giving away another, e.g. Fastest finger asking "which centre
  opened in 1986?" when Closest wins asks "what year did the Metrocentre
  open?"

The last two are there because both bugs actually shipped.

## After a push

Browsers cache `index.html` hard. A normal reload can still serve the old
game — use `Ctrl+Shift+R` on a laptop, or pull-to-refresh on a phone.
