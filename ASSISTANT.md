# Eco Assistant — Decision Logic Reference

Rule-based contextual assistant for the **Climate & Sustainability** vertical.  
Implementation: `src/assistant/ecoAssistant.js` · Constants: `src/assistant/constants.js`

## Persona

**Priya** — 28, Mumbai urban professional. Commutes daily, uses AC in summer, wants actionable reduction steps.

## Pipeline

```
Zustand state → buildUserContext() → 8 rules → sort by priority → top 4 recommendations
```

## Rules (priority order)

| ID | Priority | Trigger | Output |
|----|----------|---------|--------|
| `onboard_log` | 100 | No logs ever | Prompt first log |
| `over_daily_goal` | 95 | todayFootprint > dailyTarget | Alert with top category |
| `log_today` | 90 | Streak active, nothing logged today | Streak reminder |
| `switch_metro` | 85 | Transport ≥ 30 kg/mo + 2+ car logs | Metro savings estimate |
| `ac_optimization` | 75 | Apr–Jun + electricity ≥ 40 kg/mo | Summer AC tip |
| `streak_push` | 70 | Streak at 2, 6, 13, or 29 | Milestone encouragement |
| `suggest_action` | 60 | < 5 actions done | Map top category → action library |
| `start_challenge` | 55 | No active challenge | Nudge to start challenge |
| `benchmark` | 40 | ±1 kg vs Mumbai average | Contextual insight |

## Example

**Input context:**
- todayFootprint: 12.5 kg
- dailyTarget: 10 kg
- categoryBreakdown: Transport 45 kg, Food 20 kg
- 3 car_petrol logs this month

**Output:**
1. `over_daily_goal` (95) — 2.5 kg over target
2. `switch_metro` (85) — save ~1.6 kg per 10 km
3. `suggest_action` (60) — e.g. "Take Metro/Local Train"
4. `benchmark` (40) — above Mumbai average

## Design principles

1. **Transparent** — every recommendation includes `reasoning`
2. **Deterministic** — same state → same output (testable)
3. **Actionable** — each item links to `/log`, `/actions`, or `/education`
4. **Offline** — no API calls; runs entirely in the browser

## Tests

`src/assistant/__tests__/ecoAssistant.test.js` — rule triggers, priority ordering, context building.