# RoadReady MA 🚗

The **free**, beautiful way to ace the **Massachusetts permit test** — a
Duolingo-style course plus a real-format exam simulator, road signs, and
progress tracking. Designed to beat the paid App Store leaders (see
[`ANALYSIS.md`](./ANALYSIS.md)).

## What's inside

- 🏠 **Learn** — bite-sized lessons on a gamified path with XP, streaks and hearts.
- 📝 **Exam Simulator** — the real MA RMV format: **25 questions, 25-minute
  timer, pass at 18/72%**, with a full answer review at the end. Plus a
  **Quick Practice** (10 Q, instant feedback) for low-stakes study.
- 🏅 **Achievements** — 9 unlockable badges with celebratory toasts.
- 📲 **Installable PWA** — add to your home screen; a service worker caches the
  app shell for true offline use (when served over http/https).
- 🛑 **Road Signs** — crisp vector signs (regulatory / warning / guide) with a
  tap-to-learn gallery and a "Test Me" recognition quiz.
- 🎯 **Smart Review** — every missed question is remembered for one-tap practice.
- 👤 **Profile** — daily-goal ring, streak/XP/lesson KPIs, mastery-by-unit bars,
  and settings: **Dark Mode**, sound effects, and haptics.
- 📱 Native-app feel: bottom tab bar, 60 fps animations, confetti, safe-area
  insets, reduced-motion + accessibility support.
- 💾 Saves on-device · works fully offline · **no ads, no account, no paywall.**

> ⚠️ **Educational use only — not legal advice.** Content is summarized from the
> Massachusetts Driver's Manual (RMV), the Massachusetts General Laws
> (Chapters 85, 89 & 90), and 720 CMR. Always verify against the official
> [Massachusetts RMV](https://www.mass.gov/rmv).

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

| File                              | Purpose                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| `index.html`                      | App shell: top bar, tab screens, overlays, modals          |
| `styles.css`                      | Design system + Dark Mode, bottom nav, exam/signs/profile  |
| `app.js`                          | Tabs, multi-mode quiz engine, signs, profile, FX, storage  |
| `data.js`                         | Content: units → lessons → questions, road signs, exam pool |
| `ma-traffic-rules-standalone.html`| Single-file build for offline / mobile use                 |
| `manifest.json` · `sw.js` · `icon.svg` | PWA: installability + offline service worker          |
| `ANALYSIS.md`                     | Competitive analysis & UX strategy                         |

## Updating the content

All content lives in `data.js`: course as `UNITS → lessons → questions`, plus
`SIGNS` and an `EXTRA_QUESTIONS` pool the Exam Simulator draws from (`answer` is
the 0-based index of the correct option). Then rebuild the standalone file:

```bash
# regenerates ma-traffic-rules-standalone.html from the source files
node -e 'const fs=require("fs");let h=fs.readFileSync("index.html","utf8");h=h.replace(/\s*<link rel="stylesheet" href="styles.css" \/>/,"\n<style>\n"+fs.readFileSync("styles.css","utf8")+"\n</style>").replace(/\s*<script src="data.js"><\/script>\s*<script src="app.js"><\/script>/,"\n<script>\n"+fs.readFileSync("data.js","utf8")+"\n"+fs.readFileSync("app.js","utf8")+"\n</script>");fs.writeFileSync("ma-traffic-rules-standalone.html",h)'
```
