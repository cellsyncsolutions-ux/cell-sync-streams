import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-md border border-navy-foreground/20 bg-navy-foreground/5 px-2 py-1 text-xs font-bold uppercase tracking-wider ${className}`}>
      <Globe className="h-3.5 w-3.5 opacity-70" />
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-1.5 py-0.5 rounded transition-smooth ${lang === "en" ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="opacity-30">/</span>
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-1.5 py-0.5 rounded transition-smooth ${lang === "es" ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}
        aria-pressed={lang === "es"}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;