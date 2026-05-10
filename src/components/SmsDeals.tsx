import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tag, MessageSquare, Calendar } from "lucide-react";

const SmsDeals = () => {
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
    const { error } = await supabase.functions.invoke("sms-subscribe", {
      body: { phone, source: "landing" },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not subscribe. Try again.");
      return;
    }
    setDone(true);
    toast.success("You're in! Check your phone for code SMS10.");
  };

  return (
    <section id="sms-deals" className="bg-navy text-navy-foreground py-20">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            Monthly SMS Blast
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl leading-tight mb-4">
            Text-only deals.<br />10% off, every month.
          </h2>
          <p className="opacity-85 max-w-md mb-6">
            Join our SMS list for exclusive holiday drops and a fresh 10% off code delivered to your phone every 30 days.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><Tag className="h-4 w-4 text-primary" /> Instant SMS code on signup</li>
            <li className="flex items-center gap-3"><Calendar className="h-4 w-4 text-primary" /> Monthly reminder + 10% off</li>
            <li className="flex items-center gap-3"><MessageSquare className="h-4 w-4 text-primary" /> Text STOP to opt-out anytime.</li>
          </ul>
        </div>
        <div className="bg-navy-foreground/5 border border-navy-foreground/15 rounded-xl p-8">
          {done ? (
            <div className="text-center py-8">
              <h3 className="font-extrabold text-2xl mb-2 text-primary">You're subscribed!</h3>
              <p className="opacity-85">Your welcome text with code <strong>SMS10</strong> is on its way.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
                Phone number
              </label>
              <Input
                type="tel"
                inputMode="tel"
                placeholder="your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                required
                className="bg-background text-foreground h-12"
              />
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Get my 10% off code"}
              </Button>
              <p className="text-xs opacity-70 leading-relaxed">
                By subscribing you agree to receive recurring marketing texts from Cell Sync Solutions.
                Msg & data rates may apply. Reply STOP to cancel, HELP for help.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmsDeals;