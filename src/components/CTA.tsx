import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CTA = () => {
  const { t } = useLanguage();
  return (
  <section id="contact" className="py-24">
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-12 md:p-20 text-center shadow-card">
        <div className="absolute inset-0 glow-ring opacity-60" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t("cta_title_1")}<span className="text-gradient-primary">{t("cta_title_2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">{t("cta_subtitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg">
              <a href="#shop">{t("cta_view")} <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href="mailto:support@cellsyncsolutions.com">{t("cta_contact")}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default CTA;