import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "@supabase/supabase-js";
import { z } from "npm:zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

const Body = z.object({
  phone: z.string().trim().min(8).max(20),
  source: z.string().trim().max(50).optional(),
});

function normalizePhone(input: string): string | null {
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const phone = normalizePhone(parsed.data.phone);
    if (!phone) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("sms_subscribers")
      .upsert(
        { phone, source: parsed.data.source ?? "landing", opted_out: false },
        { onConflict: "phone" }
      );
    if (error) throw error;

    // Load configurable code + welcome template
    const { data: settings } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["sms_discount_code", "sms_welcome_message"]);
    const map = Object.fromEntries((settings ?? []).map((r) => [r.key, r.value]));
    const code = map["sms_discount_code"] ?? "SMS10";
    const template =
      map["sms_welcome_message"] ??
      "Welcome to Cell Sync Solutions holiday deals! Use code {CODE} for 10% off. Reply STOP to opt out.";
    const messageBody = template.replaceAll("{CODE}", code);

    // Send welcome SMS with code
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const FROM = Deno.env.get("TWILIO_FROM_NUMBER");
    if (LOVABLE_API_KEY && TWILIO_API_KEY && FROM) {
      const body = new URLSearchParams({
        To: phone,
        From: FROM,
        Body: messageBody,
      });
      const r = await fetch(`${GATEWAY_URL}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TWILIO_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if (r.ok) {
        await supabase.from("sms_subscribers").update({ last_sent_at: new Date().toISOString() }).eq("phone", phone);
      } else {
        console.error("Twilio send failed", r.status, await r.text());
      }
    } else {
      console.warn("Missing Twilio env; skipping welcome SMS");
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});