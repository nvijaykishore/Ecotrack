import { Sparkles, Zap } from 'lucide-react';
import Card from '../ui/Card';
import { useStore } from '../../store/useStore';
import { getLevelInfo } from '../../utils/gamification';

export default function GamificationCard() {
  const gamification = useStore((s) => s.gamification);
  const levelInfo = getLevelInfo(gamification.xp);

  return (
    <Card
      title="Eco Level"
      subtitle="Earn XP by logging, completing actions & challenges"
      action={<Sparkles className="w-5 h-5 text-earth-400" />}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-earth-400 to-eco-600 flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-xl font-bold text-white">{levelInfo.level}</span>
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold text-eco-800 dark:text-eco-100">
            {levelInfo.title}
          </p>
          <p className="text-sm text-eco-500">{gamification.xp.toLocaleString()} XP total</p>
        </div>
      </div>

      {!levelInfo.isMax && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-eco-500 mb-1.5">
            <span>Level {levelInfo.level}</span>
            <span>Level {levelInfo.level + 1}</span>
          </div>
          <div className="h-3 bg-eco-100 dark:bg-eco-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-eco-500 to-moss-500 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <p className="text-xs text-eco-400 mt-1.5 text-center">
            {levelInfo.xpNeeded - levelInfo.xpInLevel} XP to next level
          </p>
        </div>
      )}

      {gamification.recentXpEvents.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-eco-100 dark:border-eco-800">
          <p className="text-xs font-medium text-eco-500 uppercase tracking-wide">Recent XP</p>
          {gamification.recentXpEvents.slice(0, 3).map((event, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-eco-50 dark:bg-eco-800/50"
            >
              <span className="text-eco-700 dark:text-eco-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-earth-500" />
                {event.reason}
              </span>
              <span className="font-semibold text-eco-600">+{event.amount}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}