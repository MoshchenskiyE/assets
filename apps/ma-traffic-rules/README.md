# RoadReady MA 🚗

A **free**, Duolingo-style course for learning **Massachusetts driving rules**.
Bite-sized lessons on a gamified learning path — earn XP, keep a streak, and
don't run out of hearts!

> ⚠️ **Educational use only — not legal advice.** Content is summarized from the
> Massachusetts Driver's Manual (RMV), the Massachusetts General Laws
> (Chapters 85, 89 & 90), and 720 CMR. Always verify against the official
> [Massachusetts RMV](https://www.mass.gov/rmv).

## Features

- 🗺️ **Learning path** — 13 lessons across 4 themed units, with locked/unlocked
  nodes just like a language-learning app.
- 🎮 **Gamified** — XP, day streak, and a 5-heart lives system (hearts refill
  over time). Lose all your hearts and the lesson resets.
- ✅ **Instant feedback** — answer, check, and learn why, with the green/red
  feedback dock and a celebratory completion screen + confetti.
- 📖 **Quick Reference** — tap any topic to pop open the underlying rules with
  statute citations.
- 💾 **Saves your progress** locally (localStorage) — works fully offline.
- 🚀 **Zero dependencies, no build step, no tracking, no cost.**

## Run it

It's a static site. Open `index.html` in a browser, or serve the folder:

```bash
cd apps/ma-traffic-rules
python3 -m http.server 8000   # then visit http://localhost:8000
```

### Single-file version (best for phones)

`ma-traffic-rules-standalone.html` bundles the CSS, JS, and course data into one
file — open it directly in any mobile browser, no server or network needed.

## Files

| File                              | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `index.html`                      | App shell (top bar, screens, modal)                |
| `styles.css`                      | Duolingo-inspired design system                    |
| `app.js`                          | Path, lesson engine, XP/hearts/streak, persistence |
| `data.js`                         | Course content: units → lessons → questions        |
| `ma-traffic-rules-standalone.html`| Single-file build for offline / mobile use         |

## Updating the content

All course content lives in `data.js` as `UNITS → lessons → questions`. Add a
lesson by appending to a unit's `lessons` array; add a question by appending to a
lesson's `questions` array (`answer` is the 0-based index of the correct option).
Then rebuild the standalone file if you use it.
