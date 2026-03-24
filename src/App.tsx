import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { Spinner } from './components/ui/Spinner';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Sandbox from './pages/Sandbox';
import SandboxSuccess from './pages/SandboxSuccess';
import Hosting from './pages/Hosting';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import TemplatePage from './pages/TemplatePage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/template/:slug" element={<TemplatePage />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/sandbox/success" element={<SandboxSuccess />} />
          <Route path="/sandbox/cancel" element={<Navigate to="/sandbox" replace />} />
          <Route path="/hosting" element={<Hosting />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
