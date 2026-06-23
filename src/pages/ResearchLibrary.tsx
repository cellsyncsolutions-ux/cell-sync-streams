import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const LIBRARY_URL = "https://peptide-res-73eea6b2.vibepreview.com";
const DISCLAIMER =
  "Educational content is provided through an independent research resource. Products sold on this website are strictly for Research Use Only.";

const ResearchLibrary = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-20 md:py-28 max-w-3xl">
      <p className="text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> / Research Library
      </p>
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
        <BookOpen className="h-3.5 w-3.5 text-primary" />
        Research Library
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
        Peptide Research Library
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
        Access an independent, continuously updated educational resource covering peptide
        science, research methodologies, and reference literature. The library is hosted
        externally and curated to support qualified researchers exploring the current state
        of peptide investigation.
      </p>
      <p className="text-base text-muted-foreground leading-relaxed mb-8">
        Click below to open the Peptide Research Library in a new tab.
      </p>

      <Button asChild variant="hero" size="lg" className="gap-2 font-bold">
        <a href={LIBRARY_URL} target="_blank" rel="noopener noreferrer">
          View Research Library <ArrowRight className="h-4 w-4" />
        </a>
      </Button>

      <p className="mt-6 text-xs text-muted-foreground italic max-w-2xl">
        {DISCLAIMER}
      </p>
    </section>
    <Footer />
  </main>
);

export default ResearchLibrary;