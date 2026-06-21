# EcoTrack — Smart Carbon Footprint Assistant

**Live demo:** https://ecotrack-teal.vercel.app

A **frontend-only Progressive Web App** that acts as a **context-aware eco assistant** for urban Indians. It tracks carbon footprint, makes rule-based decisions from user context, and recommends personalised actions — all offline with localStorage persistence.

---

## Chosen Challenge Vertical

### Climate & Sustainability — Urban Carbon Awareness

| Item | Detail |
|------|--------|
| **Vertical** | Climate & Sustainability |
| **Persona** | **Priya**, 28, Mumbai IT professional — daily commute, AC usage, mixed diet, wants practical reduction without major lifestyle disruption |
| **Problem** | Urban Indians lack a simple tool that understands their local context (Mumbai grid, BEST bus, metro, BMC waste rules) and tells them *what to do next* |
| **Solution** | EcoTrack = carbon tracker + **rule-based Eco Assistant** that analyses logs, goals, streaks, and location to deliver prioritised recommendations |

---

## Approach & Assistant Logic

EcoTrack is a **smart, dynamic assistant** implemented as a **transparent rule engine** (no black-box AI). The assistant lives in `src/assistant/ecoAssistant.js`.

### Decision flow

```
User completes quiz → baseline footprint stored
        ↓
User logs daily activities → emissions calculated from India/Mumbai factors
        ↓
buildUserContext() aggregates: today's total, monthly breakdown, goals, streak, challenges
        ↓
Rule engine evaluates 8 contextual rules (priority-sorted)
        ↓
generateAssistantResponse() returns: summary, nextBestAction, top 4 recommendations
        ↓
Dashboard Eco Assistant card displays reasoning + actionable links
```

### Rule examples (see `src/assistant/ecoAssistant.js`)

| Priority | Rule | Trigger | Action |
|----------|------|---------|--------|
| 100 | No logs | `logs.length === 0` | Prompt first log |
| 95 | Over daily goal | `todayFootprint > dailyTarget` | Alert + suggest actions |
| 85 | High transport | Transport > 30 kg + car logs | Recommend Metro (saves ~1.6 kg/10 km) |
| 75 | Summer AC | Apr–Jun + electricity > 40 kg | AC optimization tip |
| 70 | Streak milestone | 2, 6, 13, 29-day streak | Encourage next milestone |
| 60 | Action match | Top emission category | Suggest matching eco action |
| 55 | Challenge nudge | No active challenge | Start Plastic-Free Week |
| 40 | Benchmark | vs Mumbai average | Contextual insight |

Each recommendation includes **transparent reasoning** (`reasoning` field) shown in the UI.

---

## How the Solution Works

1. **Onboarding quiz** — 10 questions → instant footprint baseline with chart
2. **Eco Assistant** — contextual recommendations on every dashboard visit
3. **Activity logging** — validated form with India/Mumbai emission factors
4. **Goal rings** — visual daily/monthly target progress
5. **Actions & challenges** — toggleable habits + daily check-in challenges
6. **Gamification** — XP, 10 levels, 19 badges, streak tracking
7. **Education** — offline Mumbai-specific content
8. **Settings** — dark mode, JSON export/import, PDF report, reset

### Tech stack

React 18 · Vite 5 · Tailwind CSS · Zustand (persist) · Recharts · jsPDF · PWA

---

## Assumptions

1. **Target user** is an urban Indian (Mumbai defaults) with smartphone browser access
2. **Emission factors** are static approximations (CEA grid 0.82 kg/kWh, IPCC transport values) — not live API data
3. **Assistant is rule-based**, not LLM-powered — decisions are deterministic and auditable
4. **Single-device** — all data in `localStorage` key `ecotrack-storage`; no backend/auth
5. **Quiz baseline** is used until user logs override daily totals
6. **Car pooling** factor assumes 2 occupants sharing a petrol car (0.096 kg/km)

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # run test suite
npm run build      # production build
```

---

## Testing

```bash
npm test
```

| Test file | Coverage |
|-----------|----------|
| `src/assistant/__tests__/ecoAssistant.test.js` | Assistant rules, context building, priorities |
| `src/utils/__tests__/calculations.test.js` | Footprint math, streaks, ratings |
| `src/utils/__tests__/validation.test.js` | Input validation, sanitization |
| `src/data/__tests__/emissionFactors.test.js` | Emission calculations |
| `src/components/assistant/__tests__/EcoAssistantCard.test.jsx` | Assistant UI rendering |

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Skip link | "Skip to main content" in `Layout.jsx` |
| Landmarks | `role="main"`, `aria-label` on navigation |
| Focus | `:focus-visible` outlines on all interactive elements |
| Charts | Expandable data tables as accessible alternatives |
| Forms | `role="alert"` for validation errors, `aria-required` |
| Toasts | `role="alert"`, `aria-live="assertive"` for badges |
| Motion | `prefers-reduced-motion` disables animations |

---

## Security

- Log input validated before persistence (`src/utils/validation.js`)
- Notes sanitized (HTML stripped, 200 char limit)
- Unrealistic quantities rejected per category
- No `eval`, no `dangerouslySetInnerHTML`
- Data stays client-side; export/import is user-initiated JSON only

---

## Efficiency

- **Route-level code splitting** via `React.lazy()` for all pages
- **Manual chunks** in Vite: `vendor`, `charts`, `pdf`, `state`
- PWA service worker for offline asset caching
- Zustand selective persistence (only user data, not UI state)

---

## Deployment

**Vercel (live):** https://ecotrack-teal.vercel.app

```bash
npx vercel deploy --prod --yes
```

`vercel.json` includes SPA rewrites and Vite build settings.

---

## Project Structure

```
src/
├── assistant/           # Rule-based Eco Assistant engine
│   ├── ecoAssistant.js  # Context builder + 8 decision rules
│   └── __tests__/
├── components/
│   ├── assistant/       # EcoAssistantCard UI
│   ├── dashboard/       # Charts, goals, streaks
│   ├── gamification/  # XP, badge toasts
│   └── layout/          # Header, nav, skip link
├── data/                # Emission factors, quiz, actions, badges
├── pages/               # Route pages (lazy-loaded)
├── store/               # Zustand + persist
└── utils/               # Calculations, validation, PDF, gamification
```

---

## Data Persistence

All data auto-saves to **localStorage** (`ecotrack-storage`): profile, quiz, logs, history, actions, challenges, goals, streak, XP, badges, theme.

- **Export/import** JSON in Settings
- **Reset all data** in Settings → Danger Zone

---

## Limitations (No-Backend)

| Limitation | Detail |
|-----------|--------|
| Single device | No cloud sync |
| Static factors | Not live grid data |
| Rule-based assistant | Not conversational AI |
| localStorage cap | ~5–10 MB |

See `IMPROVEMENTS.md` for future roadmap.

---

## License

MIT — Built for carbon awareness education.