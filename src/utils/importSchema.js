const SUPPORTED_VERSIONS = ['1.0', '1.1'];
const MAX_LOGS = 5000;
const MAX_STRING = 500;
const VALID_LOCATIONS = ['mumbai', 'metro', 'tier2', 'rural'];
const VALID_THEMES = ['light', 'dark'];
const VALID_CATEGORIES = ['electricity', 'transport', 'food', 'home', 'shopping'];

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isValidLog(log) {
  return (
    isPlainObject(log)
    && typeof log.id === 'string'
    && typeof log.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(log.date)
    && VALID_CATEGORIES.includes(log.category)
    && typeof log.itemId === 'string'
    && typeof log.emissions === 'number'
    && log.emissions >= 0
    && log.emissions < 10000
    && typeof log.quantity === 'number'
    && log.quantity > 0
  );
}

/**
 * Validates imported backup JSON before applying to store.
 * @returns {{ valid: boolean, errors: string[], data?: object }}
 */
export function validateImportData(raw) {
  const errors = [];

  if (!isPlainObject(raw)) {
    return { valid: false, errors: ['Root must be a JSON object.'] };
  }

  const version = raw.version ?? '1.0';
  if (!SUPPORTED_VERSIONS.includes(String(version))) {
    errors.push(`Unsupported version: ${version}. Supported: ${SUPPORTED_VERSIONS.join(', ')}`);
  }

  const data = raw.data ?? raw;
  if (!isPlainObject(data)) {
    return { valid: false, errors: ['Missing data object.'] };
  }

  if (data.profile !== undefined) {
    if (!isPlainObject(data.profile)) {
      errors.push('profile must be an object.');
    } else {
      if (data.profile.name && String(data.profile.name).length > MAX_STRING) {
        errors.push('profile.name too long.');
      }
      if (data.profile.location && !VALID_LOCATIONS.includes(data.profile.location)) {
        errors.push('profile.location invalid.');
      }
    }
  }

  if (data.logs !== undefined) {
    if (!Array.isArray(data.logs)) {
      errors.push('logs must be an array.');
    } else if (data.logs.length > MAX_LOGS) {
      errors.push(`Too many logs (max ${MAX_LOGS}).`);
    } else {
      data.logs.forEach((log, i) => {
        if (!isValidLog(log)) errors.push(`Invalid log at index ${i}.`);
      });
    }
  }

  if (data.theme && !VALID_THEMES.includes(data.theme)) {
    errors.push('theme must be light or dark.');
  }

  if (data.goals !== undefined && isPlainObject(data.goals)) {
    if (data.goals.dailyTarget < 0 || data.goals.monthlyTarget < 0) {
      errors.push('goals cannot be negative.');
    }
  }

  if (data.gamification?.xp > 1_000_000) {
    errors.push('gamification.xp exceeds allowed maximum.');
  }

  // Reject unexpected top-level keys in data (basic injection guard)
  const allowedKeys = new Set([
    'onboardingComplete', 'profile', 'quizAnswers', 'quizResults', 'logs', 'history',
    'completedActions', 'completedChallenges', 'challengeProgress', 'goals', 'streak',
    'gamification', 'earnedBadgeIds', 'theme',
  ]);
  Object.keys(data).forEach((key) => {
    if (!allowedKeys.has(key)) errors.push(`Unexpected field: ${key}`);
  });

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    data: {
      onboardingComplete: Boolean(data.onboardingComplete),
      profile: data.profile ?? { name: '', location: 'mumbai', household: 1 },
      quizAnswers: data.quizAnswers ?? {},
      quizResults: data.quizResults ?? null,
      logs: data.logs ?? [],
      history: data.history ?? [],
      completedActions: data.completedActions ?? {},
      completedChallenges: data.completedChallenges ?? {},
      challengeProgress: data.challengeProgress ?? {},
      goals: data.goals ?? { monthlyTarget: 0, dailyTarget: 0 },
      streak: data.streak ?? { current: 0, longest: 0, lastLogDate: null },
      gamification: data.gamification ?? { xp: 0, totalXpEarned: 0, recentXpEvents: [] },
      earnedBadgeIds: Array.isArray(data.earnedBadgeIds) ? data.earnedBadgeIds : [],
      theme: data.theme ?? 'light',
    },
  };
}

export function parseAndValidateImport(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return validateImportData(parsed);
  } catch {
    return { valid: false, errors: ['Invalid JSON syntax.'] };
  }
}