import { Lightbulb } from 'lucide-react';
import Card from '../ui/Card';
import { getPersonalizedTips } from '../../utils/calculations';

const PRIORITY_STYLES = {
  high: 'border-l-eco-600 bg-eco-50 dark:bg-eco-800/50',
  medium: 'border-l-earth-500 bg-earth-50 dark:bg-earth-900/20',
  low: 'border-l-eco-300 bg-white dark:bg-eco-900',
};

export default function TipsCard({ profile, logs, breakdown }) {
  const tips = getPersonalizedTips(profile, logs, breakdown);

  return (
    <Card
      title="Personalized Tips"
      subtitle="Based on your activity patterns"
      action={<Lightbulb className="w-5 h-5 text-earth-500" />}
    >
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border-l-4 ${PRIORITY_STYLES[tip.priority]}`}
          >
            <p className="font-medium text-sm text-eco-800 dark:text-eco-100">{tip.title}</p>
            <p className="text-sm text-eco-600 dark:text-eco-400 mt-1">{tip.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}