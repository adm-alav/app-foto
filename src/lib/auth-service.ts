interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: UserInfo;
}

interface UserInfo {
  id: string;
  email: string;
  isActive: boolean;
}

class AuthService {
  // Autenticar usuário com a Stakbroker via proxy local
  async login(userId: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao autenticar'
      };
    }
  }

  // Verificar token atual
  async validateToken(token: string): Promise<UserInfo | null> {
    try {
      const response = await fetch('/api/auth', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        isActive: data.isActive
      };
    } catch (error) {
      return null;
    }
  }

  // Fazer logout
  async logout(): Promise<void> {
    // Limpar dados locais se necessário
  }
}

export const authService = new AuthService();