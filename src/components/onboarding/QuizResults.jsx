import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { MUMBAI_AVERAGES } from '../../data/emissionFactors';
import { getFootprintRating } from '../../utils/calculations';

const COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7'];

export default function QuizResults({ results, profile, onComplete, onBack }) {
  const chartData = Object.entries(results.breakdown)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 10) / 10,
    }));

  const rating = getFootprintRating(results.dailyTotal);
  const vsAverage = ((results.dailyTotal / MUMBAI_AVERAGES.dailyFootprint - 1) * 100).toFixed(0);

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-eco-50 to-eco-100 dark:from-eco-950 dark:to-eco-900">
      <div className="max-w-lg mx-auto animate-slide-up">
        <button
          className="flex items-center gap-1 text-eco-600 dark:text-eco-400 mb-6 text-sm"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to quiz
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100 mb-2">
            {profile.name ? `${profile.name}'s` : 'Your'} Carbon Profile
          </h2>
          <p className="text-eco-500 dark:text-eco-400">Based on your quiz answers</p>
        </div>

        <div className="card mb-6 text-center">
          <p className="text-sm text-eco-500 mb-1">Estimated Daily Footprint</p>
          <p className="text-5xl font-display font-bold text-eco-800 dark:text-eco-100">
            {results.dailyTotal}
            <span className="text-lg font-normal text-eco-500 ml-1">kg CO₂e</span>
          </p>
          <div
            className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: rating.color }}
          >
            {rating.label}
          </div>
          <p className="text-sm text-eco-500 mt-3">
            {vsAverage > 0
              ? `${vsAverage}% above Mumbai average (${MUMBAI_AVERAGES.dailyFootprint} kg/day)`
              : `${Math.abs(vsAverage)}% below Mumbai average (${MUMBAI_AVERAGES.dailyFootprint} kg/day)`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-eco-700 dark:text-eco-200">
              {results.monthlyTotal}
            </p>
            <p className="text-xs text-eco-500">kg/month</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-eco-700 dark:text-eco-200">
              {(results.annualTotal / 1000).toFixed(1)}
            </p>
            <p className="text-xs text-eco-500">tonnes/year</p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="card mb-6">
            <h3 className="font-display font-semibold text-eco-800 dark:text-eco-100 mb-4">
              Monthly Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} kg CO₂e`, '']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {chartData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-eco-600 dark:text-eco-400">
                    {entry.name}: {entry.value} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={onComplete}
        >
          Start Tracking
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}