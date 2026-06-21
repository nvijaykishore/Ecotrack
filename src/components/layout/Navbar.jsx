import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenLine, Zap, BookOpen, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/log', icon: PenLine, label: 'Log' },
  { to: '/actions', icon: Zap, label: 'Actions' },
  { to: '/education', icon: BookOpen, label: 'Learn' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-eco-950/90 backdrop-blur-md border-t border-eco-100 dark:border-eco-800 safe-area-bottom">
      <div className="container mx-auto max-w-4xl px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}