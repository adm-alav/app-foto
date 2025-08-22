'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { stakbrokerService } from '@/lib/stakbroker-service';

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

interface StakbrokerContextType {
  wallets: Wallet[];
  trades: Trade[];
  isActive: boolean;
  refreshData: () => Promise<void>;
  openTrade: (symbol: string, quantity: number, type: 'BUY' | 'SELL', price: number) => Promise<Trade | null>;
  getCurrentPrice: (symbol: string) => Promise<number | null>;
}

const StakbrokerContext = createContext<StakbrokerContextType>({
  wallets: [],
  trades: [],
  isActive: false,
  refreshData: async () => {},
  openTrade: async () => null,
  getCurrentPrice: async () => null,
});

export function StakbrokerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Configurar o token da API
  useEffect(() => {
    stakbrokerService.setApiKey('qd1gzjfrns');
  }, []);

  const refreshData = async () => {
    try {
      const userInfo = await stakbrokerService.getUserInfo();
      if (userInfo) {
        setIsActive(userInfo.isActive);
      }

      const walletsData = await stakbrokerService.getWallets();
      setWallets(walletsData);

      const tradesData = await stakbrokerService.getTrades(1);
      setTrades(tradesData);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  const openTrade = async (
    symbol: string,
    quantity: number,
    type: 'BUY' | 'SELL',
    price: number
  ): Promise<Trade | null> => {
    const trade = await stakbrokerService.openTrade(symbol, quantity, type, price);
    if (trade) {
      setTrades(prevTrades => [trade, ...prevTrades]);
    }
    return trade;
  };

  const getCurrentPrice = async (symbol: string): Promise<number | null> => {
    return stakbrokerService.getCurrentPrice(symbol);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <StakbrokerContext.Provider 
      value={{ 
        wallets, 
        trades, 
        isActive, 
        refreshData, 
        openTrade,
        getCurrentPrice 
      }}
    >
      {children}
    </StakbrokerContext.Provider>
  );
}

export const useStakbroker = () => useContext(StakbrokerContext);
