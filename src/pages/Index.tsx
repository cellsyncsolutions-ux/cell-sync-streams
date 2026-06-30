import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Shop from "@/components/Shop";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import About from "@/components/About";

const Index = () => (
  <main className="min-h-screen bg-background">
    <AgeGate />
    <Navbar />
    <Hero />
    <About />
    <Stats />
    <Shop />
    <Features />
    <CTA />
    <Footer />
  </main>
);

export default Index;
