import { createClient } from "npm:@supabase/supabase-js@2";

// Public Twilio webhook — no CORS / no JWT. Twilio POSTs application/x-www-form-urlencoded.
const STOP_WORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const START_WORDS = new Set(["START", "YES", "UNSTOP"]);

function twiml(body?: string) {
  const msg = body
    ? `<Response><Message>${body}</Message></Response>`
    : `<Response/>`;
  return new Response(msg, { headers: { "Content-Type": "text/xml" } });
}

function normalize(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    const rest = digits.slice(1).replace(/\D/g, "");
    if (rest.length < 7 || rest.length > 15) return null;
    return "+" + rest;
  }
  const d = digits.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  try {
    const form = await req.formData();
    const from = String(form.get("From") ?? "");
    const bodyText = String(form.get("Body") ?? "").trim().toUpperCase();
    const phone = normalize(from);
    if (!phone) return twiml();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const firstWord = bodyText.split(/\s+/)[0] ?? "";

    if (STOP_WORDS.has(firstWord)) {
      await supabase
        .from("sms_subscribers")
        .upsert({ phone, opted_out: true }, { onConflict: "phone" });
      // Twilio's carrier compliance auto-replies; return empty TwiML to avoid double-message
      return twiml();
    }

    if (START_WORDS.has(firstWord)) {
      await supabase
        .from("sms_subscribers")
        .upsert(
          { phone, opted_out: false, source: "sms-restart" },
          { onConflict: "phone" }
        );
      return twiml("You're resubscribed to Cell Sync Solutions deals. Reply STOP to opt out.");
    }

    if (firstWord === "HELP" || firstWord === "INFO") {
      return twiml("Cell Sync Solutions: Reply STOP to unsubscribe. Msg & data rates may apply.");
    }

    return twiml();
  } catch (e) {
    console.error("sms-webhook error", e);
    return twiml();
  }
});