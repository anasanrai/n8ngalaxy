import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
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
import CashPilot from './pages/CashPilot';
import AdminRoute from './components/admin/AdminRoute';

// Lazy-load admin pages (admin bundle stays separate)
const AdminOverview  = lazy(() => import('./pages/admin/AdminOverview'));
const AdminSandboxes = lazy(() => import('./pages/admin/AdminSandboxes'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));
const AdminRevenue   = lazy(() => import('./pages/admin/AdminRevenue'));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

const AdminSpinner = () => (
  <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          useAuthStore.getState().initialize();
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }
  }, []);

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
          <Route path="/cashpilot" element={<CashPilot />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Admin routes ────────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Suspense fallback={<AdminSpinner />}>
                    <AdminOverview />
                  </Suspense>
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sandboxes"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Suspense fallback={<AdminSpinner />}>
                    <AdminSandboxes />
                  </Suspense>
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Suspense fallback={<AdminSpinner />}>
                    <AdminUsers />
                  </Suspense>
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/revenue"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Suspense fallback={<AdminSpinner />}>
                    <AdminRevenue />
                  </Suspense>
                </AdminRoute>
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
