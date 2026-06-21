import { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useStore } from '../../store/useStore';
import { BADGES } from '../../data/badges';

export default function BadgeToast() {
  const alert = useStore((s) => s.badgeAlert);
  const clearBadgeAlert = useStore((s) => s.clearBadgeAlert);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(clearBadgeAlert, 5000);
    return () => clearTimeout(timer);
  }, [alert, clearBadgeAlert]);

  if (!alert) return null;

  const badge = BADGES.find((b) => b.id === alert.id);
  if (!badge) return null;

  const Icon = Icons[badge.icon] || Icons.Award;

  return (
    <div
      className="fixed top-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-slide-up"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="pointer-events-auto max-w-sm w-full bg-white dark:bg-eco-900 rounded-2xl shadow-xl border border-eco-200 dark:border-eco-700 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-eco-400 to-eco-600 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-eco-500 uppercase tracking-wide">Badge Unlocked!</p>
          <p className="font-display font-semibold text-eco-800 dark:text-eco-100">{badge.name}</p>
          <p className="text-xs text-eco-500 truncate">{badge.description}</p>
        </div>
        <button
          onClick={clearBadgeAlert}
          className="text-eco-400 hover:text-eco-600 text-sm flex-shrink-0"
          aria-label="Dismiss badge notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}