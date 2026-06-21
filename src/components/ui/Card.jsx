export default function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`card animate-fade-in ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="font-display font-semibold text-eco-800 dark:text-eco-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-eco-500 dark:text-eco-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}