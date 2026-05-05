import { FlaskConical, Twitter, Facebook, Instagram, Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-0">
    <div className="container py-14 grid md:grid-cols-4 gap-10 text-sm">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="grid place-items-center h-10 w-10 rounded-md bg-primary-foreground/10">
            <FlaskConical className="h-5 w-5" />
          </span>
          <span className="font-bold text-lg leading-tight">CELL SYNC<br/><span className="text-xs font-medium tracking-[0.2em] opacity-70">SOLUTIONS</span></span>
        </div>
        <p className="opacity-85 max-w-md">Research-Grade Peptides — Trusted by Scientists. Independently tested for purity, identity, and stability.</p>
        <div className="flex gap-3 mt-5">
          {[Twitter, Facebook, Instagram, Send].map((Ic, i) => (
            <a key={i} href="#" className="grid place-items-center h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-smooth">
              <Ic className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold uppercase tracking-wider mb-4 text-xs">Shop</h4>
        <ul className="space-y-2 opacity-85">
          <li><a href="#shop">All Products</a></li>
          <li><a href="#shop">Peptides</a></li>
          <li><a href="#shop">Blends</a></li>
          <li><a href="#shop">Capsules</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold uppercase tracking-wider mb-4 text-xs">Support</h4>
        <ul className="space-y-2 opacity-85">
          <li><a href="#coa">COAs & Test Results</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#track">Track Order</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/15">
      <div className="container py-8 text-xs opacity-80 space-y-3">
        <p><strong>FDA Disclaimer:</strong> The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease. All products are for laboratory developmental research USE ONLY. Products are not for human consumption.</p>
        <p>Cell Sync Solutions is a chemical supplier. Cell Sync Solutions is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act.</p>
        <p className="pt-3 border-t border-primary-foreground/15">© {new Date().getFullYear()} Cell Sync Solutions. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;