import { describe, it, expect } from 'vitest';
import { calculateEmissions, getEmissionFactor, TRANSPORT } from '../emissionFactors';

describe('emissionFactors', () => {
  it('calculates transport emissions', () => {
    expect(calculateEmissions('transport', 'metro', 10)).toBeCloseTo(0.33, 2);
  });

  it('includes car pooling option', () => {
    expect(TRANSPORT.car_pooling).toBeDefined();
    expect(TRANSPORT.car_pooling.label).toBe('Car Pooling');
  });

  it('returns zero for walk/cycle', () => {
    expect(getEmissionFactor('transport', 'walk_cycle')).toBe(0);
  });

  it('uses grid factor for electricity', () => {
    expect(calculateEmissions('electricity', 'electricity', 100)).toBeCloseTo(82, 0);
  });
});