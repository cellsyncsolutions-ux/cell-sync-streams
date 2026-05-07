import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Unsubscribe = () => {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.functions.invoke("sms-unsubscribe", {
      body: { phone },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not unsubscribe. Try again.");
      return;
    }
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-background grid place-items-center px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">
        <h1 className="text-2xl font-extrabold mb-2">Unsubscribe from SMS</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Or simply reply <strong>STOP</strong> to any of our text messages.
        </p>
        {done ? (
          <div>
            <p className="text-primary font-bold mb-4">You've been unsubscribed.</p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to home</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
              {submitting ? "Unsubscribing…" : "Unsubscribe"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;