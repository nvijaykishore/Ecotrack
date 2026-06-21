import { Check, Plus, RotateCcw } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ChallengeCard({ challenge }) {
  const progress = useStore((s) => s.challengeProgress[challenge.id]);
  const startChallenge = useStore((s) => s.startChallenge);
  const checkInChallenge = useStore((s) => s.checkInChallenge);
  const resetChallenge = useStore((s) => s.resetChallenge);

  const Icon = Icons[challenge.icon] || Icons.Target;
  const daysCompleted = progress?.daysCompleted || 0;
  const isStarted = !!progress?.startedAt;
  const isCompleted = progress?.completed;
  const progressPercent = Math.min(100, Math.round((daysCompleted / challenge.duration) * 100));

  const handleCheckIn = () => {
    const result = checkInChallenge(challenge.id);
    if (!result.success && result.message === 'Start the challenge first') {
      startChallenge(challenge.id);
      checkInChallenge(challenge.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        isCompleted
          ? 'border-eco-500 bg-eco-50 dark:bg-eco-800/50'
          : isStarted
            ? 'border-eco-300 dark:border-eco-600 bg-white dark:bg-eco-900'
            : 'border-eco-200 dark:border-eco-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? 'bg-eco-600 text-white'
              : 'bg-eco-100 dark:bg-eco-800 text-eco-600 dark:text-eco-300'
          }`}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-medium text-eco-800 dark:text-eco-100">{challenge.title}</p>
            <span className="text-sm font-semibold text-eco-600 flex-shrink-0">
              -{challenge.impact} kg
            </span>
          </div>
          <p className="text-xs text-eco-500 mb-3">{challenge.description}</p>

          {isStarted && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-eco-500 mb-1.5">
                <span>
                  {daysCompleted} / {challenge.duration} days
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2.5 bg-eco-100 dark:bg-eco-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-eco-600'
                      : 'bg-gradient-to-r from-eco-400 to-eco-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isStarted && !isCompleted && (
              <button
                onClick={() => startChallenge(challenge.id)}
                className="btn-primary text-sm py-2 px-4"
              >
                Start Challenge
              </button>
            )}
            {isStarted && !isCompleted && (
              <button
                onClick={handleCheckIn}
                className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Check In Today
              </button>
            )}
            {isCompleted && (
              <button
                onClick={() => resetChallenge(challenge.id)}
                className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}