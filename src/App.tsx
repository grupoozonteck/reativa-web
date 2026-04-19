import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { canAccessRoute } from '@/config/permissions';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import AppLayout from '@/layouts/AppLayout';
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Ranking from '@/pages/Ranking/Ranking';
import Customers from '@/pages/Customers/Customers';
import CustomerDetails from '@/pages/Customers/CustomerDetails';
import MyAttendances from '@/pages/Customers/MyAttendances';
import { Loader2 } from 'lucide-react';
import Commissions from './pages/Commissions/Commissions';
import SupervisorPerformance from './pages/Supervisor/SupervisorPerformance';
import ManagerPerformance from './pages/Manager/ManagerPerformance';
import Attendants from './pages/Attendants/Attendants';
import AttendantDetails from './pages/Attendants/AttendantDetails';
import EditAttendant from './pages/Attendants/EditAttendant';
import * as React from "react";
import { ToastContainer } from 'react-toastify';


function ProtectedApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <ToastContainer position="top-right" autoClose={3000} />
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
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/my-attendances" element={<MyAttendances />} />
            <Route path="/commissions" element={<Commissions />} />
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
            <Route
              path="/attendants"
              element={
                <RoleGuard route="/attendants">
                  <Attendants />
                </RoleGuard>
              }
            />
            <Route
              path="/attendants/:id"
              element={
                <RoleGuard route="/attendants">
                  <AttendantDetails />
                </RoleGuard>
              }
            />
            <Route
              path="/attendants/:id/edit"
              element={
                <RoleGuard route="/attendants">
                  <EditAttendant />
                </RoleGuard>
              }
            />
          </Route>
          <Route path="/clientes" element={<Navigate to="/customers" replace />} />
          <Route path="/clientes/:id" element={<Navigate to="/customers" replace />} />
          <Route path="/meus-atendimentos" element={<Navigate to="/my-attendances" replace />} />
          <Route path="/comissoes" element={<Navigate to="/commissions" replace />} />
          <Route path="/atendentes" element={<Navigate to="/attendants" replace />} />
          <Route path="/atendentes/:id" element={<Navigate to="/attendants" replace />} />
          <Route path="/atendentes/:id/editar" element={<Navigate to="/attendants" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
