import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, Package, RefreshCw } from "lucide-react";

type Item = {
  id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
  shipping_method: string | null;
  shipping_name: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  order_items: Item[];
};

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const OPEN_STATUSES = ["pending", "paid"];

const AdminFulfillment = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [view, setView] = useState<"open" | "fulfilled">("open");

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, user_id, created_at, status, total, shipping_method, shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, order_items(id, product_name, variant, quantity, unit_price)"
      )
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't load orders");
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
      navigate("/auth?redirect=/admin/fulfillment", { replace: true });
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

  const markFulfilled = async (order: Order) => {
    setSaving(order.id);
    const { error } = await supabase.from("orders").update({ status: "fulfilled" }).eq("id", order.id);
    if (error) {
      setSaving(null);
      toast.error(error.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "fulfilled" } : o)));

    const email = emails[order.user_id];
    if (email) {
      const { error: mailError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "order-fulfilled",
          recipientEmail: email,
          idempotencyKey: `order-fulfilled-${order.id}`,
          templateData: {
            orderNumber: order.id.slice(0, 8).toUpperCase(),
            customerName: order.shipping_name ?? "",
            total: money(order.total),
            shippingMethod: order.shipping_method ?? "",
            items: (order.order_items ?? []).map((it) => ({
              name: `${it.product_name}${it.variant ? ` — ${it.variant}` : ""}`,
              quantity: it.quantity,
            })),
          },
        },
      });
      if (mailError) toast.warning("Marked fulfilled, but the email couldn't be sent.");
      else toast.success(`Marked fulfilled — email sent to ${email}`);
    } else {
      toast.success("Marked fulfilled (no email on file for this customer)");
    }
    setSaving(null);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter((o) => {
      const isOpen = OPEN_STATUSES.includes(o.status);
      if (view === "open" ? !isOpen : o.status !== "fulfilled") return false;
      if (!term) return true;
      return (
        o.id.toLowerCase().includes(term) ||
        (emails[o.user_id] ?? "").toLowerCase().includes(term) ||
        (o.shipping_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [orders, q, view, emails]);

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
      <div className="container max-w-5xl">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Packing &amp; Fulfillment</h1>
            <p className="text-muted-foreground text-sm">
              Pack each order, then mark it fulfilled — the customer gets an email automatically.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={fetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${fetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <Input
            placeholder="Search by order ID, email or name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" variant={view === "open" ? "hero" : "outline"} onClick={() => setView("open")}>
              To pack
            </Button>
            <Button size="sm" variant={view === "fulfilled" ? "hero" : "outline"} onClick={() => setView("fulfilled")}>
              Fulfilled
            </Button>
          </div>
        </div>

        {fetching ? (
          <p className="text-muted-foreground py-10 text-center">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Package className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              {view === "open" ? "Nothing waiting to be packed." : "No fulfilled orders yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <div key={o.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <Badge
                        variant="outline"
                        className={
                          o.status === "fulfilled"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                        }
                      >
                        {o.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{fmtDate(o.created_at)}</p>
                    <p className="text-sm mt-1">{emails[o.user_id] || o.user_id.slice(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{money(o.total)}</p>
                    <p className="text-xs text-muted-foreground">{o.shipping_method || "—"}</p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 text-sm">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Pack list</h3>
                    <ul className="space-y-1">
                      {o.order_items?.length ? (
                        o.order_items.map((it) => (
                          <li key={it.id} className="flex justify-between gap-3">
                            <span>
                              {it.product_name}
                              {it.variant ? ` — ${it.variant}` : ""}
                            </span>
                            <span className="font-bold">× {it.quantity}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No line items recorded</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Ship to</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {o.shipping_name}<br />
                      {o.shipping_address_line1}<br />
                      {o.shipping_address_line2 ? <>{o.shipping_address_line2}<br /></> : null}
                      {o.shipping_city}, {o.shipping_state} {o.shipping_postal_code}<br />
                      {o.shipping_country}
                    </p>
                  </div>
                </div>

                {o.status !== "fulfilled" && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <Button variant="hero" size="sm" disabled={saving === o.id} onClick={() => markFulfilled(o)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {saving === o.id ? "Saving…" : "Mark fulfilled & email customer"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminFulfillment;
