import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import Onboarding from './pages/Onboarding';

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

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <Layout>
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
    </Layout>
  );
}

export default App;