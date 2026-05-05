import { Button } from "@/components/ui/button";
import { FlaskConical, ShoppingCart, Search, User } from "lucide-react";

const Navbar = () => (
  <header className="sticky top-0 inset-x-0 z-50 bg-background border-b border-border">
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="container flex h-9 items-center justify-between">
        <span className="font-medium tracking-wide">Research-Grade Peptides — For Laboratory Use Only</span>
        <div className="hidden sm:flex items-center gap-5">
          <a href="#track" className="hover:underline">Track Your Order</a>
          <a href="#terms" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>
    </div>
    <nav className="container flex h-20 items-center justify-between">
      <a href="#" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
        <span className="grid place-items-center h-10 w-10 rounded-md bg-primary shadow-glow">
          <FlaskConical className="h-5 w-5 text-primary-foreground" />
        </span>
        <span className="leading-tight">CELL SYNC<br/><span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">SOLUTIONS</span></span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
        <a href="#" className="hover:text-primary transition-smooth">Home</a>
        <a href="#about" className="hover:text-primary transition-smooth">About</a>
        <a href="#shop" className="text-primary">Shop</a>
        <a href="#coa" className="hover:text-primary transition-smooth">COAs & Test Results</a>
        <a href="#faq" className="hover:text-primary transition-smooth">FAQ</a>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><User className="h-4 w-4" /></Button>
        <Button variant="hero" size="sm" className="gap-2"><ShoppingCart className="h-4 w-4" /> Cart (0)</Button>
      </div>
    </nav>
  </header>
);

export default Navbar;