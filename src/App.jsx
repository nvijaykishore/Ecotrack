import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Actions from './pages/Actions';
import Education from './pages/Education';
import Settings from './pages/Settings';

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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<Log />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/education" element={<Education />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;