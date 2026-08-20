import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL")!;
const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const AUTH_LABELS: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  token_refreshed: "Session refreshed",
  token_revoked: "Session revoked",
  user_signedup: "Signed up",
  user_confirmation_requested: "Confirmation email requested",
  user_recovery_requested: "Password reset requested",
  user_reauthenticate_requested: "Re-authentication requested",
  user_updated_password: "Password changed",
  user_modified: "Account details updated",
  user_repeated_signup: "Repeated signup attempt",
  user_deleted: "Account deleted",
};

function authLabelOf(action: string) {
  return AUTH_LABELS[action] ?? action.replace(/_/g, " ");
}

function authTypeOf(action: string) {
  if (action.includes("recovery") || action.includes("password") || action.includes("reauthenticate")) return "password";
  if (action.includes("login") || action.includes("logout") || action.includes("token")) return "signin";
  return "account";
}

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

    if (action === "timeline") {
      const targetId = String(body?.userId ?? "");
      if (!targetId) return json({ error: "Missing userId" }, 400);

      const [authEvents, orders, history, profile] = await Promise.all([
        userClient.rpc("admin_user_activity", { _user_id: targetId, _limit: 200 }),
        admin.from("orders").select("id, status, total, created_at").eq("user_id", targetId).order("created_at", { ascending: false }),
        admin.from("order_status_history").select("id, order_id, status, created_at").order("created_at", { ascending: false }).limit(500),
        admin.from("profiles").select("suspended, suspended_at, created_at").eq("id", targetId).maybeSingle(),
      ]);

      const orderIds = new Set((orders.data ?? []).map((o) => o.id));
      const events: { at: string; type: string; label: string; detail?: string | null }[] = [];

      for (const e of (authEvents.data ?? []) as { event_at: string; action: string; ip_address: string | null }[]) {
        events.push({ at: e.event_at, type: authTypeOf(e.action), label: authLabelOf(e.action), detail: e.ip_address ? `IP ${e.ip_address}` : null });
      }
      for (const o of orders.data ?? []) {
        events.push({ at: o.created_at, type: "order", label: `Order placed · $${Number(o.total).toFixed(2)}`, detail: `#${o.id.slice(0, 8)}` });
      }
      for (const h of history.data ?? []) {
        if (!orderIds.has(h.order_id)) continue;
        events.push({ at: h.created_at, type: "order", label: `Order status: ${h.status}`, detail: `#${h.order_id.slice(0, 8)}` });
      }
      if (profile.data?.created_at) events.push({ at: profile.data.created_at, type: "account", label: "Account created" });
      if (profile.data?.suspended && profile.data.suspended_at) {
        events.push({ at: profile.data.suspended_at, type: "suspension", label: "Account suspended by admin" });
      }

      events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      return json({ events, authLogAvailable: !authEvents.error, authLogError: authEvents.error?.message ?? null });
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
