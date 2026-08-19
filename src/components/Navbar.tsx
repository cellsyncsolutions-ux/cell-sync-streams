import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import logo from "@/assets/logo-mark.png";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartSheet from "./CartSheet";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
  <header className="sticky top-0 inset-x-0 z-50">
    <div className="bg-navy text-navy-foreground">
      <nav className="container flex h-20 md:h-24 items-center justify-between gap-2">
        <a href="#" className="flex items-center gap-2 md:gap-3 min-w-0">
          <img src={logo} alt="Cell Sync Solutions" width={64} height={64} className="h-10 w-10 md:h-14 md:w-14 shrink-0 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.45)]" />
          <span className="font-extrabold text-sm md:text-xl tracking-tight text-primary leading-none min-w-0">
            CELL SYNC SOLUTIONS<br/>
            <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.18em] md:tracking-[0.25em] text-navy-foreground/70">{t("nav_tagline")}</span>
          </span>
        </a>
        <div className="flex items-center gap-4 lg:gap-8 text-sm font-bold uppercase tracking-wider shrink-0">
          <a href="#about" className="hidden md:block hover:text-primary transition-smooth">{t("nav_about")}</a>
          <a href="#shop" className="hidden md:block hover:text-primary transition-smooth">{t("nav_shop")}</a>
          <Link to="/research-library" className="hidden lg:block hover:text-primary transition-smooth">Research Library</Link>
          <a href="#contact" className="hidden md:block hover:text-primary transition-smooth">{t("nav_contact")}</a>
          {user ? (
            <Link to="/account" className="hidden md:flex items-center gap-1.5 hover:text-primary transition-smooth">
              <User className="h-4 w-4" /> Account
            </Link>
          ) : (
            <Link to="/auth" className="hidden md:block hover:text-primary transition-smooth">{t("nav_login")}</Link>
          )}
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <CartSheet>
            <Button variant="hero" size="sm" className="gap-2 relative px-3">
              <ShoppingCart className="h-4 w-4" /> <span className="hidden sm:inline">{t("nav_cart")}</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-navy text-navy-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">{count}</span>
              )}
            </Button>
          </CartSheet>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="md:hidden p-2 -mr-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-xs bg-navy text-navy-foreground border-navy-foreground/20">
              <div className="mt-10 flex flex-col gap-5 text-base font-bold uppercase tracking-wider">
                <a href="#about" onClick={() => setOpen(false)}>{t("nav_about")}</a>
                <a href="#shop" onClick={() => setOpen(false)}>{t("nav_shop")}</a>
                <Link to="/research-library" onClick={() => setOpen(false)}>Research Library</Link>
                <a href="#contact" onClick={() => setOpen(false)}>{t("nav_contact")}</a>
                {user ? (
                  <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>{t("nav_login")}</Link>
                )}
                <div className="pt-2 sm:hidden"><LanguageSwitcher /></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
    <div className="bg-primary text-primary-foreground">
      <div className="container py-2.5 md:py-3 text-center font-bold uppercase tracking-[0.12em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs">
        {t("nav_banner")}
      </div>
    </div>
  </header>
  );
};

export default Navbar;