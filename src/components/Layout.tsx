
import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="px-6 py-4 border-b border-border bg-background/95 sticky top-0 z-10 backdrop-blur">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <KeyRound className="w-8 h-8 text-keeper-purple" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-keeper-purple to-keeper-light">
                Keeper
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">My Account</span>
                </Link>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="bg-keeper-purple hover:bg-keeper-dark" size="sm">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
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
