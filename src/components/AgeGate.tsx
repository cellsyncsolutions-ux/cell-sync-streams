import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const COMPLIANCE_VERSION = "2026-08-20";

const AgeGate = () => {
  const [open, setOpen] = useState(false);
  const [is21, setIs21] = useState(false);
  const [compliance, setCompliance] = useState(false);
  const [human, setHuman] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();
  const allChecked = is21 && compliance && human;

  useEffect(() => {
    if (localStorage.getItem("css-age-ok") !== COMPLIANCE_VERSION) setOpen(true);
  }, []);

  const getVisitorId = () => {
    let id = localStorage.getItem("css-visitor-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("css-visitor-id", id);
    }
    return id;
  };

  const accept = async () => {
    if (!allChecked || saving) return;
    setSaving(true);
    const acceptedAt = new Date().toISOString();
    try {
      const { data } = await supabase.auth.getUser();
      await supabase.from("compliance_consents").insert({
        version: COMPLIANCE_VERSION,
        accepted_at: acceptedAt,
        visitor_id: getVisitorId(),
        user_id: data?.user?.id ?? null,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        language: navigator.language,
      });
    } catch {
      // never block entry on logging failure
    }
    localStorage.setItem("css-age-ok", COMPLIANCE_VERSION);
    localStorage.setItem("css-age-ok-at", acceptedAt);
    setSaving(false);
    setOpen(false);
  };

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
            disabled={!allChecked || saving}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 disabled:opacity-50"
            onClick={accept}
          >
            {t("age_accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;