import { describe, it, expect } from 'vitest';
import { validateImportData, parseAndValidateImport } from '../importSchema';

describe('importSchema', () => {
  it('accepts valid export', () => {
    const result = validateImportData({
      version: '1.1',
      data: {
        onboardingComplete: true,
        profile: { name: 'Test', location: 'mumbai' },
        logs: [{
          id: '1',
          date: '2026-06-01',
          category: 'transport',
          itemId: 'metro',
          emissions: 1.5,
          quantity: 10,
        }],
        theme: 'light',
      },
    });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid version', () => {
    const result = validateImportData({ version: '9.9', data: {} });
    expect(result.valid).toBe(false);
  });

  it('rejects unexpected fields', () => {
    const result = validateImportData({
      version: '1.1',
      data: { onboardingComplete: true, injectedScript: '<script>' },
    });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid logs', () => {
    const result = validateImportData({
      version: '1.1',
      data: { logs: [{ id: 1, date: 'bad', emissions: -1 }] },
    });
    expect(result.valid).toBe(false);
  });

  it('rejects malformed JSON', () => {
    const result = parseAndValidateImport('{ invalid');
    expect(result.valid).toBe(false);
  });
});