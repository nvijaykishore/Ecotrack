import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import { getCategoryBreakdown } from '../../utils/calculations';

const COLORS = {
  Electricity: '#f59e0b',
  Transport: '#3b82f6',
  Food: '#22c55e',
  Home: '#ef4444',
  Shopping: '#a855f7',
};

export default function CategoryBreakdown({ logs }) {
  const data = getCategoryBreakdown(logs, 'month');

  if (data.length === 0) {
    return (
      <Card title="Category Breakdown" subtitle="This month's emissions by category">
        <div className="h-40 flex items-center justify-center text-eco-400 text-sm">
          No logs this month yet
        </div>
      </Card>
    );
  }

  return (
    <Card title="Category Breakdown" subtitle="This month's emissions by category">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
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
            formatter={(value) => [`${value} kg CO₂e`, '']}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#2d6a4f'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}