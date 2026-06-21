# EcoTrack — Improvement Roadmap

Suggested enhancements for the frontend-only version. Use this list when requesting future work — reference items by number or title.

**Legend:** ✅ Done · ⬜ Pending

---

## High Impact (User-Facing)

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| 1 | ⬜ | **Retake / update quiz** | Add "Recalculate footprint" in Settings so users can refresh their baseline without resetting all data. |
| 2 | ✅ | **Log entry editing** | Inline edit for log entries (quantity, date, activity, notes). Implemented on Log page. |
| 3 | ⬜ | **Weekly/monthly summaries** | Dashboard card: "This week vs last week" comparison alongside the 14-day trend chart. |
| 4 | ⬜ | **Action reminders** | PWA local notifications for streaks or unfinished challenges (e.g. "Log today to keep your 7-day streak"). |
| 5 | ⬜ | **Comparison benchmarks** | Single visual scale: footprint vs Mumbai average, India average, and sustainable target. |
| 6 | ✅ | **Mobile-friendly delete** | Edit/delete buttons always visible on touch devices (no hover-only). Implemented on Log page. |

---

## Medium Impact (Engagement)

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| 7 | ✅ | **Goal progress rings** | SVG progress rings for daily and monthly targets on Dashboard. |
| 8 | ⬜ | **Category-specific insights** | Contextual tips after repeated logging (e.g. 3 transport days → "Try metro once this week"). |
| 9 | ✅ | **Challenge day counters** | Start → daily check-in → progress bar → completion flow for challenges. |
| 10 | ✅ | **Expanded badges** | More badges for challenges, levels, transport logging, goals, XP milestones (19 total). |
| 11 | ⬜ | **Onboarding skip + defaults** | Skip quiz and start with Mumbai defaults; nudge to complete quiz later. |

---

## Gamification (Partially Done)

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| G1 | ✅ | **XP & levels** | 10-level system (Seedling → Earth Legend) with XP bar on Dashboard. |
| G2 | ✅ | **XP rewards** | Points for logging, editing, actions, challenge check-ins, badges, streak milestones. |
| G3 | ✅ | **Badge unlock toasts** | Toast notification when a new badge is earned. |
| G4 | ⬜ | **Leaderboard (local)** | Personal best records: lowest daily footprint, longest streak, most XP in a week. |
| G5 | ⬜ | **Daily quests** | 1–3 random micro-tasks per day ("Log one meal", "Mark an action done") for bonus XP. |
| G6 | ⬜ | **Footprint reduction streak** | Streak for consecutive days under daily goal (separate from logging streak). |

---

## Technical / Quality

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| 12 | ⬜ | **Code splitting** | Lazy-load Settings, PDF export, and chart-heavy pages (~1.7 MB main bundle today). |
| 13 | ⬜ | **Stronger PWA caching** | Version-hashed asset cache, offline fallback page, update prompt when new SW available. |
| 14 | ⬜ | **Data migration/versioning** | Schema version on all exports; migration path for every store shape change. (Basic v1 migration exists.) |
| 15 | ⬜ | **Input validation** | Cap unrealistic log values (e.g. 10,000 km) with friendly warnings. |
| 16 | ⬜ | **Accessibility** | Focus states, ARIA labels on nav/actions, chart data tables for screen readers. |

---

## Content / Accuracy

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| 17 | ⬜ | **Emission factor sources** | Link factors to CEA/IPCC references in Education section. |
| 18 | ⬜ | **Seasonal tips** | Month-based tips (Mumbai monsoon, summer AC, festival travel). |
| 19 | ⬜ | **Household sharing** | Split home electricity/LPG emissions by household size when logging. |
| 20 | ✅ | **Car pooling activity** | Transport log option added (0.096 kg CO₂/km). |

---

## Backend (Future — Requires Server)

| # | Status | Improvement | Description |
|---|--------|-------------|-------------|
| 21 | ⬜ | **Cloud sync + multi-device** | User accounts; biggest limitation of the no-backend version. |
| 22 | ⬜ | **Live grid intensity** | Replace static 0.82 kg/kWh with real-time Maharashtra grid data. |
| 23 | ⬜ | **Anonymous city aggregates** | "Mumbai users average X kg/day" for social motivation without PII. |
| 24 | ⬜ | **Push notifications (server)** | Scheduled reminders across devices. |

---

## Suggested Implementation Order

If picking the next batch for frontend-only work:

1. **#1 Retake quiz** + **#11 Skip onboarding** — lowers friction for new and returning users  
2. **#3 Weekly summaries** + **#5 Benchmark scale** — makes Dashboard more insightful  
3. **#8 Category insights** + **#18 Seasonal tips** — personalization without a backend  
4. **#12 Code splitting** + **#13 PWA caching** — performance and offline polish  
5. **#G4–G6 Gamification** — daily quests and reduction streaks for retention  

---

## How to Request

When asking for work, you can say:

- *"Implement IMPROVEMENTS.md items #3 and #5"*
- *"Do the Gamification section G4–G6"*
- *"Everything under Technical / Quality"*

---

*Last updated: June 2026*