const steps = [
  { n: "01", t: "Connect", d: "Enroll devices in seconds via QR code, MDM, or zero-touch deployment." },
  { n: "02", t: "Configure", d: "Apply policies, push apps, and customize experiences from one dashboard." },
  { n: "03", t: "Sync & Scale", d: "Watch your fleet stay synchronized, secure, and always up to date." },
];

const HowItWorks = () => (
  <section id="how" className="py-24 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] glow-ring opacity-50" />
    <div className="container relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">How it works</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Live in three simple steps</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-border bg-card/60 backdrop-blur p-8 shadow-card">
            <div className="text-5xl font-bold text-gradient-primary mb-4">{s.n}</div>
            <h3 className="text-xl font-semibold mb-2">{s.t}</h3>
            <p className="text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;