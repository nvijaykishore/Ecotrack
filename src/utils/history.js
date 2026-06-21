export function rebuildHistory(logs, existingHistory = []) {
  const dateTotals = {};
  logs.forEach((l) => {
    dateTotals[l.date] = (dateTotals[l.date] || 0) + l.emissions;
  });

  return Object.entries(dateTotals)
    .map(([date, total]) => {
      const existing = existingHistory.find((h) => h.date === date);
      return {
        date,
        total: Math.round(total * 100) / 100,
        source:
          existing?.source === 'quiz' && total === existing.total ? 'quiz' : 'logs',
        breakdown: existing?.breakdown,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}