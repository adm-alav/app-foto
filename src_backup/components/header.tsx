'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">IACAM</span>
          <span className="text-sm font-medium text-accent px-2 py-1 rounded-full border border-primary/20 bg-primary/5">
            2.0
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
}
