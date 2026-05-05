import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, FileCheck2 } from "lucide-react";
import hero from "@/assets/hero.jpg";

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
    <div className="absolute inset-0 opacity-25">
      <img src={hero} alt="" width={1600} height={1024} className="h-full w-full object-cover" />
    </div>
    <div className="container relative z-10 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] mb-4 opacity-80">SHOP / RESEARCH PEPTIDES</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
          Research-Grade Peptides
          <span className="block opacity-90 text-2xl md:text-3xl font-medium mt-3">Trusted by Scientists Worldwide</span>
        </h1>
        <p className="text-base md:text-lg opacity-85 max-w-xl mb-8">
          Browse our catalog of high-purity peptides and research compounds. Every batch
          is independently tested and shipped with a full Certificate of Analysis.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" size="lg" className="gap-2 font-semibold">
            Shop Catalog <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="glass" size="lg">View Test Results</Button>
        </div>
        <div className="flex flex-wrap gap-6 mt-10 text-sm opacity-90">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> ≥99% Purity Verified</span>
          <span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Third-Party COAs</span>
        </div>
      </div>
      <div className="hidden md:block" />
    </div>
  </section>
);

export default Hero;