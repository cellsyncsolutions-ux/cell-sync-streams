import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => (
  <section id="contact" className="py-24">
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-hero p-12 md:p-20 text-center shadow-card">
        <div className="absolute inset-0 glow-ring opacity-60" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Equip your <span className="text-gradient-primary">next experiment</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Browse 200+ research-grade peptides with verified purity. Bulk pricing available for institutions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="hero" size="lg">View catalog <ArrowRight className="h-4 w-4" /></Button>
            <Button variant="glass" size="lg">Contact a specialist</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;