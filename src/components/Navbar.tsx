import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const Navbar = () => (
  <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
    <nav className="container flex h-16 items-center justify-between">
      <a href="#" className="flex items-center gap-2 font-bold text-lg">
        <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
          <Smartphone className="h-4 w-4 text-primary-foreground" />
        </span>
        <span>Cell Sync <span className="text-gradient-primary">Solutions</span></span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-smooth">Features</a>
        <a href="#how" className="hover:text-foreground transition-smooth">How it works</a>
        <a href="#pricing" className="hover:text-foreground transition-smooth">Pricing</a>
        <a href="#contact" className="hover:text-foreground transition-smooth">Contact</a>
      </div>
      <Button variant="hero" size="sm">Get Started</Button>
    </nav>
  </header>
);

export default Navbar;