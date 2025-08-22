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
  // Autenticar usuário
  async login(userId: string): Promise<AuthResponse> {
    try {
      console.log('Iniciando login para usuário:', userId);

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação');
      }

      if (!data.success) {
        throw new Error(data.error || 'Credenciais inválidas');
      }

      // Se autenticado com sucesso, salva o token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error: any) {
      console.error('Erro no processo de login:', error);
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
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Erro na validação do token:', error);
      return null;
    }
  }

  // Fazer logout
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();