import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SmartMealPlanner
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Tarifs
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            À propos
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="hero" size="sm">
              Commencer
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};