import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Award, Package, User as UserIcon, LogOut } from "lucide-react";
import logo from "@/assets/logo-mark.png";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  points: number;
};

type OrderItem = {
  id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  points_earned: number;
  order_items: OrderItem[];
};

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile(prof as Profile | null);
      const { data: ords } = await supabase
        .from("orders")
        .select("id, created_at, total, status, points_earned, order_items(id, product_name, variant, quantity, unit_price)")
        .order("created_at", { ascending: false });
      setOrders((ords as unknown as Order[]) || []);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    const form = new FormData(e.currentTarget);
    setSaving(true);
    const updates = {
      full_name: String(form.get("full_name") || "").slice(0, 100),
      phone: String(form.get("phone") || "").slice(0, 30),
      address_line1: String(form.get("address_line1") || "").slice(0, 200),
      address_line2: String(form.get("address_line2") || "").slice(0, 200),
      city: String(form.get("city") || "").slice(0, 100),
      state: String(form.get("state") || "").slice(0, 100),
      postal_code: String(form.get("postal_code") || "").slice(0, 20),
      country: String(form.get("country") || "").slice(0, 100),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
    setProfile({ ...profile, ...updates });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user || !profile) {
    return <main className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-navy text-navy-foreground">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Cell Sync Solutions" className="h-10 w-10" />
            <span className="font-extrabold text-primary">CELL SYNC SOLUTIONS</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">Welcome back, {profile.full_name || "researcher"}</h1>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-lg p-6 flex items-center gap-4">
            <Award className="h-10 w-10" />
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Reward points</p>
              <p className="text-3xl font-extrabold">{profile.points}</p>
              <p className="text-xs opacity-80">1 pt per $1 spent</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><UserIcon className="h-4 w-4" /> Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-10 text-center text-muted-foreground">
                No orders yet. <Link to="/#shop" className="text-primary hover:underline">Browse the catalog</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-card border border-border rounded-lg p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
                        <p className="font-mono text-sm">#{o.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Date</p>
                        <p className="text-sm">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                        <span className="inline-block text-xs font-bold uppercase bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{o.status}</span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Points earned</p>
                        <p className="font-bold text-primary">+{o.points_earned}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                        <p className="font-extrabold text-lg">${Number(o.total).toFixed(2)}</p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {o.order_items?.map((it) => (
                        <li key={it.id} className="flex justify-between">
                          <span>{it.product_name} × {it.quantity}</span>
                          <span className="text-muted-foreground">${(Number(it.unit_price) * it.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile.full_name || ""} maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={profile.phone || ""} maxLength={30} />
                </div>
              </div>
              <div>
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input id="address_line1" name="address_line1" defaultValue={profile.address_line1 || ""} maxLength={200} />
              </div>
              <div>
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input id="address_line2" name="address_line2" defaultValue={profile.address_line2 || ""} maxLength={200} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue={profile.city || ""} maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" defaultValue={profile.state || ""} maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" name="postal_code" defaultValue={profile.postal_code || ""} maxLength={20} />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue={profile.country || ""} maxLength={100} />
              </div>
              <Button type="submit" variant="hero" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Account;