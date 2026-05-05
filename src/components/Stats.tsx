const stats = [
  { v: "≥99%", l: "Verified purity" },
  { v: "200+", l: "Peptides in catalog" },
  { v: "5,000+", l: "Labs served" },
  { v: "24h", l: "Average dispatch" },
];

const Stats = () => (
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

export default Stats;