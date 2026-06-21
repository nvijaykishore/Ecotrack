import Navbar from './Navbar';
import Header from './Header';
import BadgeToast from '../gamification/BadgeToast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <BadgeToast />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-4xl">
        {children}
      </main>
      <Navbar />
    </div>
  );
}