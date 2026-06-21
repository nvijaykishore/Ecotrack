import Navbar from './Navbar';
import Header from './Header';
import BadgeToast from '../gamification/BadgeToast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <BadgeToast />
      <Header />
      <main
        id="main-content"
        className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-4xl"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Navbar />
    </div>
  );
}