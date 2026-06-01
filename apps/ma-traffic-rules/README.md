# Massachusetts Traffic Rules

A small, self-contained web app that provides a plain-language reference to
Massachusetts driving laws, plus a practice quiz.

> ⚠️ **Educational use only — not legal advice.** Content is summarized from the
> Massachusetts Driver's Manual (RMV), the Massachusetts General Laws
> (Chapters 85, 89 & 90), and 720 CMR. Always verify against the official
> [Massachusetts RMV](https://www.mass.gov/rmv) and
> [General Laws](https://malegislature.gov).

## Features

- 📖 **Searchable rules** — filter by keyword (e.g. `parking`, `phone`, `speed`)
  or by category, with expandable cards and statute references.
- 📝 **Practice quiz** — randomized multiple-choice questions with instant
  feedback and an RMV-style pass threshold (70%).
- 📱 **Responsive** — works on desktop and mobile.
- 🚀 **Zero dependencies** — pure HTML/CSS/JavaScript, no build step.

## Running it

It's a static site. Just open `index.html` in a browser, or serve the folder:

```bash
cd apps/ma-traffic-rules
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File         | Purpose                                            |
| ------------ | -------------------------------------------------- |
| `index.html` | Markup and view structure                          |
| `styles.css` | Styling (Massachusetts flag-inspired palette)      |
| `app.js`     | Tab navigation, search/filter, and quiz logic      |
| `data.js`    | Rules content and quiz questions (edit this to update) |

## Updating the content

All rules and quiz questions live in `data.js`. Add a new rule by appending an
object to the `RULES` array; add a quiz question by appending to the `QUIZ`
array. No other files need to change.
