import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Copy } from "lucide-react";

type Affiliate = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  commission_rate: number;
  active: boolean;
};

type Coupon = {
  id: string;
  code: string;
  affiliate_id: string | null;
  discount_percent: number;
  max_uses: number | null;
  times_used: number;
  expires_at: string | null;
  active: boolean;
};

const AdminAffiliates = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orderStats, setOrderStats] = useState<Record<string, { orders: number; revenue: number }>>({});
  const [query, setQuery] = useState("");

  const [newAff, setNewAff] = useState({ name: "", email: "", phone: "", commission_rate: 10 });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    affiliate_id: "",
    discount_percent: 10,
    max_uses: "",
    expires_at: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    })();
  }, [user, loading, navigate]);

  const load = async () => {
    setBusy(true);
    const [a, c, o] = await Promise.all([
      supabase.from("affiliates").select("*").order("created_at", { ascending: false }),
      supabase.from("coupons").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("affiliate_id, total").not("affiliate_id", "is", null),
    ]);
    setBusy(false);
    if (a.error) return toast.error(a.error.message);
    if (c.error) return toast.error(c.error.message);
    setAffiliates((a.data ?? []) as Affiliate[]);
    setCoupons((c.data ?? []) as Coupon[]);
    const stats: Record<string, { orders: number; revenue: number }> = {};
    (o.data ?? []).forEach((row: { affiliate_id: string | null; total: number }) => {
      if (!row.affiliate_id) return;
      const s = stats[row.affiliate_id] ?? { orders: 0, revenue: 0 };
      s.orders += 1;
      s.revenue += Number(row.total || 0);
      stats[row.affiliate_id] = s;
    });
    setOrderStats(stats);
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const addAffiliate = async () => {
    if (!newAff.name.trim()) return toast.error("Name is required");
    const { error } = await supabase.from("affiliates").insert({
      name: newAff.name.trim(),
      email: newAff.email.trim() || null,
      phone: newAff.phone.trim() || null,
      commission_rate: Number(newAff.commission_rate) || 0,
    });
    if (error) return toast.error(error.message);
    setNewAff({ name: "", email: "", phone: "", commission_rate: 10 });
    toast.success("Affiliate added");
    load();
  };

  const updateAffiliate = async (id: string, patch: Partial<Affiliate>) => {
    setAffiliates((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    const { error } = await supabase.from("affiliates").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const removeAffiliate = async (id: string) => {
    const { error } = await supabase.from("affiliates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Affiliate removed");
    load();
  };

  const addCoupon = async () => {
    const code = newCoupon.code.trim().toUpperCase();
    if (!code) return toast.error("Coupon code is required");
    const pct = Number(newCoupon.discount_percent);
    if (!(pct > 0 && pct <= 100)) return toast.error("Discount must be between 1 and 100");
    const { error } = await supabase.from("coupons").insert({
      code,
      affiliate_id: newCoupon.affiliate_id || null,
      discount_percent: pct,
      max_uses: newCoupon.max_uses ? Number(newCoupon.max_uses) : null,
      expires_at: newCoupon.expires_at ? new Date(newCoupon.expires_at).toISOString() : null,
    });
    if (error) return toast.error(error.message);
    setNewCoupon({ code: "", affiliate_id: "", discount_percent: 10, max_uses: "", expires_at: "" });
    toast.success("Coupon created");
    load();
  };

  const updateCoupon = async (id: string, patch: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const { error } = await supabase.from("coupons").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const removeCoupon = async (id: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Coupon deleted");
    load();
  };

  const filteredAffiliates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return affiliates;
    return affiliates.filter((a) => `${a.name} ${a.email ?? ""}`.toLowerCase().includes(q));
  }, [affiliates, query]);

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
    <main className="min-h-screen bg-background">
      <div className="container py-8 md:py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
        <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Affiliates & Coupons</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage partners and the discount codes customers enter at checkout.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={busy}>Refresh</Button>
        </div>

        {/* Add affiliate */}
        <section className="rounded-lg border border-border bg-card p-5 mb-8">
          <h2 className="font-bold mb-4">Add affiliate</h2>
          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <Label>Name</Label>
              <Input value={newAff.name} onChange={(e) => setNewAff({ ...newAff, name: e.target.value })} maxLength={100} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={newAff.email} onChange={(e) => setNewAff({ ...newAff, email: e.target.value })} maxLength={150} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={newAff.phone} onChange={(e) => setNewAff({ ...newAff, phone: e.target.value })} maxLength={40} />
            </div>
            <div>
              <Label>Commission %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={newAff.commission_rate}
                onChange={(e) => setNewAff({ ...newAff, commission_rate: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button variant="hero" className="mt-4" onClick={addAffiliate}>
            <Plus className="h-4 w-4 mr-1" /> Add affiliate
          </Button>
        </section>

        <Input
          placeholder="Search affiliates…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs mb-4"
        />

        {/* Affiliates list */}
        <section className="space-y-3 mb-10">
          {filteredAffiliates.length === 0 && (
            <p className="text-muted-foreground text-sm">No affiliates yet.</p>
          )}
          {filteredAffiliates.map((a) => {
            const stats = orderStats[a.id] ?? { orders: 0, revenue: 0 };
            const codes = coupons.filter((c) => c.affiliate_id === a.id);
            return (
              <div key={a.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-[180px]">
                    <p className="font-bold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.email || "—"} · {a.phone || "—"}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.orders} orders · ${stats.revenue.toFixed(2)} revenue
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Est. commission ${(stats.revenue * (Number(a.commission_rate) || 0) / 100).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Label className="text-xs">Commission %</Label>
                    <Input
                      type="number"
                      className="w-20 h-8"
                      value={a.commission_rate}
                      onChange={(e) => updateAffiliate(a.id, { commission_rate: Number(e.target.value) })}
                    />
                    <Label className="text-xs">Active</Label>
                    <Switch checked={a.active} onCheckedChange={(v) => updateAffiliate(a.id, { active: v })} />
                    <Button size="sm" variant="ghost" onClick={() => removeAffiliate(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {codes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {codes.map((c) => (
                      <span key={c.id} className="text-xs rounded bg-secondary px-2 py-1 font-mono">
                        {c.code} · {c.discount_percent}%
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Coupons */}
        <section className="rounded-lg border border-border bg-card p-5 mb-6">
          <h2 className="font-bold mb-4">Create coupon code</h2>
          <div className="grid gap-3 md:grid-cols-5">
            <div>
              <Label>Code</Label>
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                maxLength={32}
                placeholder="PARTNER10"
              />
            </div>
            <div>
              <Label>Affiliate</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={newCoupon.affiliate_id}
                onChange={(e) => setNewCoupon({ ...newCoupon, affiliate_id: e.target.value })}
              >
                <option value="">— none —</option>
                {affiliates.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Discount %</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={newCoupon.discount_percent}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_percent: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max uses</Label>
              <Input
                type="number"
                min={1}
                placeholder="unlimited"
                value={newCoupon.max_uses}
                onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value })}
              />
            </div>
            <div>
              <Label>Expires</Label>
              <Input
                type="date"
                value={newCoupon.expires_at}
                onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
              />
            </div>
          </div>
          <Button variant="hero" className="mt-4" onClick={addCoupon}>
            <Plus className="h-4 w-4 mr-1" /> Create coupon
          </Button>
        </section>

        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr className="text-left">
                <th className="p-3">Code</th>
                <th className="p-3">Affiliate</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Uses</th>
                <th className="p-3">Expires</th>
                <th className="p-3">Active</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr><td className="p-4 text-muted-foreground" colSpan={7}>No coupons yet.</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-mono font-bold">
                    <button
                      className="inline-flex items-center gap-1 hover:text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        toast.success("Code copied");
                      }}
                    >
                      {c.code} <Copy className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="p-3">{affiliates.find((a) => a.id === c.affiliate_id)?.name ?? "—"}</td>
                  <td className="p-3">
                    <Input
                      type="number"
                      className="w-20 h-8"
                      value={c.discount_percent}
                      onChange={(e) => updateCoupon(c.id, { discount_percent: Number(e.target.value) })}
                    />
                  </td>
                  <td className="p-3">{c.times_used}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                  <td className="p-3">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "—"}</td>
                  <td className="p-3">
                    <Switch checked={c.active} onCheckedChange={(v) => updateCoupon(c.id, { active: v })} />
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => removeCoupon(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminAffiliates;
