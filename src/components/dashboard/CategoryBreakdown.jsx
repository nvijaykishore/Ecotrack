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
      <div aria-hidden="true">
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
      </div>
      <details className="mt-4">
        <summary className="text-sm text-eco-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-eco-500 rounded">
          View data table (accessible alternative)
        </summary>
        <table className="w-full mt-2 text-sm" aria-label="Monthly emissions by category">
          <caption className="sr-only">This month emissions breakdown by category</caption>
          <thead>
            <tr className="text-left text-eco-500 border-b border-eco-200 dark:border-eco-700">
              <th scope="col" className="py-2 pr-4">Category</th>
              <th scope="col" className="py-2">kg CO₂e</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.name} className="border-b border-eco-100 dark:border-eco-800">
                <td className="py-1.5 pr-4">{row.name}</td>
                <td className="py-1.5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Card>
  );
}