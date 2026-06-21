import { ACTIONS, CHALLENGES } from '../data/actions';
import { MUMBAI_AVERAGES } from '../data/emissionFactors';
import { RULE_PRIORITY, THRESHOLDS, SUMMER_MONTHS, STREAK_MILESTONES } from './constants';
import {
  getTodayString,
  getMonthString,
  getDailyTotal,
  getMonthlyTotal,
  getCategoryBreakdown,
  getFootprintRating,
} from '../utils/calculations';

/**
 * Rule-based Eco Assistant — makes contextual decisions from user state.
 * Vertical: Climate & Sustainability | Persona: urban Indian commuter (Mumbai defaults)
 */

export const PERSONA = {
  id: 'priya_mumbai',
  name: 'Priya',
  age: 28,
  city: 'Mumbai',
  role: 'Urban professional',
  goals: ['Reduce daily commute emissions', 'Stay under monthly carbon budget', 'Build sustainable habits'],
};

export function buildUserContext(state) {
  const today = getTodayString();
  const monthStr = getMonthString();
  const todayLogs = state.logs.filter((l) => l.date === today);
  const todayFootprint = todayLogs.length
    ? getDailyTotal(state.logs, today)
    : state.history.find((h) => h.date === today)?.total ?? state.quizResults?.dailyTotal ?? 0;

  return {
    profile: state.profile,
    today,
    monthStr,
    todayFootprint,
    monthlyTotal: getMonthlyTotal(state.logs, monthStr),
    dailyTarget: state.goals?.dailyTarget ?? 0,
    monthlyTarget: state.goals?.monthlyTarget ?? 0,
    streak: state.streak,
    quizBaseline: state.quizResults?.dailyTotal ?? null,
    categoryBreakdown: getCategoryBreakdown(state.logs, 'month'),
    todayCategories: [...new Set(todayLogs.map((l) => l.category))],
    logsCount: state.logs.length,
    completedActionsCount: Object.values(state.completedActions || {}).filter(Boolean).length,
    activeChallenges: Object.entries(state.challengeProgress || {}).filter(
      ([, p]) => p.startedAt && !p.completed
    ),
    rating: getFootprintRating(todayFootprint),
    month: new Date().getMonth(),
  };
}

function ruleNoLogsToday(ctx) {
  if (ctx.logsCount === 0) {
    return {
      id: 'onboard_log',
      priority: RULE_PRIORITY.ONBOARD_LOG,
      type: 'action',
      title: 'Log your first activity',
      message: 'I need at least one activity log to give you accurate guidance. Start with today\'s commute or electricity usage.',
      action: { label: 'Go to Log', route: '/log' },
      impactKg: null,
      reasoning: 'No historical logs — baseline quiz data alone is insufficient for daily decisions.',
    };
  }
  if (!ctx.todayCategories.length) {
    return {
      id: 'log_today',
      priority: RULE_PRIORITY.LOG_TODAY,
      type: 'reminder',
      title: 'Nothing logged today',
      message: `Your ${ctx.streak.current}-day streak is active, but today has no entries yet. Log before midnight to keep momentum.`,
      action: { label: 'Log now', route: '/log' },
      impactKg: null,
      reasoning: 'Streak maintenance requires daily logging.',
    };
  }
  return null;
}

function ruleOverDailyGoal(ctx) {
  if (!ctx.dailyTarget || ctx.todayFootprint <= ctx.dailyTarget) return null;
  const over = ctx.todayFootprint - ctx.dailyTarget;
  const topCategory = [...ctx.categoryBreakdown].sort((a, b) => b.value - a.value)[0];

  return {
    id: 'over_daily_goal',
    priority: RULE_PRIORITY.OVER_DAILY_GOAL,
    type: 'alert',
    title: 'Daily goal exceeded',
    message: `You're ${over.toFixed(1)} kg over today's ${ctx.dailyTarget} kg target. Biggest driver this month: ${topCategory?.name ?? 'unknown'} (${topCategory?.value ?? 0} kg).`,
    action: { label: 'View actions', route: '/actions' },
    impactKg: over,
    reasoning: 'Daily total > dailyTarget from user goals.',
  };
}

function ruleTransportDominant(ctx, state) {
  const transport = ctx.categoryBreakdown.find((c) => c.name === 'Transport');
  if (!transport || transport.value < THRESHOLDS.TRANSPORT_MONTHLY_KG) return null;

  const carLogs = state.logs.filter(
    (l) => l.category === 'transport' && l.itemId?.startsWith('car_') && l.itemId !== 'car_pooling'
  );
  if (carLogs.length < THRESHOLDS.MIN_CAR_LOGS_FOR_METRO) return null;

  const savedPer10km =
    (THRESHOLDS.CAR_PETROL_FACTOR - THRESHOLDS.METRO_FACTOR) * THRESHOLDS.METRO_SAVINGS_DISTANCE_KM;

  return {
    id: 'switch_metro',
    priority: RULE_PRIORITY.SWITCH_METRO,
    type: 'recommendation',
    title: 'Switch one trip to Metro',
    message: `Transport is ${transport.value} kg this month. Replacing a 10 km car trip with Mumbai Metro saves ~${savedPer10km.toFixed(1)} kg CO₂.`,
    action: { label: 'Log metro trip', route: '/log' },
    impactKg: savedPer10km,
    reasoning: 'Transport > 30 kg/month AND multiple solo car logs detected.',
  };
}

