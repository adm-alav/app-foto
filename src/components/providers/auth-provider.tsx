'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';

interface User {
  id: string;
  email: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token existente ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await authService.validateToken(token);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('auth_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const signIn = async (userId: string) => {
    try {
      const result = await authService.login(userId);
      
      if (!result.success || !result.token || !result.user) {
        throw new Error(result.error || 'Falha na autenticação');
      }

      // Salvar token
      localStorage.setItem('auth_token', result.token);

      // Usar os dados do usuário retornados no login
      setUser(result.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};