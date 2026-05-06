import { FlaskConical, Twitter, Facebook, Instagram, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
  <footer className="bg-navy text-navy-foreground mt-0">
    <div className="container py-14 grid md:grid-cols-4 gap-10 text-sm">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="grid place-items-center h-10 w-10 rounded-md bg-primary">
            <FlaskConical className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-extrabold text-lg leading-tight text-primary">CELL SYNC<br/><span className="text-xs font-medium tracking-[0.2em] opacity-70 text-navy-foreground">SOLUTIONS</span></span>
        </div>
        <p className="opacity-85 max-w-md">{t("footer_tagline")}</p>
        <div className="flex gap-3 mt-5">
          {[Twitter, Facebook, Instagram, Send].map((Ic, i) => (
            <a key={i} href="#" className="grid place-items-center h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth">
              <Ic className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold uppercase tracking-wider mb-4 text-xs">{t("footer_shop")}</h4>
        <ul className="space-y-2 opacity-85">
          <li><a href="#shop">{t("footer_all")}</a></li>
          <li><a href="#shop">{t("cat_peptides")}</a></li>
          <li><a href="#shop">{t("cat_blends")}</a></li>
          <li><a href="#shop">{t("cat_capsules")}</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold uppercase tracking-wider mb-4 text-xs">{t("footer_support")}</h4>
        <ul className="space-y-2 opacity-85">
          <li><a href="#coa">{t("footer_coa")}</a></li>
          <li><a href="#faq">{t("footer_faq")}</a></li>
          <li><a href="#track">{t("footer_track")}</a></li>
          <li><a href="#contact">{t("footer_contact")}</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-navy-foreground/15">
      <div className="container py-8 text-xs opacity-80 space-y-3">
        <p>{t("footer_fda")}</p>
        <p>{t("footer_supplier")}</p>
        <p className="pt-3 border-t border-navy-foreground/15">© {new Date().getFullYear()} Cell Sync Solutions. {t("footer_rights")}</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;