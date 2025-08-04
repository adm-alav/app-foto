import './globals.css'
import { Inter } from 'next/font/google'
import { FirebaseProvider } from '@/components/providers/firebase-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IA CAM 2.0 - Análise Automática de Sinais',
  description: 'Sistema de análise automática de sinais para a STAK BROKER',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
