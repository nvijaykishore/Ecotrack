import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import Card from '../ui/Card';
import { getTrendData } from '../../utils/calculations';
import { MUMBAI_AVERAGES } from '../../data/emissionFactors';

export default function TrendChart({ history, logs }) {
  const trendData = getTrendData(history, 14);

  const hasLogData = logs.length > 0;
  if (!hasLogData && history.length <= 1) {
    return (
      <Card title="14-Day Trend" subtitle="Log activities to see your trend">
        <div className="h-48 flex items-center justify-center text-eco-400 text-sm">
          Start logging to build your footprint history
        </div>
      </Card>
    );
  }

  return (
    <Card title="14-Day Trend" subtitle="Daily carbon footprint (kg CO₂e)">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="footprintGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value} kg CO₂e`, 'Footprint']}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <ReferenceLine
            y={MUMBAI_AVERAGES.dailyFootprint}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            label={{ value: 'Avg', position: 'right', fontSize: 10, fill: '#f59e0b' }}
          />
          <Area
            type="monotone"
            dataKey="footprint"
            stroke="#2d6a4f"
            strokeWidth={2}
            fill="url(#footprintGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}