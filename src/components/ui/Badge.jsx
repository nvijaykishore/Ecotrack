import * as Icons from 'lucide-react';

export default function Badge({ badge, earned = true, size = 'md' }) {
  const Icon = Icons[badge.icon] || Icons.Award;
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  return (
    <div
      className={`flex flex-col items-center gap-1.5 ${!earned ? 'opacity-30' : ''}`}
      title={badge.description}
    >
      <div
        className={`${sizeClasses} rounded-2xl flex items-center justify-center ${
          earned
            ? 'bg-gradient-to-br from-eco-400 to-eco-600 text-white shadow-md'
            : 'bg-eco-100 dark:bg-eco-800 text-eco-400'
        }`}
      >
        <Icon className={iconSize} />
      </div>
      <span className="text-xs font-medium text-eco-700 dark:text-eco-300 text-center leading-tight max-w-[72px]">
        {badge.name}
      </span>
    </div>
  );
}