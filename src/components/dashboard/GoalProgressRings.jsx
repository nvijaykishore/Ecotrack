import Card from '../ui/Card';
import ProgressRing from '../ui/ProgressRing';
import { getGoalRingProgress } from '../../utils/gamification';

export default function GoalProgressRings({ todayFootprint, monthlyTotal, goals }) {
  const daily = getGoalRingProgress(todayFootprint, goals.dailyTarget);
  const monthly = getGoalRingProgress(monthlyTotal, goals.monthlyTarget);

  if (!goals.dailyTarget && !goals.monthlyTarget) {
    return (
      <Card title="Goal Progress" subtitle="Set targets in Settings to track progress">
        <p className="text-sm text-eco-400 text-center py-4">
          No goals set yet. Visit Settings to define your daily and monthly targets.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Goal Progress" subtitle="Stay under your carbon targets">
      <div className="flex justify-around items-start gap-4 py-2">
        {goals.dailyTarget > 0 && (
          <ProgressRing
            percent={daily.percent}
            status={daily.status}
            label="Daily"
            sublabel={
              daily.status === 'over'
                ? `${(todayFootprint - goals.dailyTarget).toFixed(1)} kg over`
                : `${daily.remaining.toFixed(1)} kg left`
            }
            color="#2d6a4f"
            trackColor="#dceee5"
          />
        )}
        {goals.monthlyTarget > 0 && (
          <ProgressRing
            percent={monthly.percent}
            status={monthly.status}
            label="Monthly"
            sublabel={
              monthly.status === 'over'
                ? `${(monthlyTotal - goals.monthlyTarget).toFixed(0)} kg over`
                : `${monthly.remaining.toFixed(0)} kg left`
            }
            color="#588157"
            trackColor="#dceee5"
          />
        )}
      </div>
      <p className="text-xs text-eco-400 text-center mt-3">
        Lower is better — rings fill as you approach your limit
      </p>
    </Card>
  );
}