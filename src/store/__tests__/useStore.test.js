import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../useStore';

const resetStore = () => {
  useStore.setState({
    onboardingComplete: true,
    profile: { name: 'Test', location: 'mumbai', household: 1 },
    logs: [],
    history: [],
    goals: { dailyTarget: 10, monthlyTarget: 300 },
    streak: { current: 0, longest: 0, lastLogDate: null },
    completedActions: {},
    challengeProgress: {},
    gamification: { xp: 0, totalXpEarned: 0, recentXpEvents: [] },
    earnedBadgeIds: [],
    quizResults: { dailyTotal: 10, monthlyTotal: 300 },
  });
};

describe('useStore', () => {
  beforeEach(() => resetStore());

  it('rejects invalid log input', () => {
    const result = useStore.getState().addLog({
      category: 'transport',
      itemId: 'metro',
      quantity: -5,
      date: '2026-06-01',
    });
    expect(result.success).toBe(false);
  });

  it('adds valid log and awards XP', () => {
    const result = useStore.getState().addLog({
      category: 'transport',
      itemId: 'metro',
      itemLabel: 'Metro',
      quantity: 10,
      unit: 'km',
      date: new Date().toISOString().split('T')[0],
    });
    expect(result.success).toBe(true);
    expect(useStore.getState().logs).toHaveLength(1);
    expect(useStore.getState().gamification.xp).toBeGreaterThan(0);
  });

  it('retakeQuiz keeps logs but resets onboarding', () => {
    useStore.getState().addLog({
      category: 'food',
      itemId: 'vegetarian_meal',
      itemLabel: 'Veg meal',
      quantity: 1,
      unit: 'meal',
      date: new Date().toISOString().split('T')[0],
    });
    useStore.getState().retakeQuiz();
    expect(useStore.getState().onboardingComplete).toBe(false);
    expect(useStore.getState().logs).toHaveLength(1);
  });

  it('validates import data', () => {
    const bad = useStore.getState().importData('not json');
    expect(bad.success).toBe(false);

    const good = useStore.getState().importData(JSON.stringify({
      version: '1.1',
      data: {
        onboardingComplete: true,
        profile: { name: 'Imported', location: 'mumbai' },
        logs: [],
        theme: 'dark',
      },
    }));
    expect(good.success).toBe(true);
    expect(useStore.getState().profile.name).toBe('Imported');
  });

  it('checkInChallenge requires start first', () => {
    const result = useStore.getState().checkInChallenge('week_no_plastic');
    expect(result.success).toBe(false);
  });

  it('challenge flow: start then check in', () => {
    useStore.getState().startChallenge('week_no_plastic');
    const result = useStore.getState().checkInChallenge('week_no_plastic');
    expect(result.success).toBe(true);
    expect(result.daysCompleted).toBe(1);
  });
});