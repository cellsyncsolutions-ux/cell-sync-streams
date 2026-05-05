import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import logo from "@/assets/logo-mark.png";

const Navbar = () => (
  <header className="sticky top-0 inset-x-0 z-50">
    <div className="bg-navy text-navy-foreground">
      <nav className="container flex h-24 items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Cell Sync Solutions" width={48} height={48} className="h-12 w-12" />
          <span className="font-extrabold text-xl tracking-tight text-primary leading-none">
            CELL SYNC SOLUTIONS<br/>
            <span className="text-[10px] font-semibold tracking-[0.25em] text-navy-foreground/70">"PEPTIDES TO SOLVE YOUR EVERY NEED"</span>
          </span>
        </a>
        <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
          <a href="#about" className="hidden md:block hover:text-primary transition-smooth">About</a>
          <a href="#shop" className="hidden md:block hover:text-primary transition-smooth">Shop</a>
          <a href="#contact" className="hidden md:block hover:text-primary transition-smooth">Contact</a>
          <a href="#login" className="hidden md:block hover:text-primary transition-smooth">Login</a>
          <Button variant="hero" size="sm" className="gap-2"><ShoppingCart className="h-4 w-4" /> Cart</Button>
        </div>
      </nav>
    </div>
    <div className="bg-primary text-primary-foreground">
      <div className="container py-3 text-center font-bold uppercase tracking-[0.2em] text-sm md:text-base">
        US Manufactured Research Use Only Peptides
      </div>
    </div>
  </header>
);

export default Navbar;