export const XP_REWARDS = {
  LOG_ENTRY: 10,
  LOG_EDIT: 5,
  ACTION_COMPLETE: 25,
  CHALLENGE_DAY: 50,
  CHALLENGE_COMPLETE: 200,
  BADGE_EARNED: 100,
  STREAK_MILESTONE: 75,
};

export const LEVELS = [
  { level: 1, title: 'Seedling', xpRequired: 0 },
  { level: 2, title: 'Sprout', xpRequired: 100 },
  { level: 3, title: 'Sapling', xpRequired: 250 },
  { level: 4, title: 'Tree', xpRequired: 500 },
  { level: 5, title: 'Forest', xpRequired: 800 },
  { level: 6, title: 'Guardian', xpRequired: 1200 },
  { level: 7, title: 'Champion', xpRequired: 1800 },
  { level: 8, title: 'Eco Hero', xpRequired: 2500 },
  { level: 9, title: 'Planet Protector', xpRequired: 3500 },
  { level: 10, title: 'Earth Legend', xpRequired: 5000 },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }

  if (!next) {
    return { level: current.level, title: current.title, progress: 100, xpInLevel: 0, xpNeeded: 0, isMax: true };
  }

  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { level: current.level, title: current.title, progress, xpInLevel, xpNeeded, isMax: false };
}

export function getGoalRingProgress(current, target) {
  if (!target || target <= 0) return { percent: 0, status: 'none', remaining: 0 };
  const percent = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);
  let status = 'good';
  if (percent >= 100) status = 'over';
  else if (percent >= 80) status = 'warning';
  return { percent, status, remaining };
}