import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "@supabase/supabase-js";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
  const FROM = Deno.env.get("TWILIO_FROM_NUMBER");
  if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !FROM) {
    return new Response(JSON.stringify({ error: "Twilio not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Subscribers due: opted in, and (never sent OR last_sent_at >= 30 days ago)
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: due, error } = await supabase
    .from("sms_subscribers")
    .select("id, phone, last_sent_at")
    .eq("opted_out", false)
    .or(`last_sent_at.is.null,last_sent_at.lte.${cutoff}`)
    .limit(500);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = "Cell Sync Solutions: Your monthly holiday deal is here! Use code SMS10 for 10% off. Reply STOP to opt out.";
  let sent = 0, failed = 0;
  for (const sub of due ?? []) {
    const body = new URLSearchParams({ To: sub.phone, From: FROM, Body: message });
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
      sent++;
      await supabase.from("sms_subscribers").update({ last_sent_at: new Date().toISOString() }).eq("id", sub.id);
    } else {
      failed++;
      console.error("send failed", sub.phone, r.status, await r.text());
    }
  }

  return new Response(JSON.stringify({ ok: true, sent, failed, considered: due?.length ?? 0 }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});