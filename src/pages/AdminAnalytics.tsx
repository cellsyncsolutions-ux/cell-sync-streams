import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  points_earned: number;
  points_redeemed: number;
  coupon_code: string | null;
  created_at: string;
};

type Item = {
  order_id: string;
  product_id: string;
  product_name: string;
  variant: string | null;
  unit_price: number;
  quantity: number;
};

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "All time", days: 0 },
];

const CANCELED = ["canceled", "refunded"];

const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="text-2xl font-extrabold mt-1">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const AdminAnalytics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [fetching, setFetching] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [smsCount, setSmsCount] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [days, setDays] = useState(30);

  const load = async () => {
    setFetching(true);
    const [o, i, p, s, inv] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5000),
      supabase.from("order_items").select("order_id, product_id, product_name, variant, unit_price, quantity").limit(20000),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("sms_subscribers").select("id", { count: "exact", head: true }).eq("opted_out", false),
      supabase.from("product_inventory").select("quantity, low_stock_threshold"),
    ]);
    setOrders((o.data ?? []) as Order[]);
    setItems((i.data ?? []) as Item[]);
    setCustomerCount(p.count ?? 0);
    setSmsCount(s.count ?? 0);
    setLowStock(((inv.data ?? []) as { quantity: number; low_stock_threshold: number }[]).filter((r) => r.quantity <= r.low_stock_threshold).length);
    setFetching(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      else setFetching(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, navigate]);

  const inRange = useMemo(() => {
    if (!days) return orders;
    const cutoff = Date.now() - days * 86400000;
    return orders.filter((o) => new Date(o.created_at).getTime() >= cutoff);
  }, [orders, days]);

  const valid = useMemo(() => inRange.filter((o) => !CANCELED.includes(o.status)), [inRange]);

  const revenue = valid.reduce((s, o) => s + Number(o.total), 0);
  const discounts = valid.reduce((s, o) => s + Number(o.discount || 0), 0);
  const aov = valid.length ? revenue / valid.length : 0;
  const repeatRate = (() => {
    const counts = new Map<string, number>();
    valid.forEach((o) => counts.set(o.user_id, (counts.get(o.user_id) ?? 0) + 1));
    const buyers = counts.size;
    const repeat = [...counts.values()].filter((n) => n > 1).length;
    return buyers ? (repeat / buyers) * 100 : 0;
  })();

  const series = useMemo(() => {
    const span = days || 90;
    const map = new Map<string, { date: string; revenue: number; orders: number }>();
    for (let i = span - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      map.set(d, { date: d.slice(5), revenue: 0, orders: 0 });
    }
    valid.forEach((o) => {
      const k = new Date(o.created_at).toISOString().slice(0, 10);
      const row = map.get(k);
      if (row) {
        row.revenue += Number(o.total);
        row.orders += 1;
      }
    });
    return [...map.values()];
  }, [valid, days]);

  const statusBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    inRange.forEach((o) => m.set(o.status, (m.get(o.status) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [inRange]);

  const validIds = useMemo(() => new Set(valid.map((o) => o.id)), [valid]);

  const topProducts = useMemo(() => {
    const m = new Map<string, { name: string; units: number; revenue: number }>();
    items
      .filter((it) => validIds.has(it.order_id))
      .forEach((it) => {
        const key = it.product_name + (it.variant ? ` · ${it.variant}` : "");
        const row = m.get(key) ?? { name: key, units: 0, revenue: 0 };
        row.units += it.quantity;
        row.revenue += Number(it.unit_price) * it.quantity;
        m.set(key, row);
      });
    return [...m.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [items, validIds]);

  const topCoupons = useMemo(() => {
    const m = new Map<string, { code: string; uses: number; revenue: number }>();
    valid
      .filter((o) => o.coupon_code)
      .forEach((o) => {
        const code = o.coupon_code!.toUpperCase();
        const row = m.get(code) ?? { code, uses: 0, revenue: 0 };
        row.uses += 1;
        row.revenue += Number(o.total);
        m.set(code, row);
      });
    return [...m.values()].sort((a, b) => b.uses - a.uses).slice(0, 8);
  }, [valid]);

  if (loading || isAdmin === null) return <main className="min-h-screen grid place-items-center">Loading…</main>;
  if (!isAdmin)
    return (
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admins only</h1>
          <p className="text-muted-foreground mb-6">Your account doesn't have admin access.</p>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container max-w-6xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
        <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Analytics</h1>
            <p className="text-muted-foreground">Store performance at a glance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <Button key={r.label} size="sm" variant={days === r.days ? "default" : "outline"} onClick={() => setDays(r.days)}>
                {r.label}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={load} disabled={fetching}>
              {fetching ? "Loading…" : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Stat label="Revenue" value={money(revenue)} sub={`${money(discounts)} discounted`} />
          <Stat label="Orders" value={String(valid.length)} sub={`${inRange.length - valid.length} canceled/refunded`} />
          <Stat label="Avg order value" value={money(aov)} sub={`${repeatRate.toFixed(0)}% repeat buyers`} />
          <Stat label="Customers" value={String(customerCount)} sub={`${smsCount} SMS subscribers`} />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Revenue over time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" minTickGap={20} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                  formatter={(v: number) => money(v)}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Orders per day</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" minTickGap={20} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Order status</h2>
            {statusBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders in this range.</p>
            ) : (
              <ul className="space-y-3">
                {statusBreakdown.map(([status, count]) => (
                  <li key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(count / inRange.length) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground mt-4">{lowStock} product variants at or below low-stock threshold.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Top products</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales in this range.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2">Product</th>
                    <th className="py-2 text-right">Units</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.name} className="border-t border-border/60">
                      <td className="py-2 pr-2">{p.name}</td>
                      <td className="py-2 text-right">{p.units}</td>
                      <td className="py-2 text-right font-semibold">{money(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Coupon performance</h2>
            {topCoupons.length === 0 ? (
              <p className="text-sm text-muted-foreground">No coupon orders in this range.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2">Code</th>
                    <th className="py-2 text-right">Uses</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topCoupons.map((c) => (
                    <tr key={c.code} className="border-t border-border/60">
                      <td className="py-2 font-mono">{c.code}</td>
                      <td className="py-2 text-right">{c.uses}</td>
                      <td className="py-2 text-right font-semibold">{money(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminAnalytics;
