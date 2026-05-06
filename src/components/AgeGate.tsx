import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const AgeGate = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

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
        <h2 className="text-2xl font-bold mb-3">{t("age_title")}</h2>
        <p className="text-sm opacity-90 mb-6">{t("age_body")}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => (window.location.href = "https://google.com")}>{t("age_decline")}</Button>
          <Button
            variant="glass"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => {
              localStorage.setItem("css-age-ok", "1");
              setOpen(false);
            }}
          >
            {t("age_accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;