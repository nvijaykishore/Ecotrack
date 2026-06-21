import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACTIONS, CHALLENGES } from '../data/actions';
import { calculateQuizFootprint } from '../data/quizQuestions';
import { calculateEmissions } from '../data/emissionFactors';
import { getEarnedBadges, getNewBadges } from '../data/badges';
import {
  getTodayString,
  getDailyTotal,
  updateStreak,
} from '../utils/calculations';
import { rebuildHistory } from '../utils/history';
import { XP_REWARDS } from '../utils/gamification';
import { validateLogInput, sanitizeNotes } from '../utils/validation';

const initialState = {
  onboardingComplete: false,
  profile: {
    name: '',
    location: 'mumbai',
    household: 1,
  },
  quizAnswers: {},
  quizResults: null,
  logs: [],
  history: [],
  completedActions: {},
  completedChallenges: {},
  challengeProgress: {},
  goals: {
    monthlyTarget: 0,
    dailyTarget: 0,
  },
  streak: {
    current: 0,
    longest: 0,
    lastLogDate: null,
  },
  gamification: {
    xp: 0,
    totalXpEarned: 0,
    recentXpEvents: [],
  },
  earnedBadgeIds: [],
  badgeAlert: null,
  theme: 'light',
  actionsLibrary: ACTIONS,
};

