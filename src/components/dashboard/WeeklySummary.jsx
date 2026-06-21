import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import Card from '../ui/Card';
import { getWeeklyComparison } from '../../utils/calculations';

export default function WeeklySummary({ logs }) {
  const comparison = getWeeklyComparison(logs);

  if (!comparison.hasData) {
    return (
      <Card title="Weekly Summary" subtitle="This week vs last week">
        <p className="text-sm text-eco-400 text-center py-4">
          Log activities for two weeks to see week-over-week comparison.
        </p>
      </Card>
    );
  }

  const Icon = comparison.change < 0 ? TrendingDown : comparison.change > 0 ? TrendingUp : Minus;
  const changeLabel = comparison.change < 0
    ? `${Math.abs(comparison.change).toFixed(1)} kg less`
    : comparison.change > 0
      ? `${comparison.change.toFixed(1)} kg more`
      : 'No change';

  return (
    <Card title="Weekly Summary" subtitle="This week vs last week">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-eco-50 dark:bg-eco-800/50">
          <p className="text-lg font-bold text-eco-800 dark:text-eco-100">
            {comparison.thisWeek.toFixed(1)}
          </p>
          <p className="text-xs text-eco-500">This week (kg)</p>
        </div>
        <div className="p-3 rounded-xl bg-eco-50 dark:bg-eco-800/50">
          <p className="text-lg font-bold text-eco-800 dark:text-eco-100">
            {comparison.lastWeek.toFixed(1)}
          </p>
          <p className="text-xs text-eco-500">Last week (kg)</p>
        </div>
        <div className="p-3 rounded-xl bg-earth-50 dark:bg-earth-900/20 flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 text-eco-600 mb-1" aria-hidden="true" />
          <p className="text-sm font-semibold text-eco-700 dark:text-eco-200">{changeLabel}</p>
          <p className="text-xs text-eco-500">
            {comparison.changePercent !== null ? `${comparison.changePercent}%` : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}