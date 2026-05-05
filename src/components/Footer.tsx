import { FlaskConical } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container flex flex-col gap-6 text-sm text-muted-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-7 w-7 rounded-lg bg-gradient-primary">
            <FlaskConical className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span className="font-semibold text-foreground">Cell Sync Solutions</span>
        </div>
        <p>© {new Date().getFullYear()} Cell Sync Solutions. All rights reserved.</p>
      </div>
      <p className="text-xs text-center md:text-left max-w-3xl border-t border-border pt-6">
        <strong className="text-foreground">For Research Use Only.</strong> Products sold by Cell Sync Solutions are intended
        solely for in-vitro laboratory research. Not for human consumption, therapeutic use, diagnostic procedures,
        veterinary use, or food/cosmetic applications.
      </p>
    </div>
  </footer>
);

export default Footer;