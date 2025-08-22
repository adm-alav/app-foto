'use client';

import IACamUpload from '@/components/IACamUpload';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gold text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-6 md:p-12">
      <div className="z-10 w-full max-w-2xl md:max-w-5xl flex flex-col items-center justify-center text-sm gap-4 sm:gap-8">
        <IACamUpload />
      </div>
    </main>
  );
}