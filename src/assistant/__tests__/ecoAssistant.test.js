import { describe, it, expect } from 'vitest';
import { buildUserContext, generateAssistantResponse, PERSONA } from '../ecoAssistant';

const baseState = {
  profile: { name: 'Priya', location: 'mumbai', household: 2 },
  logs: [],
  history: [],
  goals: { dailyTarget: 10, monthlyTarget: 300 },
  streak: { current: 0, longest: 0, lastLogDate: null },
  quizResults: { dailyTotal: 12.4, monthlyTotal: 372, breakdown: { transport: 80 } },
  completedActions: {},
  challengeProgress: {},
};

describe('Eco Assistant', () => {
  it('defines a challenge persona', () => {
    expect(PERSONA.city).toBe('Mumbai');
    expect(PERSONA.goals.length).toBeGreaterThan(0);
  });

  it('prompts logging when no logs exist', () => {
    const response = generateAssistantResponse(baseState);
    expect(response.recommendations.some((r) => r.id === 'onboard_log')).toBe(true);
    expect(response.summary).toContain('Priya');
  });

  it('alerts when daily goal is exceeded', () => {
    const today = new Date().toISOString().split('T')[0];
    const state = {
      ...baseState,
      logs: [
        {
          id: '1',
          date: today,
          category: 'transport',
          itemId: 'car_petrol',
          emissions: 15,
        },
      ],
    };
    const response = generateAssistantResponse(state);
    expect(response.recommendations.some((r) => r.id === 'over_daily_goal')).toBe(true);
  });

  it('recommends metro when transport is high with car logs', () => {
    const state = {
      ...baseState,
      logs: Array.from({ length: 3 }, (_, i) => ({
        id: String(i),
        date: `2026-06-${10 + i}`,
        category: 'transport',
        itemId: 'car_petrol',
        emissions: 20,
      })),
    };
    const response = generateAssistantResponse(state);
    expect(response.recommendations.some((r) => r.id === 'switch_metro')).toBe(true);
  });

  it('returns nextBestAction as highest priority recommendation', () => {
    const response = generateAssistantResponse(baseState);
    if (response.recommendations.length > 0) {
      expect(response.nextBestAction.priority).toBe(
        Math.max(...response.recommendations.map((r) => r.priority))
      );
    }
  });

  it('buildUserContext computes today footprint from logs', () => {
    const today = new Date().toISOString().split('T')[0];
    const ctx = buildUserContext({
      ...baseState,
      logs: [{ id: '1', date: today, category: 'food', emissions: 5 }],
    });
    expect(ctx.todayFootprint).toBe(5);
  });
});