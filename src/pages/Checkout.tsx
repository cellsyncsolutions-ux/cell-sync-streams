import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo-mark.png";
import { Trash2 } from "lucide-react";

const Checkout = () => {
  const { user, loading } = useAuth();
  const { items, total, updateQty, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/checkout", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setShipping({
          name: data.full_name || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          country: data.country || "",
        });
      }
    });
  }, [user]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    if (!shipping.name || !shipping.address_line1 || !shipping.city || !shipping.country) {
      toast.error("Please complete shipping details");
      return;
    }
    setSubmitting(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "pending",
        shipping_name: shipping.name,
        shipping_address_line1: shipping.address_line1,
        shipping_address_line2: shipping.address_line2,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_postal_code: shipping.postal_code,
        shipping_country: shipping.country,
      })
      .select()
      .single();

    if (error || !order) {
      setSubmitting(false);
      toast.error(error?.message || "Could not place order");
      return;
    }

    const itemRows = items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    setSubmitting(false);
    if (itemsError) {
      toast.error(itemsError.message);
      return;
    }
    clear();
    toast.success(`Order placed! You earned ${order.points_earned} points`);
    navigate("/account");
  };

  if (loading || !user) {
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
        </div>
      </header>

      <div className="container py-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Checkout</h1>

        {items.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-10 text-center text-muted-foreground">
            Your cart is empty. <Link to="/#shop" className="text-primary hover:underline">Continue shopping</Link>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-bold mb-4 text-lg">Shipping</h2>
                <div className="space-y-3">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} maxLength={100} required />
                  </div>
                  <div>
                    <Label>Address Line 1</Label>
                    <Input value={shipping.address_line1} onChange={(e) => setShipping({ ...shipping, address_line1: e.target.value })} maxLength={200} required />
                  </div>
                  <div>
                    <Label>Address Line 2</Label>
                    <Input value={shipping.address_line2} onChange={(e) => setShipping({ ...shipping, address_line2: e.target.value })} maxLength={200} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>City</Label>
                      <Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} maxLength={100} required />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} maxLength={100} />
                    </div>
                    <div>
                      <Label>Postal</Label>
                      <Input value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} maxLength={20} />
                    </div>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} maxLength={100} required />
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-card border border-border rounded-lg p-6 h-fit">
              <h2 className="font-bold mb-4 text-lg">Order Summary</h2>
              <ul className="space-y-3 mb-4">
                {items.map((i) => (
                  <li key={i.productId} className="flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="h-14 w-14 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{i.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button type="button" onClick={() => updateQty(i.productId, i.quantity - 1)} className="h-6 w-6 rounded border border-border text-sm">-</button>
                        <span className="text-sm w-6 text-center">{i.quantity}</span>
                        <button type="button" onClick={() => updateQty(i.productId, i.quantity + 1)} className="h-6 w-6 rounded border border-border text-sm">+</button>
                        <button type="button" onClick={() => removeItem(i.productId)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <span className="text-sm font-bold">${(i.price * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4 space-y-1 mb-4">
                <div className="flex justify-between font-extrabold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-primary">You'll earn {Math.floor(total)} points</p>
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Placing order..." : "Place Order"}
              </Button>
              <p className="text-xs text-muted-foreground mt-3 text-center">Demo checkout — no payment is collected.</p>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
};

export default Checkout;