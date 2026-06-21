export default function ProgressRing({
  percent = 0,
  size = 100,
  stroke = 8,
  color = '#2d6a4f',
  trackColor = '#dceee5',
  label,
  sublabel,
  status = 'good',
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  const statusColors = {
    good: color,
    warning: '#f59e0b',
    over: '#ef4444',
    none: '#94a3b8',
  };

  const ringColor = statusColors[status] || color;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={stroke}
            className="dark:opacity-30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-eco-800 dark:text-eco-100">
            {percent}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium text-eco-700 dark:text-eco-200 mt-2">{label}</p>
      )}
      {sublabel && (
        <p className="text-xs text-eco-500 dark:text-eco-400 text-center">{sublabel}</p>
      )}
    </div>
  );
}