'use client';

import IACamUpload from '@/components/IACamUpload';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push('/login');
    }
  }, [user, loading, router, isClient]);

  // Mostra loading enquanto verifica autenticação
  if (loading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1505]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin mx-auto" />
          <div className="text-[#FFB800] text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não mostra nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Renderiza o dashboard apenas se estiver autenticado
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-6 md:p-12 bg-[#1a1505]">
      <div className="z-10 w-full max-w-2xl md:max-w-5xl flex flex-col items-center justify-center text-sm gap-4 sm:gap-8">
        <IACamUpload />
      </div>
    </main>
  );
}