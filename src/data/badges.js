import { CHALLENGES } from './actions';
import { getLevelInfo } from '../utils/gamification';
import { getTodayString } from '../utils/calculations';

export const BADGES = [
  {
    id: 'first_log',
    name: 'First Step',
    description: 'Logged your first activity',
    icon: 'Footprints',
    condition: (state) => state.logs.length >= 1,
  },
  {
    id: 'three_day_streak',
    name: 'Getting Started',
    description: '3-day logging streak',
    icon: 'Flame',
    condition: (state) => state.streak.current >= 3 || state.streak.longest >= 3,
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: '7-day logging streak',
    icon: 'Flame',
    condition: (state) => state.streak.current >= 7 || state.streak.longest >= 7,
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: '30-day logging streak',
    icon: 'Trophy',
    condition: (state) => state.streak.current >= 30 || state.streak.longest >= 30,
  },
  {
    id: 'first_action',
    name: 'Action Taker',
    description: 'Completed your first eco action',
    icon: 'CheckCircle',
    condition: (state) => Object.values(state.completedActions).some(Boolean),
  },
  {
    id: 'five_actions',
    name: 'Green Champion',
    description: 'Completed 5 eco actions',
    icon: 'Award',
    condition: (state) => Object.values(state.completedActions).filter(Boolean).length >= 5,
  },
  {
    id: 'ten_actions',
    name: 'Eco Hero',
    description: 'Completed 10 eco actions',
    icon: 'Star',
    condition: (state) => Object.values(state.completedActions).filter(Boolean).length >= 10,
  },
  {
    id: 'challenge_started',
    name: 'Challenge Accepted',
    description: 'Started your first challenge',
    icon: 'Flag',
    condition: (state) =>
      Object.values(state.challengeProgress || {}).some((p) => p.startedAt),
  },
  {
    id: 'challenge_complete',
    name: 'Challenge Crusher',
    description: 'Completed a challenge',
    icon: 'Medal',
    condition: (state) =>
      Object.values(state.challengeProgress || {}).some((p) => p.completed),
  },
  {
    id: 'all_challenges',
    name: 'Triple Threat',
    description: 'Completed all challenges',
    icon: 'Crown',
    condition: (state) =>
      CHALLENGES.every((c) => state.challengeProgress?.[c.id]?.completed),
  },
  {
    id: 'low_footprint',
    name: 'Light Footprint',
    description: 'Daily footprint under 8 kg CO₂',
    icon: 'Leaf',
    condition: (state) => {
      const today = getTodayString();
      const todayLogs = state.logs.filter((l) => l.date === today);
      const total = todayLogs.reduce((s, l) => s + l.emissions, 0);
      return todayLogs.length > 0 && total < 8;
    },
  },
  {
    id: 'under_daily_goal',
    name: 'On Target',
    description: 'Stayed under daily goal',
    icon: 'Target',
    condition: (state) => {
      const today = getTodayString();
      const target = state.goals?.dailyTarget;
      if (!target) return false;
      const todayLogs = state.logs.filter((l) => l.date === today);
      if (!todayLogs.length) return false;
      const total = todayLogs.reduce((s, l) => s + l.emissions, 0);
      return total <= target;
    },
  },
  {
    id: 'transport_logger',
    name: 'Commute Tracker',
    description: 'Logged 10 transport activities',
    icon: 'Train',
    condition: (state) =>
      state.logs.filter((l) => l.category === 'transport').length >= 10,
  },
  {
    id: 'quiz_complete',
    name: 'Self Aware',
    description: 'Completed the onboarding quiz',
    icon: 'Brain',
    condition: (state) => state.onboardingComplete,
  },
  {
    id: 'fifty_logs',
    name: 'Data Driven',
    description: 'Logged 50 activities',
    icon: 'BarChart3',
    condition: (state) => state.logs.length >= 50,
  },
  {
    id: 'reduction_goal',
    name: 'Goal Getter',
    description: 'Set a reduction goal',
    icon: 'Target',
    condition: (state) => state.goals.monthlyTarget > 0,
  },
  {
    id: 'level_3',
    name: 'Rising Star',
    description: 'Reached level 3',
    icon: 'Sparkles',
    condition: (state) => getLevelInfo(state.gamification?.xp || 0).level >= 3,
  },
  {
    id: 'level_5',
    name: 'Eco Guardian',
    description: 'Reached level 5',
    icon: 'Shield',
    condition: (state) => getLevelInfo(state.gamification?.xp || 0).level >= 5,
  },
  {
    id: 'xp_500',
    name: 'Point Collector',
    description: 'Earned 500 XP',
    icon: 'Zap',
    condition: (state) => (state.gamification?.xp || 0) >= 500,
  },
];

export function getEarnedBadges(state) {
  return BADGES.filter((badge) => badge.condition(state));
}

export function getNewBadges(state, previouslyEarned) {
  const earned = getEarnedBadges(state);
  const prevIds = new Set(previouslyEarned.map((b) => b.id));
  return earned.filter((b) => !prevIds.has(b.id));
}