import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // Ha nincs bejelentkezve a felhasználó, azonnal átdobjuk a főoldalra ('/')
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Ha be van jelentkezve, megmutatjuk neki a kért oldalt (children)
  return children;
};