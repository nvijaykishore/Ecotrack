import { describe, it, expect } from 'vitest';
import { validateLogInput, sanitizeNotes } from '../validation';

describe('validateLogInput', () => {
  it('accepts valid log data', () => {
    const result = validateLogInput({
      category: 'transport',
      itemId: 'metro',
      quantity: 10,
      date: '2026-06-01',
      notes: 'Office commute',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects future dates', () => {
    const result = validateLogInput({
      category: 'transport',
      itemId: 'metro',
      quantity: 10,
      date: '2099-01-01',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('future'))).toBe(true);
  });

  it('rejects unrealistic quantities', () => {
    const result = validateLogInput({
      category: 'transport',
      itemId: 'car_petrol',
      quantity: 50000,
      date: '2026-06-01',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects zero or negative quantity', () => {
    const result = validateLogInput({
      category: 'food',
      itemId: 'vegetarian_meal',
      quantity: 0,
      date: '2026-06-01',
    });
    expect(result.valid).toBe(false);
  });
});

describe('sanitizeNotes', () => {
  it('strips HTML tags', () => {
    expect(sanitizeNotes('<script>alert(1)</script>hello')).toBe('alert(1)hello');
  });

  it('truncates long notes', () => {
    expect(sanitizeNotes('a'.repeat(300)).length).toBeLessThanOrEqual(200);
  });
});