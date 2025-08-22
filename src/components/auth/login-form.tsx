"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-2 sm:px-0"
      style={{ minHeight: '100vh', background: 'none' }}
    >
      <Card
        className="w-full max-w-md p-2 sm:p-8 rounded-xl sm:rounded-3xl shadow-2xl border border-gold/30 relative overflow-hidden max-w-xs sm:max-w-md"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)) 90%)',
          borderColor: 'hsl(45, 100%, 70%)',
          boxShadow: '0 0 32px 0 hsla(45, 100%, 70%, 0.18), 0 0 0 2px hsl(45, 100%, 70%, 0.08)',
        }}
      >
        {/* Glow/shine effect */}
        <div className="pointer-events-none absolute -inset-1 z-0 rounded-3xl" style={{
          background: 'radial-gradient(ellipse at 60% 0%, hsla(45,100%,70%,0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }} />
        <div className="space-y-4 sm:space-y-6 text-center relative z-10">
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-40 blur-2xl pointer-events-none">
              <div style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--gold-glow, hsla(45, 100%, 70%, 0.25)) 0%, transparent 80%)',
                filter: 'blur(12px)'
              }} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent animate-gold-shine"
              style={{
                backgroundImage: 'linear-gradient(90deg, hsl(45, 100%, 70%) 30%, hsl(35, 90%, 60%) 70%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IACAM
            </h1>
            <span className="mt-2 inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-gold"
              style={{
                background: 'linear-gradient(90deg, hsl(45, 100%, 70%), hsl(35, 90%, 60%))',
                color: 'hsl(45, 15%, 8%)',
                boxShadow: '0 0 12px 0 hsla(45, 100%, 70%, 0.25)'
              }}
            >2.0</span>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg font-medium" style={{ color: 'hsl(45, 84%, 90%)' }}>Acesso Exclusivo</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gold font-semibold tracking-wide">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border text-lg bg-[hsl(45,30%,15%)] border-gold/40 text-gold-foreground focus-visible:ring-gold focus-visible:border-gold transition-all duration-200 shadow-gold-sm"
              style={{
                color: 'hsl(45, 84%, 90%)',
                background: 'hsl(45, 30%, 15%)',
                borderColor: 'hsl(45, 100%, 70%, 0.4)',
                boxShadow: '0 0 0 2px transparent',
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gold font-semibold tracking-wide">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border text-lg bg-[hsl(45,30%,15%)] border-gold/40 text-gold-foreground focus-visible:ring-gold focus-visible:border-gold transition-all duration-200 shadow-gold-sm"
              style={{
                color: 'hsl(45, 84%, 90%)',
                background: 'hsl(45, 30%, 15%)',
                borderColor: 'hsl(45, 100%, 70%, 0.4)',
                boxShadow: '0 0 0 2px transparent',
              }}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full h-11 sm:h-12 text-base sm:text-lg font-bold rounded-lg shadow-gold transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, hsl(45, 100%, 70%), hsl(35, 90%, 60%))',
              color: 'hsl(45, 15%, 8%)',
              boxShadow: '0 4px 32px 0 hsla(45, 100%, 70%, 0.18)',
              border: 'none',
              letterSpacing: 1,
              opacity: loading ? 0.7 : 1,
              textShadow: '0 1px 8px hsla(45,100%,70%,0.12)',
            }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Acessar Plataforma'}
          </Button>
        </form>
        <div className="mt-6 sm:mt-8 text-center">
          <a
            href="https://app.stakbroker.com/auth/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4 text-gold hover:text-gold/80 transition-colors"
          >
            Não tem uma conta? Registre-se
          </a>
        </div>
        <div className="mt-4 sm:mt-6 text-xs text-center text-gold-foreground/80">
          © 2024 IACAM I.A. - Tecnologia Avançada
        </div>
      </Card>
    </div>
  );
}
