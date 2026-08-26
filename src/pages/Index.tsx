import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Shop from "@/components/Shop";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import About from "@/components/About";

const Index = () => (
  <main className="min-h-screen bg-background">
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
