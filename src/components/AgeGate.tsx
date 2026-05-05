import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

const AgeGate = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("css-age-ok")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-foreground/70 backdrop-blur-sm p-4">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-glow max-w-md w-full p-8 text-center">
        <div className="grid place-items-center h-16 w-16 mx-auto mb-5 rounded-full bg-primary-foreground/10">
          <FlaskConical className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3">You must be at least 21 to enter</h2>
        <p className="text-sm opacity-90 mb-6">
          By entering this site you confirm that you are a research professional
          and accept our Terms & Conditions. All products are for laboratory research use only.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => (window.location.href = "https://google.com")}>Decline</Button>
          <Button
            variant="glass"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => {
              localStorage.setItem("css-age-ok", "1");
              setOpen(false);
            }}
          >
            Accept & Enter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;