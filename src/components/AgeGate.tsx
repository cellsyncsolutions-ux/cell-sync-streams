import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const AgeGate = () => {
  const [open, setOpen] = useState(false);
  const [is21, setIs21] = useState(false);
  const [compliance, setCompliance] = useState(false);
  const [human, setHuman] = useState(false);
  const { t } = useLanguage();
  const allChecked = is21 && compliance && human;

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
        <p className="text-sm opacity-90 mb-5">{t("age_body")}</p>

        <div className="space-y-3 text-left mb-6">
          {[
            { id: "age-21", checked: is21, set: setIs21, label: t("age_check_21") },
            {
              id: "age-compliance",
              checked: compliance,
              set: setCompliance,
              label: (
                <>
                  {t("age_check_compliance")}{" "}
                  <Link to="/compliance" className="underline underline-offset-2">
                    /compliance
                  </Link>
                </>
              ),
            },
            { id: "age-human", checked: human, set: setHuman, label: t("age_check_robot") },
          ].map((c) => (
            <label key={c.id} htmlFor={c.id} className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                id={c.id}
                checked={c.checked}
                onCheckedChange={(v) => c.set(v === true)}
                className="mt-0.5 border-primary-foreground/60 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <span className="text-xs leading-snug opacity-90">{c.label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => (window.location.href = "https://google.com")}>{t("age_decline")}</Button>
          <Button
            variant="glass"
            disabled={!allChecked}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 disabled:opacity-50"
            onClick={() => {
              if (!allChecked) return;
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