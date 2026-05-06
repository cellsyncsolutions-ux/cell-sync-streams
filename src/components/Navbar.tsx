import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import logo from "@/assets/logo-mark.png";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartSheet from "./CartSheet";

const Navbar = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { count } = useCart();
  return (
  <header className="sticky top-0 inset-x-0 z-50">
    <div className="bg-navy text-navy-foreground">
      <nav className="container flex h-24 items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Cell Sync Solutions" width={64} height={64} className="h-14 w-14 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.45)]" />
          <span className="font-extrabold text-xl tracking-tight text-primary leading-none">
            CELL SYNC SOLUTIONS<br/>
            <span className="text-[10px] font-semibold tracking-[0.25em] text-navy-foreground/70">{t("nav_tagline")}</span>
          </span>
        </a>
        <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
          <a href="#about" className="hidden md:block hover:text-primary transition-smooth">{t("nav_about")}</a>
          <a href="#shop" className="hidden md:block hover:text-primary transition-smooth">{t("nav_shop")}</a>
          <a href="#contact" className="hidden md:block hover:text-primary transition-smooth">{t("nav_contact")}</a>
          {user ? (
            <Link to="/account" className="hidden md:flex items-center gap-1.5 hover:text-primary transition-smooth">
              <User className="h-4 w-4" /> Account
            </Link>
          ) : (
            <Link to="/auth" className="hidden md:block hover:text-primary transition-smooth">{t("nav_login")}</Link>
          )}
          <LanguageSwitcher />
          <CartSheet>
            <Button variant="hero" size="sm" className="gap-2 relative">
              <ShoppingCart className="h-4 w-4" /> {t("nav_cart")}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-navy text-navy-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">{count}</span>
              )}
            </Button>
          </CartSheet>
        </div>
      </nav>
    </div>
    <div className="bg-primary text-primary-foreground">
      <div className="container py-3 text-center font-bold uppercase tracking-[0.2em] text-sm md:text-base">
        {t("nav_banner")}
      </div>
    </div>
  </header>
  );
};

export default Navbar;