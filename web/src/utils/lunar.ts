export type LunarPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

/**
 * Calculates current or specified date's approximate lunar phase using astronomical epoch calculation.
 */
export function calculateLunarPhase(dateInput?: string | Date): { phase: LunarPhaseName; illumination: number; age: number } {
  const date = dateInput ? new Date(dateInput) : new Date();
  
  // Known reference new moon: January 11, 2024 11:57 UTC
  const refNewMoonMs = Date.UTC(2024, 0, 11, 11, 57, 0);
  const synodicMonthDays = 29.53058867;
  const msPerDay = 86400000;
  
  const diffDays = (date.getTime() - refNewMoonMs) / msPerDay;
  const normalizedAge = ((diffDays % synodicMonthDays) + synodicMonthDays) % synodicMonthDays;
  
  // Illumination calculation: 0.5 * (1 - cos(2 * pi * age / synodicMonth))
  const illumination = Math.round(0.5 * (1 - Math.cos((2 * Math.PI * normalizedAge) / synodicMonthDays)) * 100);

  let phase: LunarPhaseName;
  if (normalizedAge < 1.84566) {
    phase = 'New Moon';
  } else if (normalizedAge < 5.53699) {
    phase = 'Waxing Crescent';
  } else if (normalizedAge < 9.22831) {
    phase = 'First Quarter';
  } else if (normalizedAge < 12.91963) {
    phase = 'Waxing Gibbous';
  } else if (normalizedAge < 16.61096) {
    phase = 'Full Moon';
  } else if (normalizedAge < 20.30228) {
    phase = 'Waning Gibbous';
  } else if (normalizedAge < 23.99361) {
    phase = 'Last Quarter';
  } else if (normalizedAge < 27.68493) {
    phase = 'Waning Crescent';
  } else {
    phase = 'New Moon';
  }

  return {
    phase,
    illumination,
    age: Math.round(normalizedAge * 10) / 10
  };
}

export function getLunarPhaseGlyph(phase: LunarPhaseName): string {
  switch (phase) {
    case 'New Moon': return '🌑';
    case 'Waxing Crescent': return '🌒';
    case 'First Quarter': return '🌓';
    case 'Waxing Gibbous': return '🌔';
    case 'Full Moon': return '🌕';
    case 'Waning Gibbous': return '🌖';
    case 'Last Quarter': return '🌗';
    case 'Waning Crescent': return '🌘';
  }
}
