import { TrendingDown, TrendingUp, Target } from 'lucide-react';
import { MUMBAI_AVERAGES } from '../../data/emissionFactors';
import { getFootprintRating } from '../../utils/calculations';

export default function FootprintCard({ todayFootprint, monthlyTotal, baseline, goals }) {
  const rating = getFootprintRating(todayFootprint);
  const changeFromBaseline = baseline > 0 ? todayFootprint - baseline : 0;
  const goalProgress = goals.dailyTarget > 0
    ? Math.round((1 - todayFootprint / goals.dailyTarget) * 100)
    : null;

  return (
    <div className="card bg-gradient-to-br from-eco-600 to-moss-600 text-white border-0 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-eco-100 text-sm font-medium">Today's Footprint</p>
          <p className="text-4xl font-display font-bold mt-1">
            {todayFootprint.toFixed(1)}
            <span className="text-lg font-normal text-eco-200 ml-1">kg CO₂e</span>
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          {rating.label}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
        <div>
          <p className="text-eco-200 text-xs">This Month</p>
          <p className="font-semibold text-lg">{monthlyTotal.toFixed(0)} kg</p>
        </div>
        <div>
          <p className="text-eco-200 text-xs flex items-center gap-1">
            {changeFromBaseline <= 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            vs Baseline
          </p>
          <p className="font-semibold text-lg">
            {baseline > 0
              ? `${changeFromBaseline > 0 ? '+' : ''}${changeFromBaseline.toFixed(1)}`
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-eco-200 text-xs flex items-center gap-1">
            <Target className="w-3 h-3" />
            Goal
          </p>
          <p className="font-semibold text-lg">
            {goalProgress !== null ? `${goalProgress > 0 ? goalProgress + '% under' : Math.abs(goalProgress) + '% over'}` : '—'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex justify-between text-xs text-eco-200 mb-1.5">
          <span>Mumbai avg: {MUMBAI_AVERAGES.dailyFootprint} kg/day</span>
          <span>Sustainable: {Math.round(MUMBAI_AVERAGES.sustainableTarget * 1000 / 365)} kg/day</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all"
            style={{
              width: `${Math.min((todayFootprint / MUMBAI_AVERAGES.dailyFootprint) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}