import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const KEYS = ["sms_discount_code", "sms_welcome_message", "sms_monthly_message"] as const;
type Key = typeof KEYS[number];

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [values, setValues] = useState<Record<Key, string>>({
    sms_discount_code: "",
    sms_welcome_message: "",
    sms_monthly_message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (!admin) return;
      const { data: settings } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", KEYS as unknown as string[]);
      const map = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));
      setValues({
        sms_discount_code: map["sms_discount_code"] ?? "SMS10",
        sms_welcome_message: map["sms_welcome_message"] ?? "",
        sms_monthly_message: map["sms_monthly_message"] ?? "",
      });
    })();
  }, [user, loading, navigate]);

  const save = async () => {
    if (!values.sms_discount_code.trim()) {
      toast.error("Discount code is required");
      return;
    }
    setSaving(true);
    const rows = KEYS.map((k) => ({ key: k, value: values[k], updated_by: user!.id, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("app_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
  };

  if (loading || isAdmin === null) {
    return <main className="min-h-screen grid place-items-center">Loading…</main>;
  }
  if (!isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admins only</h1>
          <p className="text-muted-foreground mb-6">Your account doesn't have admin access.</p>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
        <h1 className="text-3xl font-extrabold mt-4 mb-1">SMS Settings</h1>
        <p className="text-muted-foreground mb-8">
          Configure the discount code and message templates. Use <code className="px-1 bg-muted rounded">{`{CODE}`}</code> as a placeholder where the code should appear.
        </p>

        <div className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div>
            <Label htmlFor="code">Discount code</Label>
            <Input
              id="code"
              value={values.sms_discount_code}
              onChange={(e) => setValues((v) => ({ ...v, sms_discount_code: e.target.value.toUpperCase() }))}
              maxLength={32}
            />
          </div>
          <div>
            <Label htmlFor="welcome">Welcome SMS (sent on signup)</Label>
            <Textarea
              id="welcome"
              rows={3}
              value={values.sms_welcome_message}
              onChange={(e) => setValues((v) => ({ ...v, sms_welcome_message: e.target.value }))}
              maxLength={320}
            />
          </div>
          <div>
            <Label htmlFor="monthly">Monthly reminder SMS</Label>
            <Textarea
              id="monthly"
              rows={3}
              value={values.sms_monthly_message}
              onChange={(e) => setValues((v) => ({ ...v, sms_monthly_message: e.target.value }))}
              maxLength={320}
            />
          </div>
          <Button onClick={save} disabled={saving} variant="hero">
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Admin;