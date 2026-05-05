import { Cloud, Lock, Zap, RefreshCw, Smartphone, BarChart3 } from "lucide-react";

const features = [
  { icon: RefreshCw, title: "Real-time Sync", desc: "Bi-directional synchronization across iOS, Android, and wearables in milliseconds." },
  { icon: Lock, title: "Zero-trust Security", desc: "End-to-end encryption with biometric verification and policy enforcement." },
  { icon: Cloud, title: "Cloud-native", desc: "Globally distributed infrastructure that scales effortlessly with your team." },
  { icon: Zap, title: "Instant Provisioning", desc: "Roll out new devices in seconds with templated configurations and apps." },
  { icon: Smartphone, title: "Cross-platform", desc: "One control plane for every operating system, manufacturer, and form factor." },
  { icon: BarChart3, title: "Live Analytics", desc: "Granular insights into device health, usage, and compliance — all in real time." },
];

const Features = () => (
  <section id="features" className="py-24 relative">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Platform</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Everything you need to <span className="text-gradient-primary">stay in sync</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          A complete toolkit for managing mobile devices at any scale — built for modern teams.
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