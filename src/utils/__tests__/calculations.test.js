import { describe, it, expect } from 'vitest';
import {
  getDailyTotal,
  getMonthlyTotal,
  updateStreak,
  getFootprintRating,
  getCategoryBreakdown,
  getPersonalizedTips,
} from '../calculations';

const sampleLogs = [
  { id: '1', date: '2026-06-10', category: 'transport', emissions: 5 },
  { id: '2', date: '2026-06-10', category: 'food', emissions: 3 },
  { id: '3', date: '2026-06-11', category: 'electricity', emissions: 8 },
];

describe('calculations', () => {
  it('sums daily totals', () => {
    expect(getDailyTotal(sampleLogs, '2026-06-10')).toBe(8);
  });

  it('sums monthly totals', () => {
    expect(getMonthlyTotal(sampleLogs, '2026-06')).toBe(16);
  });

  it('extends streak on consecutive days', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const result = updateStreak(
      { current: 3, longest: 5, lastLogDate: yesterdayStr },
      today
    );
    expect(result.current).toBe(4);
    expect(result.longest).toBe(5);
  });

  it('resets streak after gap', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = updateStreak(
      { current: 5, longest: 5, lastLogDate: '2020-01-01' },
      today
    );
    expect(result.current).toBe(1);
  });

  it('rates footprint correctly', () => {
    expect(getFootprintRating(5).label).toBe('Excellent');
    expect(getFootprintRating(15).label).toBe('Above Average');
  });

  it('breaks down categories for month', () => {
    const breakdown = getCategoryBreakdown(sampleLogs, 'month');
    expect(breakdown.find((c) => c.name === 'Transport').value).toBe(5);
  });

  it('returns tips for empty logs', () => {
    const tips = getPersonalizedTips({ location: 'mumbai' }, [], null);
    expect(tips[0].title).toBe('Start Logging');
  });
});