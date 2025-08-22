interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
  status: string;
  createdAt: string;
}

interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

interface StakbrokerUser {
  id: string;
  email: string;
  wallets: Wallet[];
  trades: Trade[];
  isActive: boolean;
}

class StakbrokerService {
  private baseUrl = 'https://mybroker-broker-api.readme.io/token'; // Nova URL base da API
  private apiKey: string | null = null;

  // Configurar o token da API
  setApiKey(token: string) {
    this.apiKey = token;
  }

  // Obter informações do usuário
  async getUserInfo(): Promise<StakbrokerUser | null> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter informações do usuário');
      }

      const data = await response.json();
      return data as StakbrokerUser;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }

  // Obter carteiras do usuário
  async getWallets(): Promise<Wallet[]> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/wallets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter carteiras');
      }

      const data = await response.json();
      return data as Wallet[];
    } catch (error) {
      console.error('Erro ao obter carteiras:', error);
      return [];
    }
  }

  // Obter trades do usuário
  async getTrades(page: number = 1): Promise<Trade[]> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/trades?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter trades');
      }

      const data = await response.json();
      return data as Trade[];
    } catch (error) {
      console.error('Erro ao obter trades:', error);
      return [];
    }
  }

  // Abrir uma nova ordem de trade
  async openTrade(symbol: string, quantity: number, type: 'BUY' | 'SELL', price: number): Promise<Trade | null> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/trades/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          symbol,
          quantity,
          type,
          price,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao abrir trade');
      }

      const data = await response.json();
      return data as Trade;
    } catch (error) {
      console.error('Erro ao abrir trade:', error);
      return null;
    }
  }

  // Obter preço atual de um símbolo
  async getCurrentPrice(symbol: string): Promise<number | null> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/symbol-price?symbol=${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter preço');
      }

      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Erro ao obter preço:', error);
      return null;
    }
  }
}

export const stakbrokerService = new StakbrokerService();
