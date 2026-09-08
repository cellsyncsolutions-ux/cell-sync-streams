import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Package, RefreshCw } from "lucide-react";

type Item = {
  id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
};

type HistoryRow = { id: string; status: string; created_at: string };

type Order = {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  shipping_method: string | null;
  total: number;
  points_earned: number;
  points_redeemed: number;
  points_reversed: boolean;
  refund_status: string;
  coupon_code: string | null;
  shipping_name: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  order_items: Item[];
  order_status_history: HistoryRow[];
};

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  shipped: "bg-primary/15 text-primary border-primary/30",
  fulfilled: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  delivered: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  canceled: "bg-destructive/10 text-destructive border-destructive/30",
  refunded: "bg-muted text-muted-foreground border-border",
};

const AdminOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setFetching(true);
    const { data } = await supabase
      .from("orders")
      .select(
        "id, user_id, created_at, status, subtotal, discount, shipping_cost, shipping_method, total, points_earned, points_redeemed, points_reversed, refund_status, coupon_code, shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, order_items(id, product_name, variant, quantity, unit_price), order_status_history(id, status, created_at)"
      )
      .order("created_at", { ascending: false });
    const rows = (data as unknown as Order[]) ?? [];
    setOrders(rows);
    const ids = [...new Set(rows.map((o) => o.user_id))];
    if (ids.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
      setEmails(Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email ?? ""])));
    }
    setFetching(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth?redirect=/admin/orders", { replace: true });
      return;
    }
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      else setFetching(false);
    })();
  }, [user, loading, navigate]);

  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(orders.map((o) => o.status)))],
    [orders]
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!term) return true;
      return (
        o.id.toLowerCase().includes(term) ||
        (emails[o.user_id] ?? "").toLowerCase().includes(term) ||
        (o.shipping_name ?? "").toLowerCase().includes(term) ||
        (o.coupon_code ?? "").toLowerCase().includes(term)
      );
    });
  }, [orders, q, statusFilter, emails]);

  const totals = useMemo(
    () => ({
      count: filtered.length,
      revenue: filtered.reduce((s, o) => s + Number(o.total || 0), 0),
      shipping: filtered.reduce((s, o) => s + Number(o.shipping_cost || 0), 0),
      pointsEarned: filtered.reduce((s, o) => s + Number(o.points_earned || 0), 0),
      pointsRedeemed: filtered.reduce((s, o) => s + Number(o.points_redeemed || 0), 0),
    }),
    [filtered]
  );

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
    <main className="min-h-screen bg-background py-10">
      <div className="container max-w-6xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Order History</h1>
            <p className="text-muted-foreground text-sm">Every order with its status, shipping and points.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={fetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${fetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { label: "Orders", value: totals.count.toLocaleString() },
            { label: "Revenue", value: money(totals.revenue) },
            { label: "Shipping collected", value: money(totals.shipping) },
            {
              label: "Points earned / redeemed",
              value: `${totals.pointsEarned.toLocaleString()} / ${totals.pointsRedeemed.toLocaleString()}`,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            placeholder="Search by order ID, email, name or coupon"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "hero" : "outline"}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : s}
              </Button>
            ))}
          </div>
        </div>

        {fetching ? (
          <p className="text-muted-foreground py-10 text-center">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Package className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No orders match this view yet.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {filtered.map((o) => {
              const open = expanded === o.id;
              return (
                <div key={o.id} className="border-b border-border last:border-0">
                  <button
                    onClick={() => setExpanded(open ? null : o.id)}
                    className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-secondary/40 transition-smooth"
                  >
                    {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                    <div className="min-w-[9rem]">
                      <p className="font-bold text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{fmtDate(o.created_at)}</p>
                    </div>
                    <div className="min-w-[12rem] flex-1">
                      <p className="text-sm">{o.shipping_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{emails[o.user_id] || o.user_id.slice(0, 8)}</p>
                    </div>
                    <Badge variant="outline" className={STATUS_STYLE[o.status] ?? ""}>
                      {o.status}
                    </Badge>
                    {o.refund_status && o.refund_status !== "none" && (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-600">
                        refund {o.refund_status}
                      </Badge>
                    )}
                    <div className="text-right min-w-[6rem]">
                      <p className="font-bold">{money(o.total)}</p>
                      <p className="text-xs text-primary">+{Number(o.points_earned).toLocaleString()} pts</p>
                    </div>
                  </button>

                  {open && (
                    <div className="grid gap-6 md:grid-cols-3 bg-secondary/30 p-5 text-sm">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Items</h3>
                        <ul className="space-y-1">
                          {o.order_items?.length ? (
                            o.order_items.map((it) => (
                              <li key={it.id} className="flex justify-between gap-3">
                                <span>
                                  {it.product_name}
                                  {it.variant ? ` — ${it.variant}` : ""} × {it.quantity}
                                </span>
                                <span>{money(it.unit_price * it.quantity)}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground">No line items recorded</li>
                          )}
                        </ul>
                        <div className="mt-3 space-y-1 border-t border-border pt-2">
                          <div className="flex justify-between"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
                          <div className="flex justify-between"><span>Discount{o.coupon_code ? ` (${o.coupon_code})` : ""}</span><span>−{money(o.discount)}</span></div>
                          <div className="flex justify-between"><span>Shipping</span><span>{money(o.shipping_cost)}</span></div>
                          <div className="flex justify-between font-bold"><span>Total</span><span>{money(o.total)}</span></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Shipping</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {o.shipping_name}<br />
                          {o.shipping_address_line1}<br />
                          {o.shipping_address_line2 ? <>{o.shipping_address_line2}<br /></> : null}
                          {o.shipping_city}, {o.shipping_state} {o.shipping_postal_code}<br />
                          {o.shipping_country}
                        </p>
                        <p className="mt-3">
                          <span className="text-muted-foreground">Method: </span>
                          {o.shipping_method || "—"} ({money(o.shipping_cost)})
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Points</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between"><span>Earned</span><span className={o.points_reversed ? "line-through text-muted-foreground" : "text-primary font-bold"}>+{o.points_earned}</span></div>
                          <div className="flex justify-between"><span>Redeemed</span><span className={o.points_reversed ? "line-through text-muted-foreground" : ""}>−{o.points_redeemed}</span></div>
                          {o.points_reversed && <p className="text-xs text-muted-foreground">Points were reversed for this order.</p>}
                        </div>

                        <h3 className="text-xs font-bold uppercase tracking-wider mt-4 mb-2">Status history</h3>
                        <ul className="space-y-1">
                          {[...(o.order_status_history ?? [])]
                            .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
                            .map((h) => (
                              <li key={h.id} className="flex justify-between gap-3 text-xs">
                                <span className="font-medium">{h.status}</span>
                                <span className="text-muted-foreground">{fmtDate(h.created_at)}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
