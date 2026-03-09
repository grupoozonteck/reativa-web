import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { canAccessRoute } from '@/config/permissions';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import AppLayout from '@/layouts/AppLayout';
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Ranking from '@/pages/Ranking/Ranking';
import Clientes from '@/pages/Clientes/Clientes';
import ClienteDetalhes from '@/pages/Clientes/ClienteDetalhes';
import MeusAtendimentos from '@/pages/Clientes/MeusAtendimentos';
import Notificacoes from '@/pages/Notificacoes/Notificacoes';
import { Loader2 } from 'lucide-react';
import Comissoes from './pages/Comisoes/Comissoes';
import SupervisorPerformance from './pages/Supervisor/SupervisorPerformance';
import ManagerPerformance from './pages/Manager/ManagerPerformance';

function ProtectedApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout />
  );
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

/**
 * Guard de permissão: redireciona para o Dashboard se o usuário
 * não tiver acesso à rota.
 */
function RoleGuard({ route, children }: { route: string; children: React.ReactNode }) {
  const { userType } = useAuth();

  if (!canAccessRoute(userType, route)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route element={<ProtectedApp />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClienteDetalhes />} />
            <Route path="/meus-atendimentos" element={<MeusAtendimentos />} />
            <Route path="/comissoes" element={<Comissoes />} />
            <Route
              path="/supervisor/performance"
              element={
                <RoleGuard route="/supervisor/performance">
                  <SupervisorPerformance />
                </RoleGuard>
              }
            />
            <Route
              path="/manager/performance"
              element={
                <RoleGuard route="/manager/performance">
                  <ManagerPerformance />
                </RoleGuard>
              }
            />
            <Route path="/notificacoes" element={<Notificacoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
