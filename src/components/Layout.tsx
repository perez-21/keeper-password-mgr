
import React from 'react';
import { KeyRound } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="px-6 py-4 border-b border-border bg-background/95 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <KeyRound className="w-8 h-8 text-keeper-purple" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-keeper-purple to-keeper-light">
              Keeper
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {children}
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Keeper - Your password vault
      </footer>
    </div>
  );
};

export default Layout;
