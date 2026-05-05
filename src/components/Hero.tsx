import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical } from "lucide-react";
import hero from "@/assets/hero.jpg";

const Hero = () => (
  <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-hero">
    <div className="absolute inset-0 opacity-40">
      <img src={hero} alt="" width={1600} height={1024} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] glow-ring animate-pulse-glow" />

    <div className="container relative z-10 max-w-5xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground mb-8">
        <FlaskConical className="h-3.5 w-3.5 text-primary" />
        For Research Use Only · Not for Human Consumption
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
        Premium research<br />
        <span className="text-gradient-primary">peptides & reagents.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Cell Sync Solutions supplies laboratories with high-purity peptides backed by
        third-party HPLC and mass-spec analysis. Engineered for reproducible science.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="hero" size="lg">
          Browse catalog <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="glass" size="lg">Request COA</Button>
      </div>
    </div>
  </section>
);

export default Hero;