import { Smartphone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="grid place-items-center h-7 w-7 rounded-lg bg-gradient-primary">
          <Smartphone className="h-3.5 w-3.5 text-primary-foreground" />
        </span>
        <span className="font-semibold text-foreground">Cell Sync Solutions</span>
      </div>
      <p>© {new Date().getFullYear()} Cell Sync Solutions. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;