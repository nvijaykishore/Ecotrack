import { MUMBAI_AVERAGES } from '../data/emissionFactors';

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getMonthString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getLogsForDate(logs, date) {
  return logs.filter((l) => l.date === date);
}

export function getLogsForMonth(logs, monthStr) {
  return logs.filter((l) => l.date.startsWith(monthStr));
}

export function getDailyTotal(logs, date) {
  return getLogsForDate(logs, date).reduce((sum, l) => sum + l.emissions, 0);
}

export function getMonthlyTotal(logs, monthStr) {
  return getLogsForMonth(logs, monthStr).reduce((sum, l) => sum + l.emissions, 0);
}

export function getCategoryBreakdown(logs, period = 'month') {
  const now = new Date();
  const monthStr = getMonthString(now);
  const today = getTodayString();

  const filtered = period === 'day'
    ? logs.filter((l) => l.date === today)
    : logs.filter((l) => l.date.startsWith(monthStr));

  const breakdown = {};
  filtered.forEach((log) => {
    breakdown[log.category] = (breakdown[log.category] || 0) + log.emissions;
  });

  return Object.entries(breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value * 100) / 100,
  }));
}

export function getTrendData(history, days = 14) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = history.find((h) => h.date === dateStr);
    const dayLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    data.push({
      date: dateStr,
      label: dayLabel,
      footprint: entry?.total ?? 0,
      target: MUMBAI_AVERAGES.dailyFootprint * 0.8,
    });
  }

  return data;
}

export function updateStreak(streak, logDate) {
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (logDate === today) {
    if (streak.lastLogDate === yesterdayStr) {
      return {
        current: streak.current + 1,
        longest: Math.max(streak.longest, streak.current + 1),
        lastLogDate: today,
      };
    }
    if (streak.lastLogDate === today) {
      return streak;
    }
    return {
      current: 1,
      longest: Math.max(streak.longest, 1),
      lastLogDate: today,
    };
  }

  return streak;
}

export function getPersonalizedTips(profile, logs, breakdown) {
  const tips = [];
  const monthlyLogs = getLogsForMonth(logs, getMonthString());

  if (!monthlyLogs.length) {
    tips.push({
      title: 'Start Logging',
      text: 'Log your daily activities to get personalized insights about your carbon footprint.',
      priority: 'high',
    });
  }

  const transportTotal = monthlyLogs
    .filter((l) => l.category === 'transport')
    .reduce((s, l) => s + l.emissions, 0);
  const electricityTotal = monthlyLogs
    .filter((l) => l.category === 'electricity')
    .reduce((s, l) => s + l.emissions, 0);
  const foodTotal = monthlyLogs
    .filter((l) => l.category === 'food')
    .reduce((s, l) => s + l.emissions, 0);

  if (transportTotal > 50 || (breakdown?.transport > 80)) {
    tips.push({
      title: 'Switch to Public Transport',
      text: 'Your transport emissions are high. Try Mumbai Metro or local trains — they emit 70% less CO₂ than cars.',
      priority: 'high',
    });
  }

  if (electricityTotal > 60 || (breakdown?.electricity > 70)) {
    tips.push({
      title: 'Optimize AC Usage',
      text: 'Set AC to 26°C and use ceiling fans. This can cut electricity emissions by 20-30% in Mumbai summers.',
      priority: 'high',
    });
  }

  if (foodTotal > 40 || (breakdown?.food > 50)) {
    tips.push({
      title: 'Try Meatless Days',
      text: 'Adding 2-3 vegetarian days per week can reduce food emissions by 25%. Indian vegetarian meals are naturally low-carbon!',
      priority: 'medium',
    });
  }

  if (profile?.location === 'mumbai') {
    tips.push({
      title: 'Mumbai Monsoon Tip',
      text: 'Use rainwater harvesting during monsoon — Mumbai receives 2000+ mm rainfall annually.',
      priority: 'low',
    });
  }

  tips.push({
    title: 'Segregate Your Waste',
    text: 'BMC mandates waste segregation. Composting wet waste alone can save 15% of household emissions.',
    priority: 'medium',
  });

  return tips.slice(0, 4);
}

export function getWeeklyComparison(logs) {
  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - 6);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - 13);
  const lastWeekEnd = new Date(today);
  lastWeekEnd.setDate(today.getDate() - 7);

  const sumRange = (start, end) => {
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return logs
      .filter((l) => l.date >= startStr && l.date <= endStr)
      .reduce((s, l) => s + l.emissions, 0);
  };

  const thisWeek = sumRange(thisWeekStart, today);
  const lastWeek = sumRange(lastWeekStart, lastWeekEnd);
  const hasData = thisWeek > 0 || lastWeek > 0;
  const change = thisWeek - lastWeek;
  const changePercent = lastWeek > 0 ? Math.round((change / lastWeek) * 100) : null;

  return {
    thisWeek: Math.round(thisWeek * 10) / 10,
    lastWeek: Math.round(lastWeek * 10) / 10,
    change: Math.round(change * 10) / 10,
    changePercent,
    hasData,
  };
}

export function getFootprintRating(dailyKg) {
  if (dailyKg <= 6) return { label: 'Excellent', color: '#22c55e', level: 1 };
  if (dailyKg <= 10) return { label: 'Good', color: '#84cc16', level: 2 };
  if (dailyKg <= 14) return { label: 'Average', color: '#f59e0b', level: 3 };
  if (dailyKg <= 20) return { label: 'Above Average', color: '#f97316', level: 4 };
  return { label: 'High', color: '#ef4444', level: 5 };
}