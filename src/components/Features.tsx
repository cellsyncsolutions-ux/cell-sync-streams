import { Microscope, ShieldCheck, FileCheck2, Thermometer, Atom, Truck } from "lucide-react";

const features = [
  { icon: Microscope, title: "≥99% Purity", desc: "Every batch verified by reverse-phase HPLC and mass spectrometry analysis." },
  { icon: FileCheck2, title: "Third-party COA", desc: "Independent certificates of analysis available for every lot we ship." },
  { icon: Atom, title: "Research Grade", desc: "Synthesized to strict laboratory standards in ISO-certified facilities." },
  { icon: Thermometer, title: "Cold-chain Shipping", desc: "Temperature-controlled packaging preserves peptide stability in transit." },
  { icon: ShieldCheck, title: "Lot Traceability", desc: "Full chain-of-custody documentation from synthesis to delivery." },
  { icon: Truck, title: "Fast Dispatch", desc: "In-stock peptides ship within 24 hours from our temperature-controlled vault." },
];

const Features = () => (
  <section id="features" className="py-24 relative">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Why researchers choose us</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Built for <span className="text-gradient-primary">reproducible science</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Quality you can verify. Documentation you can trust. Peptides that perform.
        </p>
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

export default Features;