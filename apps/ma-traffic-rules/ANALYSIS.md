# Competitive Analysis & UX Strategy — RoadReady MA

Goal: build the **best Massachusetts permit-prep app** — better UX/UI than the
current App Store leaders, and **100% free**.

## The competitors

| App | Scale / Model | Signature strengths | Gaps we exploit |
| --- | --- | --- | --- |
| **DMV Genie** | 8M+ users, free + one-time IAP | AI Exam Simulator, Read Mode vs Exam Mode, offline, progress tracking | Paywalled explanations; generic 50-state content |
| **Zutobi** | 250k+ MAU, subscription | Gamified (XP, levels, leaderboard), summarized handbook, illustrated questions | Subscription wall; gamification is shallow |
| **DMV Permit Prep 2026** | free + IAP | 800+ Qs, real-exam format & timer, "Smart Review" of weak spots, mastery % | Cluttered; ads |
| **Permit Test 2025** | free + premium | Realistic simulation, adaptive beginner→expert levels, minimalist UI | Limited content depth |
| **MA RMV Permit Practice** | free | MA-specific, custom test from missed questions | Dated UI, no gamification |

## What the leaders all do (table stakes)

- A **realistic exam simulator** matching the real test format & timer.
- A dedicated **road-signs** section (visual recognition).
- **Per-answer explanations** and **review of wrong answers**.
- **Progress / mastery by category**, **offline** use.

## The real MA RMV Class D Learner's Permit exam (what we mirror)

- **25 multiple-choice questions**, **must answer 18 correctly (72%)** to pass.
- Covers traffic laws, safe driving, and **road signs**.
- Single attempt per question, score at the end (not per-question hearts).

## Where we win (UX/UI decisions)

1. **Two modes, done right** — *Learn* (gamified, forgiving, hearts + instant
   feedback) and a separate **Exam Simulator** (25 Q, 18-to-pass, live countdown,
   no hand-holding, full review at the end). Matches DMV Genie's Read/Exam split
   but cleaner.
2. **Road Signs module** competitors charge or clutter for — crisp vector signs,
   learn + a flip-to-reveal recognition quiz, fully offline.
3. **Smart Review** — every missed question is remembered; a one-tap "Practice
   your mistakes" set. Mastery isn't a vanity %, it's actionable.
4. **Native-app feel** — a real **bottom tab bar** (Learn · Exam · Signs ·
   Profile), 60 fps micro-interactions, confetti, sound + haptics (all
   toggleable), and **system-aware Dark Mode** — which several leaders lack.
5. **Accessibility & polish** — large tap targets, focus states, reduced-motion
   support, safe-area insets, semantic roles.
6. **No paywall, no ads, no account, no tracking.** Everything above is free,
   offline, and saved on-device. That is the headline that beats every paid
   competitor.

## Result

A single, fast, beautiful PWA-quality experience that covers Learn, a
real-format Exam, Signs, and a Profile with mastery + settings — matching the
feature set of the paid market leaders while being friendlier, prettier, and
free.
