import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="relative bg-navy text-navy-foreground overflow-hidden">
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.4),transparent_50%),radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.25),transparent_50%)]" />
    <div className="container relative z-10 py-24 md:py-32 text-center max-w-4xl">
      <p className="text-primary font-bold uppercase tracking-[0.3em] text-sm mb-5">Peptides Made Simple</p>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
        Research-Grade Peptides,<br/>
        <span className="text-primary">Made in the USA</span>
      </h1>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="hero" size="lg" className="gap-2 font-bold">
          Shop Catalog <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="glass" size="lg" className="border-navy-foreground/30 text-navy-foreground">Learn More</Button>
      </div>
    </div>
  </section>
);

export default Hero;