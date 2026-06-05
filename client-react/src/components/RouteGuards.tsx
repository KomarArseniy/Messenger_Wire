import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';

interface RouteGuardProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: RouteGuardProps) {
  const accessToken = useSessionStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicRoute({ children }: RouteGuardProps) {
  const accessToken = useSessionStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
