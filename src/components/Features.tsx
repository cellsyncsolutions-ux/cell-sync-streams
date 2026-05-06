import { Microscope, ShieldCheck, FileCheck2, Thermometer, Atom, Truck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Microscope, title: t("feat_purity_t"), desc: t("feat_purity_d") },
    { icon: FileCheck2, title: t("feat_coa_t"), desc: t("feat_coa_d") },
    { icon: Atom, title: t("feat_research_t"), desc: t("feat_research_d") },
    { icon: Thermometer, title: t("feat_cold_t"), desc: t("feat_cold_d") },
    { icon: ShieldCheck, title: t("feat_lot_t"), desc: t("feat_lot_d") },
    { icon: Truck, title: t("feat_fast_t"), desc: t("feat_fast_d") },
  ];
  return (
  <section id="features" className="py-24 relative">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">{t("features_kicker")}</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("features_title_1")}<span className="text-gradient-primary">{t("features_title_2")}</span>
        </h2>
        <p className="text-muted-foreground text-lg">{t("features_subtitle")}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/50 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5 shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Features;