import { useLanguage } from "@/i18n/LanguageContext";

const Stats = () => {
  const { t } = useLanguage();
  const stats = [
    { v: "≥99%", l: t("stat_purity") },
    { v: "15+", l: t("stat_catalog") },
    { v: "5,000+", l: t("stat_labs") },
    { v: "24H", l: t("stat_ships") },
  ];
  return (
  <section className="py-16 border-y border-border bg-card/30">
    <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((s) => (
        <div key={s.l} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-1">{s.v}</div>
          <div className="text-sm text-muted-foreground">{s.l}</div>
        </div>
      ))}
    </div>
  </section>
  );
};

export default Stats;