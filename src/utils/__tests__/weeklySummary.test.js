import { describe, it, expect } from 'vitest';
import { getWeeklyComparison } from '../calculations';

describe('getWeeklyComparison', () => {
  it('returns hasData false when no logs', () => {
    expect(getWeeklyComparison([]).hasData).toBe(false);
  });

  it('computes week totals from logs', () => {
    const today = new Date();
    const d = today.toISOString().split('T')[0];
    const result = getWeeklyComparison([
      { date: d, emissions: 5 },
      { date: d, emissions: 3 },
    ]);
    expect(result.hasData).toBe(true);
    expect(result.thisWeek).toBe(8);
  });
});