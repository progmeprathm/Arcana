import { describe, it, expect } from 'vitest';
import { calculateLunarPhase, getLunarPhaseGlyph } from './lunar';

describe('Lunar Phase Calculation', () => {
  it('returns valid lunar phase properties', () => {
    const result = calculateLunarPhase('2026-11-05T00:00:00Z');
    expect(result).toHaveProperty('phase');
    expect(result).toHaveProperty('illumination');
    expect(result).toHaveProperty('age');
    expect(result.illumination).toBeGreaterThanOrEqual(0);
    expect(result.illumination).toBeLessThanOrEqual(100);
  });

  it('correctly maps glyphs for all phases', () => {
    expect(getLunarPhaseGlyph('New Moon')).toBe('🌑');
    expect(getLunarPhaseGlyph('Full Moon')).toBe('🌕');
    expect(getLunarPhaseGlyph('First Quarter')).toBe('🌓');
    expect(getLunarPhaseGlyph('Last Quarter')).toBe('🌗');
  });

  it('handles custom reference timestamps', () => {
    // Reference new moon Jan 11, 2024
    const result = calculateLunarPhase('2024-01-11T12:00:00Z');
    expect(result.phase).toBe('New Moon');
  });
});
