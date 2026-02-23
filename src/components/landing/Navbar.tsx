import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">PayRail</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#developer" className="text-muted-foreground hover:text-foreground transition-colors">
              Developer
            </a>
            <a href="#ledger" className="text-muted-foreground hover:text-foreground transition-colors">
              Ledger
            </a>
            <a href="#cta" className="text-muted-foreground hover:text-foreground transition-colors">
              Get Access
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/login">Log In</a>
            </Button>
            <Button variant="hero" size="sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                How It Works
              </a>
              <a href="#developer" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Developer
              </a>
              <a href="#ledger" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Ledger
              </a>
              <a href="#cta" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Get Access
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-center" asChild>
                  <a href="/login">Log In</a>
                </Button>
                <Button variant="hero" className="w-full justify-center">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
