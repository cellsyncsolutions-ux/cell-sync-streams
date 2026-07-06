import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo-mark.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate("/account", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <img src={logo} alt="Cell Sync Solutions" className="h-12 w-12" />
        <span className="font-extrabold text-xl text-primary">CELL SYNC SOLUTIONS</span>
      </Link>

      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-6">
        <h1 className="text-2xl font-extrabold mb-1">Set a new password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {ready
            ? "Enter a new password for your account."
            : "Waiting for your recovery link… If nothing happens, open the reset link from your email again."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rp-pw">New password</Label>
            <Input id="rp-pw" name="password" type="password" required minLength={6} maxLength={72} disabled={!ready} />
          </div>
          <div>
            <Label htmlFor="rp-confirm">Confirm password</Label>
            <Input id="rp-confirm" name="confirm" type="password" required minLength={6} maxLength={72} disabled={!ready} />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={!ready || submitting}>
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>

      <div className="mt-8 pt-6 border-t border-border">
        <h2 className="text-sm font-semibold mb-1">Didn't get the email?</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Enter your email and we'll send another reset link.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            autoComplete="email"
          />
          <Button
            type="button"
            variant="outline"
            disabled={resending || !resendEmail}
            onClick={async () => {
              setResending(true);
              const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
              setResending(false);
              if (error) toast.error(error.message);
              else toast.success("Reset email sent. Check your inbox.");
            }}
          >
            {resending ? "Sending..." : "Resend"}
          </Button>
        </div>
      </div>
      </div>

      <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary mt-6">← Back to sign in</Link>
    </main>
  );
};

export default ResetPassword;