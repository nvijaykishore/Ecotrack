import { Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Header() {
  const profile = useStore((s) => s.profile);
  const streak = useStore((s) => s.streak);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-eco-950/80 backdrop-blur-md border-b border-eco-100 dark:border-eco-800">
      <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-eco-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-eco-800 dark:text-eco-100 leading-tight">
              EcoTrack
            </h1>
            <p className="text-xs text-eco-500 dark:text-eco-400">
              {profile.name ? `Hi, ${profile.name}` : 'Carbon Awareness'}
            </p>
          </div>
        </div>

        {streak.current > 0 && (
          <div className="flex items-center gap-1.5 bg-earth-100 dark:bg-earth-900/40 px-3 py-1.5 rounded-full">
            <span className="text-base">🔥</span>
            <span className="text-sm font-semibold text-earth-700 dark:text-earth-300">
              {streak.current} day{streak.current !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}