import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Award, Gift, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";

const POINTS_PER_DOLLAR = 100; // 100 pts = $1 off

const TIERS = [
  { points: 500, label: "$5 off" },
  { points: 1000, label: "$10 off" },
  { points: 2500, label: "$25 off" },
  { points: 5000, label: "$50 off" },
];

interface OrderRow {
  id: string;
  created_at: string;
  total: number;
  status: string;
  points_earned: number;
  points_redeemed: number;
  points_reversed: boolean;
}

const money = (n: number) => `$${n.toFixed(2)}`;
const date = (s: string) =>
  new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Rewards = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { items } = useCart();
  const [points, setPoints] = useState(0);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/rewards", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const [{ data: profile }, { data: orderRows }] = await Promise.all([
        supabase.from("profiles").select("points").eq("id", user.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id, created_at, total, status, points_earned, points_redeemed, points_reversed")
          .order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      setPoints(profile?.points ?? 0);
      setOrders((orderRows as OrderRow[]) ?? []);
      setBusy(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const lifetimeEarned = useMemo(
    () => orders.reduce((s, o) => s + (o.points_reversed ? 0 : Number(o.points_earned || 0)), 0),
    [orders]
  );
  const lifetimeRedeemed = useMemo(
    () => orders.reduce((s, o) => s + (o.points_reversed ? 0 : Number(o.points_redeemed || 0)), 0),
    [orders]
  );

  const balanceValue = points / POINTS_PER_DOLLAR;
  const nextTier = TIERS.find((t) => t.points > points);
  const progress = nextTier ? Math.min(100, (points / nextTier.points) * 100) : 100;

  const redeem = (tierPoints: number) => {
    if (items.length === 0) {
      navigate("/#shop");
      return;
    }
    navigate(`/checkout?points=${tierPoints}`);
  };

  if (loading || busy) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center text-muted-foreground">Loading your rewards…</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 md:py-14">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Loyalty Program</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Rewards</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Earn 20 points per $1 spent—so every $5 earns you $1 off your next order. Spend $100 in one order
            and earn an extra $10 off.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="rounded-xl bg-navy text-navy-foreground p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Award className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Points balance</span>
            </div>
            <p className="text-4xl font-extrabold">{points.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-1">Worth {money(balanceValue)} off</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Lifetime earned</span>
            </div>
            <p className="text-4xl font-extrabold text-primary">{lifetimeEarned.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Gift className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Lifetime redeemed</span>
            </div>
            <p className="text-4xl font-extrabold">{lifetimeRedeemed.toLocaleString()}</p>
          </div>
        </section>

        {nextTier && (
          <section className="rounded-xl border border-border bg-card p-6 mb-10">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="font-semibold">
                {(nextTier.points - points).toLocaleString()} points to your next {nextTier.label} reward
              </span>
              <span className="text-muted-foreground">
                {points.toLocaleString()} / {nextTier.points.toLocaleString()}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-smooth" style={{ width: `${progress}%` }} />
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Redeem your points</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => {
              const unlocked = points >= tier.points;
              return (
                <div
                  key={tier.points}
                  className={`rounded-xl border p-5 text-center transition-smooth ${
                    unlocked ? "border-primary bg-card shadow-card" : "border-border bg-secondary/40 opacity-70"
                  }`}
                >
                  <Sparkles className={`h-5 w-5 mx-auto mb-2 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-2xl font-extrabold mb-1">{tier.label}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    {tier.points.toLocaleString()} points
                  </p>
                  <Button
                    variant={unlocked ? "hero" : "outline"}
                    size="sm"
                    className="w-full"
                    disabled={!unlocked}
                    onClick={() => redeem(tier.points)}
                  >
                    {unlocked ? (items.length === 0 ? "Start shopping" : "Apply at checkout") : "Locked"}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Rewards are applied to your order at checkout, where you can also redeem any custom amount of points.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Points activity</h2>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">You haven't earned any points yet.</p>
              <Button asChild variant="hero" size="sm">
                <Link to="/#shop">Browse products</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border last:border-0 p-4 text-sm"
                >
                  <div>
                    <p className="font-semibold">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {date(o.created_at)} · {money(Number(o.total))} · {o.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {Number(o.points_redeemed) > 0 && (
                      <span className={o.points_reversed ? "text-muted-foreground line-through" : "text-muted-foreground"}>
                        −{Number(o.points_redeemed).toLocaleString()} pts
                      </span>
                    )}
                    <span
                      className={`font-bold ${o.points_reversed ? "text-muted-foreground line-through" : "text-primary"}`}
                    >
                      +{Number(o.points_earned).toLocaleString()} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs text-muted-foreground mt-10 leading-relaxed">
          Points are earned on merchandise only and never on shipping charges. Canceled or refunded orders have
          their points reversed. Points have no cash value and cannot be transferred.
        </p>
      </div>
      <Footer />
    </main>
  );
};

export default Rewards;
