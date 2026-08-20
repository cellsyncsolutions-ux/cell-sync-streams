import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL")!;
const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(url, service);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body?.action ?? "list";

    if (action === "suspend" || action === "reinstate") {
      const targetId = String(body?.userId ?? "");
      if (!targetId) return json({ error: "Missing userId" }, 400);
      if (targetId === user.id) return json({ error: "You cannot suspend your own account" }, 400);
      const suspend = action === "suspend";
      const { error: banErr } = await admin.auth.admin.updateUserById(targetId, {
        ban_duration: suspend ? "876000h" : "none",
      });
      if (banErr) return json({ error: banErr.message }, 400);
      const { error: pErr } = await admin.from("profiles")
        .update({ suspended: suspend, suspended_at: suspend ? new Date().toISOString() : null })
        .eq("id", targetId);
      if (pErr) return json({ error: pErr.message }, 400);
      return json({ ok: true });
    }

    // list
    const [{ data: profiles, error: profErr }, { data: orders, error: ordErr }] = await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin.from("orders").select("id, user_id, status, total, points_earned, points_redeemed, created_at").order("created_at", { ascending: false }),
    ]);
    if (profErr) return json({ error: profErr.message }, 400);
    if (ordErr) return json({ error: ordErr.message }, 400);

    const authUsers: Record<string, { last_sign_in_at: string | null; email_confirmed_at: string | null; banned_until: string | null; created_at: string }> = {};
    let page = 1;
    while (page <= 20) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) break;
      for (const u of data.users) {
        authUsers[u.id] = {
          last_sign_in_at: u.last_sign_in_at ?? null,
          email_confirmed_at: (u as { email_confirmed_at?: string }).email_confirmed_at ?? null,
          banned_until: (u as { banned_until?: string }).banned_until ?? null,
          created_at: u.created_at,
        };
      }
      if (data.users.length < 200) break;
      page++;
    }

    const customers = (profiles ?? []).map((p) => {
      const own = (orders ?? []).filter((o) => o.user_id === p.id);
      const spent = own.filter((o) => o.status !== "canceled").reduce((s, o) => s + Number(o.total), 0);
      return {
        ...p,
        auth: authUsers[p.id] ?? null,
        order_count: own.length,
        total_spent: spent,
        last_order_at: own[0]?.created_at ?? null,
        orders: own,
      };
    });

    return json({ customers });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
