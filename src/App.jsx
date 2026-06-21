import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Onboarding from './pages/Onboarding';
import { STORAGE_QUOTA_EVENT } from './utils/storage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Actions = lazy(() => import('./pages/Actions'));
const Education = lazy(() => import('./pages/Education'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <p className="text-eco-500">Loading…</p>
    </div>
  );
}

function App() {
  const theme = useStore((s) => s.theme);
  const onboardingComplete = useStore((s) => s.onboardingComplete);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const onQuota = (e) => {
      alert(e.detail?.message || 'Storage quota exceeded. Please export and clear old data.');
    };
    window.addEventListener(STORAGE_QUOTA_EVENT, onQuota);
    return () => window.removeEventListener(STORAGE_QUOTA_EVENT, onQuota);
  }, []);

  if (!onboardingComplete) {
    return (
      <ErrorBoundary>
        <Onboarding />
      </ErrorBoundary>
    );
  }

  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/education" element={<Education />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;