import { Link } from 'react-router-dom';
import { Bot, ChevronRight, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import { useStore } from '../../store/useStore';
import { generateAssistantResponse } from '../../assistant/ecoAssistant';

const TYPE_STYLES = {
  alert: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  reminder: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20',
  recommendation: 'border-l-eco-600 bg-eco-50 dark:bg-eco-800/50',
  action: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
  encouragement: 'border-l-earth-500 bg-earth-50 dark:bg-earth-900/20',
  insight: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
  engagement: 'border-l-eco-400 bg-eco-50 dark:bg-eco-800/30',
};

export default function EcoAssistantCard() {
  const state = useStore();
  const response = generateAssistantResponse(state);

  return (
    <Card
      title="Eco Assistant"
      subtitle={response.greeting}
      action={<Bot className="w-5 h-5 text-eco-600" aria-hidden="true" />}
    >
      <div
        className="p-4 rounded-xl bg-gradient-to-r from-eco-600/10 to-moss-600/10 border border-eco-200 dark:border-eco-700 mb-4"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-eco-600 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-eco-800 dark:text-eco-100 leading-relaxed">
              {response.summary}
            </p>
            {response.nextBestAction && (
              <Link
                to={response.nextBestAction.action.route}
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-eco-600 hover:text-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-500 rounded"
              >
                {response.nextBestAction.action.label}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {response.recommendations.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-eco-500 uppercase tracking-wide mb-3">
            Context-based recommendations
          </h4>
          <ul className="space-y-3" aria-label="Assistant recommendations">
            {response.recommendations.map((rec) => (
              <li
                key={rec.id}
                className={`p-3 rounded-xl border-l-4 ${TYPE_STYLES[rec.type] || TYPE_STYLES.recommendation}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-eco-800 dark:text-eco-100">{rec.title}</p>
                    <p className="text-sm text-eco-600 dark:text-eco-400 mt-1">{rec.message}</p>
                    <details className="mt-1.5">
                      <summary className="text-xs text-eco-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-eco-500 rounded">
                        Why this recommendation?
                      </summary>
                      <p className="text-xs text-eco-400 mt-1 italic">{rec.reasoning}</p>
                    </details>
                  </div>
                  {rec.impactKg != null && (
                    <span className="text-xs font-semibold text-eco-600 whitespace-nowrap">
                      ~{rec.impactKg} kg
                    </span>
                  )}
                </div>
                <Link
                  to={rec.action.route}
                  className="inline-block mt-2 text-xs font-semibold text-eco-600 hover:underline focus:outline-none focus:ring-2 focus:ring-eco-500 rounded"
                >
                  {rec.action.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}