function createLogFromData(logData, id) {
  const emissions = calculateEmissions(logData.category, logData.itemId, logData.quantity);
  return {
    id: id || crypto.randomUUID(),
    date: logData.date || getTodayString(),
    category: logData.category,
    itemId: logData.itemId,
    itemLabel: logData.itemLabel,
    quantity: logData.quantity,
    unit: logData.unit,
    emissions,
    notes: logData.notes || '',
    createdAt: logData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      addXp: (amount, reason) => {
        const g = get().gamification;
        const event = { amount, reason, at: new Date().toISOString() };
        set({
          gamification: {
            xp: g.xp + amount,
            totalXpEarned: g.totalXpEarned + amount,
            recentXpEvents: [event, ...g.recentXpEvents].slice(0, 5),
          },
        });
      },

      clearBadgeAlert: () => set({ badgeAlert: null }),

      completeOnboarding: (answers, profile) => {
        const results = calculateQuizFootprint(answers);
        const today = getTodayString();

        set({
          onboardingComplete: true,
          quizAnswers: answers,
          quizResults: results,
          profile: { ...get().profile, ...profile },
          history: [
            {
              date: today,
              total: results.dailyTotal,
              source: 'quiz',
              breakdown: results.breakdown,
            },
          ],
          goals: {
            monthlyTarget: Math.round(results.monthlyTotal * 0.9),
            dailyTarget: Math.round(results.dailyTotal * 0.9 * 10) / 10,
          },
        });

        get().checkBadges();
      },

      addLog: (logData) => {
        const validation = validateLogInput(logData);
        if (!validation.valid) return { success: false, errors: validation.errors };

        const log = createLogFromData({
          ...logData,
          notes: sanitizeNotes(logData.notes),
        });
        const logs = [...get().logs, log];
        const streak = updateStreak(get().streak, log.date);
        const history = rebuildHistory(logs, get().history);

        set({ logs, streak, history });
        get().addXp(XP_REWARDS.LOG_ENTRY, 'Logged activity');

        const newStreak = get().streak.current;
        if ([3, 7, 14, 30].includes(newStreak)) {
          get().addXp(XP_REWARDS.STREAK_MILESTONE, `${newStreak}-day streak!`);
        }

        get().checkBadges();
        return { success: true };
      },

      updateLog: (id, logData) => {
        const validation = validateLogInput(logData);
        if (!validation.valid) return { success: false, errors: validation.errors };

        const logs = get().logs.map((l) =>
          l.id === id
            ? createLogFromData(
                { ...logData, notes: sanitizeNotes(logData.notes), createdAt: l.createdAt },
                id
              )
            : l
        );
        const history = rebuildHistory(logs, get().history);

        set({ logs, history });
        get().addXp(XP_REWARDS.LOG_EDIT, 'Updated log entry');
        get().checkBadges();
        return { success: true };
      },

      deleteLog: (id) => {
        const logs = get().logs.filter((l) => l.id !== id);
        const history = rebuildHistory(logs, get().history);
        set({ logs, history });
      },

      toggleAction: (actionId) => {
        const completed = { ...get().completedActions };
        const wasDone = completed[actionId];
        completed[actionId] = !completed[actionId];
        set({ completedActions: completed });

        if (!wasDone && completed[actionId]) {
          get().addXp(XP_REWARDS.ACTION_COMPLETE, 'Completed eco action');
        }

        get().checkBadges();
      },

      startChallenge: (challengeId) => {
        const progress = { ...get().challengeProgress };
        const challenge = CHALLENGES.find((c) => c.id === challengeId);
        if (!challenge) return;

        if (!progress[challengeId] || progress[challengeId].completed) {
          progress[challengeId] = {
            daysCompleted: 0,
            startedAt: getTodayString(),
            lastCheckIn: null,
            completed: false,
            completedAt: null,
          };
          set({ challengeProgress: progress });
          get().checkBadges();
        }
      },

      checkInChallenge: (challengeId) => {
        const challenge = CHALLENGES.find((c) => c.id === challengeId);
        if (!challenge) return { success: false, message: 'Challenge not found' };

        const progress = { ...get().challengeProgress };
        const entry = progress[challengeId];

        if (!entry || !entry.startedAt) {
          return { success: false, message: 'Start the challenge first' };
        }
        if (entry.completed) {
          return { success: false, message: 'Challenge already completed' };
        }
        if (entry.lastCheckIn === getTodayString()) {
          return { success: false, message: 'Already checked in today' };
        }

        const daysCompleted = entry.daysCompleted + 1;
        const completed = daysCompleted >= challenge.duration;

        progress[challengeId] = {
          ...entry,
          daysCompleted,
          lastCheckIn: getTodayString(),
          completed,
          completedAt: completed ? getTodayString() : null,
        };

        set({
          challengeProgress: progress,
          completedChallenges: {
            ...get().completedChallenges,
            [challengeId]: completed,
          },
        });

        get().addXp(XP_REWARDS.CHALLENGE_DAY, `Challenge day ${daysCompleted}`);
        if (completed) {
          get().addXp(XP_REWARDS.CHALLENGE_COMPLETE, `Completed ${challenge.title}!`);
        }

        get().checkBadges();
        return { success: true, completed, daysCompleted };
      },

      resetChallenge: (challengeId) => {
        const progress = { ...get().challengeProgress };
        delete progress[challengeId];
        const completed = { ...get().completedChallenges };
        delete completed[challengeId];
        set({ challengeProgress: progress, completedChallenges: completed });
      },

      setGoals: (goals) => set({ goals: { ...get().goals, ...goals } }),

      updateProfile: (profile) => set({ profile: { ...get().profile, ...profile } }),

      checkBadges: () => {
        const allNew = [];
        let iterations = 0;

        while (iterations < 5) {
          const state = get();
          const prevIds = state.earnedBadgeIds;
          const newBadges = getNewBadges(state, prevIds.map((id) => ({ id })));
          if (newBadges.length === 0) break;

          newBadges.forEach((badge) => {
            get().addXp(XP_REWARDS.BADGE_EARNED, `Badge: ${badge.name}`);
          });
          allNew.push(...newBadges);
          set({ earnedBadgeIds: getEarnedBadges(get()).map((b) => b.id) });
          iterations++;
        }

        if (allNew.length > 0) {
          set({ badgeAlert: allNew[allNew.length - 1] });
        }

        return allNew;
      },

      exportData: () => {
        const state = get();
        const exportObj = {
          version: '1.1',
          exportedAt: new Date().toISOString(),
          data: {
            onboardingComplete: state.onboardingComplete,
            profile: state.profile,
            quizAnswers: state.quizAnswers,
            quizResults: state.quizResults,
            logs: state.logs,
            history: state.history,
            completedActions: state.completedActions,
            completedChallenges: state.completedChallenges,
            challengeProgress: state.challengeProgress,
            goals: state.goals,
            streak: state.streak,
            gamification: state.gamification,
            earnedBadgeIds: state.earnedBadgeIds,
            theme: state.theme,
          },
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importData: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          const data = parsed.data || parsed;
          set({
            onboardingComplete: data.onboardingComplete ?? false,
            profile: data.profile ?? initialState.profile,
            quizAnswers: data.quizAnswers ?? {},
            quizResults: data.quizResults ?? null,
            logs: data.logs ?? [],
            history: data.history ?? [],
            completedActions: data.completedActions ?? {},
            completedChallenges: data.completedChallenges ?? {},
            challengeProgress: data.challengeProgress ?? {},
            goals: data.goals ?? initialState.goals,
            streak: data.streak ?? initialState.streak,
            gamification: data.gamification ?? initialState.gamification,
            earnedBadgeIds: data.earnedBadgeIds ?? [],
            theme: data.theme ?? 'light',
            badgeAlert: null,
          });
          return { success: true };
        } catch {
          return { success: false, error: 'Invalid JSON file' };
        }
      },

      resetAllData: () => {
        set({ ...initialState });
        localStorage.removeItem('ecotrack-storage');
      },

      getTodayFootprint: () => {
        const logs = get().logs;
        const today = getTodayString();
        const logTotal = getDailyTotal(logs, today);

        if (logTotal > 0) return logTotal;

        const historyEntry = get().history.find((h) => h.date === today);
        if (historyEntry) return historyEntry.total;

        return get().quizResults?.dailyTotal ?? 0;
      },

      getCompletedActionsImpact: () => {
        const completed = get().completedActions;
        return ACTIONS.filter((a) => completed[a.id]).reduce((sum, a) => sum + a.impact, 0);
      },
    }),
    {
      name: 'ecotrack-storage',
      version: 1,
      migrate: (persisted, version) => {
        if (version === 0) {
          const state = persisted;
          if (!state.challengeProgress) state.challengeProgress = {};
          if (!state.gamification) {
            state.gamification = { xp: 0, totalXpEarned: 0, recentXpEvents: [] };
          }
          if (state.completedChallenges) {
            Object.entries(state.completedChallenges).forEach(([id, done]) => {
              if (done && !state.challengeProgress[id]) {
                const challenge = CHALLENGES.find((c) => c.id === id);
                state.challengeProgress[id] = {
                  daysCompleted: challenge?.duration || 0,
                  startedAt: getTodayString(),
                  lastCheckIn: getTodayString(),
                  completed: true,
                  completedAt: getTodayString(),
                };
              }
            });
          }
          return state;
        }
        return persisted;
      },
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        profile: state.profile,
        quizAnswers: state.quizAnswers,
        quizResults: state.quizResults,
        logs: state.logs,
        history: state.history,
        completedActions: state.completedActions,
        completedChallenges: state.completedChallenges,
        challengeProgress: state.challengeProgress,
        goals: state.goals,
        streak: state.streak,
        gamification: state.gamification,
        earnedBadgeIds: state.earnedBadgeIds,
        theme: state.theme,
      }),
    }
  )
);