interface StakbrokerUser {
  email: string;
  balance: number;
  accountId: string;
  isActive: boolean;
}

class StakbrokerService {
  private baseUrl = 'https://stakbroker.com/api'; // URL exemplo, ajuste para a URL correta

  // Verificar se o email tem conta na Stakbroker
  async verifyAccount(email: string): Promise<StakbrokerUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Usuário não encontrado na Stakbroker');
      }

      const data = await response.json();
      return data as StakbrokerUser;
    } catch (error) {
      console.error('Erro ao verificar conta:', error);
      return null;
    }
  }

  // Obter saldo e informações da conta
  async getAccountInfo(email: string, accountId: string): Promise<StakbrokerUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/account-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accountId}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter informações da conta');
      }

      const data = await response.json();
      return data as StakbrokerUser;
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error);
      return null;
    }
  }
}

export const stakbrokerService = new StakbrokerService();
