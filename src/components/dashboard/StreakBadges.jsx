import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useStore } from '../../store/useStore';
import { BADGES } from '../../data/badges';
import { getLevelInfo } from '../../utils/gamification';
import { Flame, Trophy, Zap } from 'lucide-react';

export default function StreakBadges() {
  const streak = useStore((s) => s.streak);
  const earnedBadgeIds = useStore((s) => s.earnedBadgeIds);
  const gamification = useStore((s) => s.gamification);
  const levelInfo = getLevelInfo(gamification.xp);

  const earnedBadges = BADGES.filter((b) => earnedBadgeIds.includes(b.id));
  const lockedBadges = BADGES.filter((b) => !earnedBadgeIds.includes(b.id));

  return (
    <Card title="Streaks & Badges" subtitle={`Level ${levelInfo.level} · ${levelInfo.title}`}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center p-3 bg-earth-50 dark:bg-earth-900/20 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <p className="text-xl font-bold text-eco-800 dark:text-eco-100">{streak.current}</p>
          <p className="text-xs text-eco-500">Streak</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-earth-50 dark:bg-earth-900/20 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <p className="text-xl font-bold text-eco-800 dark:text-eco-100">{streak.longest}</p>
          <p className="text-xs text-eco-500">Best</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-earth-50 dark:bg-earth-900/20 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-xl font-bold text-eco-800 dark:text-eco-100">
            {earnedBadgeIds.length}
          </p>
          <p className="text-xs text-eco-500">Badges</p>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-eco-500 uppercase tracking-wide mb-3">Earned</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {earnedBadges.map((badge) => (
              <Badge key={badge.id} badge={badge} earned size="sm" />
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <p className="text-xs font-medium text-eco-500 uppercase tracking-wide mb-3">Locked</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {lockedBadges.map((badge) => (
              <Badge key={badge.id} badge={badge} earned={false} size="sm" />
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-eco-400 mt-4">
        {earnedBadgeIds.length} of {BADGES.length} badges earned
      </p>
    </Card>
  );
}