function ruleElectricitySummer(ctx) {
  if (ctx.month < SUMMER_MONTHS.start || ctx.month > SUMMER_MONTHS.end) return null;
  const electricity = ctx.categoryBreakdown.find((c) => c.name === 'Electricity');
  if (!electricity || electricity.value < THRESHOLDS.ELECTRICITY_MONTHLY_KG) return null;

  return {
    id: 'ac_optimization',
    priority: RULE_PRIORITY.AC_OPTIMIZATION,
    type: 'recommendation',
    title: 'Summer AC optimization',
    message: 'Mumbai summer detected with high electricity use. Set AC to 26°C with a ceiling fan — typically saves 20–30% cooling emissions.',
    action: { label: 'Mark action done', route: '/actions' },
    impactKg: 18,
    reasoning: 'Month in Apr–Jun range + electricity > 40 kg/month.',
  };
}

function ruleStreakMilestone(ctx) {
  if (!STREAK_MILESTONES.before.includes(ctx.streak.current)) return null;
  const next = STREAK_MILESTONES.targets[ctx.streak.current];

  return {
    id: 'streak_push',
    priority: RULE_PRIORITY.STREAK_PUSH,
    type: 'encouragement',
    title: `${next}-day streak within reach`,
    message: `You're at ${ctx.streak.current} days. One more log tomorrow unlocks a streak milestone and bonus XP.`,
    action: { label: 'Log today', route: '/log' },
    impactKg: null,
    reasoning: `Streak.current is one day before milestone (${next}).`,
  };
}

function ruleSuggestAction(ctx, state) {
  if (ctx.completedActionsCount >= THRESHOLDS.MIN_ACTIONS_BEFORE_STOP_SUGGESTING) return null;

  const topCat = ctx.categoryBreakdown[0]?.name?.toLowerCase();
  const matching = ACTIONS.find(
    (a) => a.category === topCat && !state.completedActions[a.id]
  ) || ACTIONS.find((a) => !state.completedActions[a.id]);

  if (!matching) return null;

  return {
    id: 'suggest_action',
    priority: RULE_PRIORITY.SUGGEST_ACTION,
    type: 'recommendation',
    title: `Try: ${matching.title}`,
    message: matching.description,
    action: { label: 'View in Actions', route: '/actions' },
    impactKg: matching.impact,
    reasoning: `Highest emission category (${topCat ?? 'general'}) mapped to action library.`,
  };
}

function ruleChallengeNudge(ctx) {
  if (ctx.activeChallenges.length > 0) return null;
  const challenge = CHALLENGES[0];

  return {
    id: 'start_challenge',
    priority: RULE_PRIORITY.START_CHALLENGE,
    type: 'engagement',
    title: `Start: ${challenge.title}`,
    message: `${challenge.description}. Check in daily for +50 XP per day.`,
    action: { label: 'Start challenge', route: '/actions' },
    impactKg: challenge.impact,
    reasoning: 'No active challenges — engagement drop-off risk.',
  };
}

function ruleBenchmarkContext(ctx) {
  const vsAvg = ctx.todayFootprint - MUMBAI_AVERAGES.dailyFootprint;
  if (Math.abs(vsAvg) < THRESHOLDS.MIN_BENCHMARK_DIFF_KG) return null;

  return {
    id: 'benchmark',
    priority: RULE_PRIORITY.BENCHMARK,
    type: 'insight',
    title: vsAvg > 0 ? 'Above Mumbai average' : 'Below Mumbai average',
    message: vsAvg > 0
      ? `Today is ${vsAvg.toFixed(1)} kg above the Mumbai urban average (${MUMBAI_AVERAGES.dailyFootprint} kg/day). Focus on your highest category.`
      : `Great work — ${Math.abs(vsAvg).toFixed(1)} kg below the Mumbai average today. Keep it up!`,
    action: { label: 'Learn more', route: '/education' },
    impactKg: Math.abs(vsAvg),
    reasoning: 'Comparison against MUMBAI_AVERAGES.dailyFootprint.',
  };
}

const RULES = [
  ruleNoLogsToday,
  ruleOverDailyGoal,
  ruleTransportDominant,
  ruleElectricitySummer,
  ruleStreakMilestone,
  ruleSuggestAction,
  ruleChallengeNudge,
  ruleBenchmarkContext,
];

/**
 * @param {object} state - Full Zustand store state
 * @returns {object} Assistant response with greeting, summary, recommendations, nextBestAction
 */
export function generateAssistantResponse(state) {
  const ctx = buildUserContext(state);
  const name = state.profile?.name || PERSONA.name;

  const recommendations = RULES
    .map((rule) => {
      if (rule === ruleTransportDominant || rule === ruleSuggestAction) {
        return rule(ctx, state);
      }
      return rule(ctx);
    })
    .filter(Boolean)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, THRESHOLDS.MAX_RECOMMENDATIONS);

  const nextBestAction = recommendations[0] ?? null;

  const summary = ctx.logsCount === 0
    ? `Hi ${name}! Complete your quiz baseline, then log daily activities so I can guide you.`
    : `Hi ${name}! Today: ${ctx.todayFootprint.toFixed(1)} kg CO₂ (${ctx.rating.label}). ${
        nextBestAction ? `Priority: ${nextBestAction.title}` : 'You\'re on track — keep logging.'
      }`;

  return {
    persona: PERSONA,
    context: ctx,
    greeting: `Eco Assistant for ${state.profile?.location === 'mumbai' ? 'Mumbai' : 'your city'}`,
    summary,
    recommendations,
    nextBestAction,
    generatedAt: new Date().toISOString(),
  };
}