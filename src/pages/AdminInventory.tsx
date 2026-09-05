import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { toast } from "sonner";

type Row = {
  id?: string;
  product_id: string;
  product_name: string;
  variant: string;
  quantity: number;
  low_stock_threshold: number;
  available: boolean;
};

const buildSkus = (): Row[] => {
  const rows: Row[] = [];
  products.forEach((p) => {
    if (p.variants?.length) {
      p.variants.forEach((v) =>
        rows.push({ product_id: p.id, product_name: p.name, variant: v.label, quantity: 0, low_stock_threshold: 5, available: true })
      );
    } else {
      rows.push({ product_id: p.id, product_name: p.name, variant: "", quantity: 0, low_stock_threshold: 5, available: true });
    }
  });
  return rows;
};

const AdminInventory = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);

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
    const { data, error } = await supabase
      .from("product_inventory")
      .select("id, product_id, product_name, variant, quantity, low_stock_threshold, available");
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const saved = new Map((data ?? []).map((r) => [`${r.product_id}::${r.variant}`, r]));
    const merged = buildSkus().map((sku) => {
      const hit = saved.get(`${sku.product_id}::${sku.variant}`);
      return hit ? { ...sku, ...hit } : sku;
    });
    setRows(merged);
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const setField = (key: string, field: "quantity" | "low_stock_threshold", value: number) => {
    setRows((prev) =>
      prev.map((r) => (`${r.product_id}::${r.variant}` === key ? { ...r, [field]: value } : r))
    );
  };

  const payload = (r: Row) => ({
    product_id: r.product_id,
    product_name: r.product_name,
    variant: r.variant,
    quantity: Math.max(0, Math.floor(r.quantity || 0)),
    low_stock_threshold: Math.max(0, Math.floor(r.low_stock_threshold || 0)),
    available: r.available !== false,
  });

  const saveRow = async (row: Row) => {
    const { error } = await supabase
      .from("product_inventory")
      .upsert(payload(row), { onConflict: "product_id,variant" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Saved ${row.product_name}${row.variant ? ` — ${row.variant}` : ""}`);
    load();
  };

  const toggleAvailable = async (row: Row) => {
    const next = { ...row, available: !(row.available !== false) };
    setRows((prev) =>
      prev.map((r) =>
        `${r.product_id}::${r.variant}` === `${row.product_id}::${row.variant}` ? next : r
      )
    );
    const { error } = await supabase
      .from("product_inventory")
      .upsert(payload(next), { onConflict: "product_id,variant" });
    if (error) {
      toast.error(error.message);
      load();
      return;
    }
    toast.success(
      `${row.product_name}${row.variant ? ` — ${row.variant}` : ""} is now ${next.available ? "available" : "temporarily unavailable"}`
    );
  };

  const saveAll = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("product_inventory")
      .upsert(rows.map(payload), { onConflict: "product_id,variant" });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("All inventory counts saved");
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (lowOnly && r.quantity > r.low_stock_threshold) return false;
      if (!q) return true;
      return `${r.product_name} ${r.variant} ${r.product_id}`.toLowerCase().includes(q);
    });
  }, [rows, query, lowOnly]);

  const totals = useMemo(() => {
    const units = rows.reduce((s, r) => s + (r.quantity || 0), 0);
    const low = rows.filter((r) => r.quantity <= r.low_stock_threshold).length;
    const out = rows.filter((r) => r.quantity === 0).length;
    const unavailable = rows.filter((r) => r.available === false).length;
    return { units, low, out, unavailable, skus: rows.length };
  }, [rows]);

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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Exact unit counts per product and dosage. Update the number when new stock arrives.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={busy}>Refresh</Button>
            <Button variant="hero" onClick={saveAll} disabled={busy}>Save all</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "SKUs tracked", value: totals.skus },
            { label: "Total units", value: totals.units },
            { label: "Low stock", value: totals.low },
            { label: "Out of stock", value: totals.out },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Input
            placeholder="Search product or dosage…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button variant={lowOnly ? "hero" : "outline"} size="sm" onClick={() => setLowOnly((v) => !v)}>
            Low stock only
          </Button>
          <span className="text-xs text-muted-foreground">{filtered.length} of {rows.length} shown</span>
        </div>

        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">Dosage</th>
                <th className="p-3 font-semibold">On hand</th>
                <th className="p-3 font-semibold">Low at</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const key = `${r.product_id}::${r.variant}`;
                const status = r.quantity === 0 ? "Out" : r.quantity <= r.low_stock_threshold ? "Low" : "In stock";
                return (
                  <tr key={key} className="border-t border-border">
                    <td className="p-3 font-medium">{r.product_name}</td>
                    <td className="p-3 text-muted-foreground">{r.variant || "—"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="px-2" onClick={() => setField(key, "quantity", Math.max(0, r.quantity - 10))}>−10</Button>
                        <Button size="sm" variant="outline" className="px-2" onClick={() => setField(key, "quantity", Math.max(0, r.quantity - 1))}>−</Button>
                        <Input
                          type="number"
                          min={0}
                          value={r.quantity}
                          onChange={(e) => setField(key, "quantity", Number(e.target.value))}
                          className="w-20 text-center"
                        />
                        <Button size="sm" variant="outline" className="px-2" onClick={() => setField(key, "quantity", r.quantity + 1)}>+</Button>
                        <Button size="sm" variant="outline" className="px-2" onClick={() => setField(key, "quantity", r.quantity + 10)}>+10</Button>
                      </div>

                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min={0}
                        value={r.low_stock_threshold}
                        onChange={(e) => setField(key, "low_stock_threshold", Number(e.target.value))}
                        className="w-16 text-center"
                      />
                    </td>
                    <td className="p-3">
                      {r.available === false ? (
                        <span className="text-destructive font-semibold">Unavailable</span>
                      ) : (
                        <span
                          className={
                            status === "Out"
                              ? "text-destructive font-semibold"
                              : status === "Low"
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          }
                        >
                          {status}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant={r.available === false ? "hero" : "outline"}
                          onClick={() => toggleAvailable(r)}
                        >
                          {r.available === false ? "Make available" : "Mark unavailable"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => saveRow(r)}>Save</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminInventory;
