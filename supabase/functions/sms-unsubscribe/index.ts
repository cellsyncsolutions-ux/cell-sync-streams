import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "@supabase/supabase-js";
import { z } from "npm:zod@3.23.8";

const Body = z.object({ phone: z.string().trim().min(8).max(20) });

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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const phone = normalize(parsed.data.phone);
    if (!phone) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await supabase
      .from("sms_subscribers")
      .upsert({ phone, opted_out: true }, { onConflict: "phone" });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});