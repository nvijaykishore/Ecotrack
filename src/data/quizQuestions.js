export const QUIZ_QUESTIONS = [
  {
    id: 'location',
    question: 'Where do you live?',
    type: 'single',
    options: [
      { id: 'mumbai', label: 'Mumbai', icon: '🏙️', weights: { transport: 1.2, electricity: 1.1 } },
      { id: 'metro', label: 'Other Metro City', icon: '🌆', weights: { transport: 1.1, electricity: 1.0 } },
      { id: 'tier2', label: 'Tier 2/3 City', icon: '🏘️', weights: { transport: 0.9, electricity: 0.85 } },
      { id: 'rural', label: 'Rural Area', icon: '🌾', weights: { transport: 0.6, electricity: 0.5 } },
    ],
  },
  {
    id: 'household',
    question: 'How many people live in your household?',
    type: 'single',
    options: [
      { id: '1', label: 'Just me', value: 1, weights: { home: 1.0 } },
      { id: '2', label: '2 people', value: 2, weights: { home: 0.85 } },
      { id: '3-4', label: '3-4 people', value: 3.5, weights: { home: 0.7 } },
      { id: '5+', label: '5+ people', value: 5, weights: { home: 0.55 } },
    ],
  },
  {
    id: 'transport_commute',
    question: 'How do you usually commute?',
    type: 'single',
    options: [
      { id: 'walk_cycle', label: 'Walk / Cycle', icon: '🚶', emissions: { transport: 0.5 } },
      { id: 'public', label: 'Bus / Train / Metro', icon: '🚇', emissions: { transport: 2.8 } },
      { id: 'bike', label: 'Motorcycle / Scooter', icon: '🏍️', emissions: { transport: 4.5 } },
      { id: 'car', label: 'Car (own or shared)', icon: '🚗', emissions: { transport: 8.2 } },
      { id: 'wfh', label: 'Work from Home', icon: '🏠', emissions: { transport: 0.3 } },
    ],
  },
  {
    id: 'transport_distance',
    question: 'Daily commute distance (one way)?',
    type: 'single',
    options: [
      { id: '0', label: 'No commute', multiplier: 0 },
      { id: '5', label: 'Under 5 km', multiplier: 0.5 },
      { id: '15', label: '5-15 km', multiplier: 1.0 },
      { id: '30', label: '15-30 km', multiplier: 1.5 },
      { id: '50', label: 'Over 30 km', multiplier: 2.2 },
    ],
  },
  {
    id: 'electricity',
    question: 'Monthly electricity bill range?',
    type: 'single',
    options: [
      { id: 'low', label: 'Under ₹500', emissions: { electricity: 15 } },
      { id: 'medium', label: '₹500 - ₹1500', emissions: { electricity: 45 } },
      { id: 'high', label: '₹1500 - ₹3000', emissions: { electricity: 90 } },
      { id: 'very_high', label: 'Over ₹3000', emissions: { electricity: 150 } },
    ],
  },
  {
    id: 'diet',
    question: 'What best describes your diet?',
    type: 'single',
    options: [
      { id: 'vegan', label: 'Vegan / Plant-based', icon: '🥗', emissions: { food: 3.5 } },
      { id: 'vegetarian', label: 'Vegetarian', icon: '🍛', emissions: { food: 5.2 } },
      { id: 'occasional', label: 'Occasional non-veg', icon: '🍗', emissions: { food: 7.8 } },
      { id: 'regular', label: 'Regular non-veg', icon: '🍖', emissions: { food: 11.5 } },
    ],
  },
  {
    id: 'flights',
    question: 'How often do you fly per year?',
    type: 'single',
    options: [
      { id: 'never', label: 'Never', emissions: { transport: 0 } },
      { id: '1-2', label: '1-2 times', emissions: { transport: 25 } },
      { id: '3-5', label: '3-5 times', emissions: { transport: 60 } },
      { id: '6+', label: '6+ times', emissions: { transport: 120 } },
    ],
  },
  {
    id: 'shopping',
    question: 'How often do you buy new clothes/gadgets?',
    type: 'single',
    options: [
      { id: 'rarely', label: 'Rarely (few times a year)', emissions: { shopping: 2 } },
      { id: 'monthly', label: 'Monthly', emissions: { shopping: 8 } },
      { id: 'weekly', label: 'Weekly', emissions: { shopping: 20 } },
      { id: 'frequent', label: 'Very frequently', emissions: { shopping: 35 } },
    ],
  },
  {
    id: 'waste',
    question: 'How do you handle waste?',
    type: 'single',
    options: [
      { id: 'compost', label: 'Compost + Recycle + Segregate', icon: '♻️', emissions: { home: 1.5 } },
      { id: 'recycle', label: 'Recycle when possible', icon: '🔄', emissions: { home: 3.0 } },
      { id: 'mixed', label: 'Mixed waste disposal', icon: '🗑️', emissions: { home: 5.5 } },
      { id: 'minimal', label: 'Minimal waste lifestyle', icon: '🌱', emissions: { home: 0.8 } },
    ],
  },
  {
    id: 'ac_usage',
    question: 'How often do you use AC?',
    type: 'single',
    options: [
      { id: 'never', label: 'Never / Rarely', emissions: { electricity: 0 } },
      { id: 'summer', label: 'Summer only (2-3 hrs/day)', emissions: { electricity: 20 } },
      { id: 'regular', label: 'Regular (4-6 hrs/day)', emissions: { electricity: 45 } },
      { id: 'always', label: 'Almost always on', emissions: { electricity: 80 } },
    ],
  },
];

export function calculateQuizFootprint(answers) {
  const breakdown = {
    transport: 0,
    electricity: 0,
    food: 0,
    home: 0,
    shopping: 0,
  };

  const commuteAnswer = answers.transport_commute;
  const distanceAnswer = answers.transport_distance;
  const multiplier = distanceAnswer?.multiplier ?? 1;

  if (commuteAnswer?.emissions?.transport) {
    breakdown.transport += commuteAnswer.emissions.transport * multiplier * 30;
  }

  const flightAnswer = answers.flights;
  if (flightAnswer?.emissions?.transport) {
    breakdown.transport += flightAnswer.emissions.transport;
  }

  ['electricity', 'diet', 'shopping', 'waste', 'ac_usage'].forEach((key) => {
    const answer = answers[key];
    if (!answer?.emissions) return;
    Object.entries(answer.emissions).forEach(([cat, val]) => {
      breakdown[cat] = (breakdown[cat] || 0) + val;
    });
  });

  if (answers.household?.value) {
    const divisor = Math.sqrt(answers.household.value);
    Object.keys(breakdown).forEach((key) => {
      if (key === 'transport') return;
      breakdown[key] = breakdown[key] / divisor;
    });
  }

  const locationWeights = answers.location?.weights;
  if (locationWeights) {
    Object.entries(locationWeights).forEach(([cat, weight]) => {
      if (breakdown[cat] !== undefined) {
        breakdown[cat] *= weight;
      }
    });
  }

  breakdown.home += 8;

  const monthlyTotal = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const dailyTotal = monthlyTotal / 30;

  return {
    breakdown,
    monthlyTotal: Math.round(monthlyTotal * 10) / 10,
    dailyTotal: Math.round(dailyTotal * 100) / 100,
    annualTotal: Math.round(monthlyTotal * 12 * 10) / 10,
  };
}