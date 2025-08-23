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
  private baseUrl = 'https://app.stakbroker.com/api';
  private apiKey = 'qd1gzjfrns';

  // Configurar o token da API
  setApiKey(token: string) {
    this.apiKey = token;
  }

  // Obter informações do usuário
  async getUserInfo(): Promise<StakbrokerUser | null> {
    try {
      // Simulação de dados do usuário
      return {
        id: '01K306AVZMKRFWDR7XK2B9E2W1',
        email: 'user@stakbroker.com',
        isActive: true,
        wallets: [
          {
            id: '1',
            balance: 1000.00,
            currency: 'BRL'
          }
        ],
        trades: []
      };
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }

  // Obter carteiras do usuário
  async getWallets(): Promise<Wallet[]> {
    try {
      // Simulação de carteiras
      return [
        {
          id: '1',
          balance: 1000.00,
          currency: 'BRL'
        }
      ];
    } catch (error) {
      console.error('Erro ao obter carteiras:', error);
      return [];
    }
  }

  // Obter trades do usuário
  async getTrades(page: number = 1): Promise<Trade[]> {
    try {
      // Simulação de trades
      return [];
    } catch (error) {
      console.error('Erro ao obter trades:', error);
      return [];
    }
  }

  // Abrir uma nova ordem de trade
  async openTrade(symbol: string, quantity: number, type: 'BUY' | 'SELL', price: number): Promise<Trade | null> {
    try {
      // Simulação de nova ordem
      return {
        id: Math.random().toString(36).substring(7),
        symbol,
        quantity,
        price,
        type,
        status: 'EXECUTED',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao abrir trade:', error);
      return null;
    }
  }

  // Obter preço atual de um símbolo
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      // Simulação de preços por ativo
      const prices: { [key: string]: number } = {
        'BTC/USD': 45000,
        'ETH/USD': 3000,
        'XRP/USD': 0.5,
        'BCH/USD': 250
      };

      const price = prices[symbol];
      if (!price) {
        throw new Error(`Preço não disponível para ${symbol}`);
      }

      // Adiciona uma pequena variação aleatória
      const variation = price * (Math.random() * 0.02 - 0.01); // ±1%
      return +(price + variation).toFixed(2);
    } catch (error) {
      console.error('Erro ao obter preço:', error);
      throw new Error('Não foi possível obter o preço atual. Tente novamente em alguns instantes.');
    }
  }
}

export const stakbrokerService = new StakbrokerService();