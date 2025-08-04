'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { stakbrokerService } from '@/lib/stakbroker-service';

interface StakbrokerContextType {
  balance: number;
  accountId: string | null;
  isActive: boolean;
  refreshBalance: () => Promise<void>;
}

const StakbrokerContext = createContext<StakbrokerContextType>({
  balance: 0,
  accountId: null,
  isActive: false,
  refreshBalance: async () => {},
});

export function StakbrokerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const refreshBalance = async () => {
    if (user?.email && accountId) {
      const accountInfo = await stakbrokerService.getAccountInfo(user.email, accountId);
      if (accountInfo) {
        setBalance(accountInfo.balance);
        setIsActive(accountInfo.isActive);
      }
    }
  };

  useEffect(() => {
    if (user?.email) {
      stakbrokerService.verifyAccount(user.email).then((stakbrokerUser) => {
        if (stakbrokerUser) {
          setAccountId(stakbrokerUser.accountId);
          setBalance(stakbrokerUser.balance);
          setIsActive(stakbrokerUser.isActive);
        }
      });
    }
  }, [user]);

  return (
    <StakbrokerContext.Provider value={{ balance, accountId, isActive, refreshBalance }}>
      {children}
    </StakbrokerContext.Provider>
  );
}

export const useStakbroker = () => useContext(StakbrokerContext);
