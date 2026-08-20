import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  points_earned: number;
  points_redeemed: number;
  created_at: string;
};

type Customer = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  points: number;
  suspended: boolean;
  suspended_at: string | null;
  created_at: string;
  auth: { last_sign_in_at: string | null; email_confirmed_at: string | null; banned_until: string | null } | null;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
  orders: OrderRow[];
};

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
const money = (n: number) => `$${Number(n).toFixed(2)}`;

const AdminCustomers = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase.functions.invoke("admin-customers", { body: { action: "list" } });
    setFetching(false);
    if (error) {
      toast.error("Could not load customers");
      return;
    }
    setCustomers((data?.customers ?? []) as Customer[]);
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

  const toggleSuspend = async (c: Customer) => {
    const action = c.suspended ? "reinstate" : "suspend";
    if (action === "suspend" && !confirm(`Suspend ${c.email ?? "this account"}? They will be signed out and unable to log in.`)) return;
    setBusy(c.id);
    const { data, error } = await supabase.functions.invoke("admin-customers", { body: { action, userId: c.id } });
    setBusy(null);
    if (error || data?.error) {
      toast.error(data?.error ?? "Action failed");
      return;
    }
    toast.success(action === "suspend" ? "Account suspended" : "Account reinstated");
    setCustomers((list) => list.map((x) => (x.id === c.id ? { ...x, suspended: !c.suspended } : x)));
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return customers;
    return customers.filter((c) =>
      [c.email, c.full_name, c.phone, c.city, c.state].some((v) => v?.toLowerCase().includes(s))
    );
  }, [customers, q]);

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
            <h1 className="text-3xl font-extrabold mb-1">Customer Accounts</h1>
            <p className="text-muted-foreground">
              {customers.length} accounts · {customers.filter((c) => c.suspended).length} suspended
            </p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
            <Button variant="outline" onClick={load} disabled={fetching}>{fetching ? "Loading…" : "Refresh"}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {!fetching && filtered.length === 0 && (
            <p className="text-muted-foreground">No accounts found.</p>
          )}
          {filtered.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold truncate">{c.full_name || "—"}</span>
                    {c.suspended ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground break-all">{c.email ?? "—"}{c.phone ? ` · ${c.phone}` : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {[c.city, c.state, c.country].filter(Boolean).join(", ") || "No address on file"}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Last sign-in</p>
                    <p>{fmtDate(c.auth?.last_sign_in_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Joined</p>
                    <p>{fmtDate(c.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Orders</p>
                    <p>{c.order_count} · {money(c.total_spent)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Points</p>
                    <p>{c.points}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    {expanded === c.id ? "Hide orders" : "View orders"}
                  </Button>
                  <Button
                    variant={c.suspended ? "secondary" : "destructive"}
                    size="sm"
                    disabled={busy === c.id}
                    onClick={() => toggleSuspend(c)}
                  >
                    {busy === c.id ? "…" : c.suspended ? "Reinstate" : "Suspend"}
                  </Button>
                </div>
              </div>

              {expanded === c.id && (
                <div className="mt-4 border-t border-border pt-4">
                  {c.orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="py-2 pr-4">Order</th>
                            <th className="py-2 pr-4">Date</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4">Points</th>
                            <th className="py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.orders.map((o) => (
                            <tr key={o.id} className="border-t border-border/60">
                              <td className="py-2 pr-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                              <td className="py-2 pr-4">{fmtDate(o.created_at)}</td>
                              <td className="py-2 pr-4 capitalize">{o.status}</td>
                              <td className="py-2 pr-4">+{o.points_earned} / -{o.points_redeemed}</td>
                              <td className="py-2 font-semibold">{money(o.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminCustomers;
