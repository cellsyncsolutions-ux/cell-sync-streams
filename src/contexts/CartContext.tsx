import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (p: Product, variant?: { label: string; price: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "css_cart_v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (p: Product, variant?: { label: string; price: number }) =>
    setItems((prev) => {
      const id = variant ? `${p.id}::${variant.label}` : p.id;
      const name = variant ? `${p.name} – ${variant.label}` : p.name;
      const price = variant ? variant.price : p.price;
      const found = prev.find((i) => i.productId === id);
      if (found) return prev.map((i) => (i.productId === id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { productId: id, name, price, image: p.image, quantity: 1 }];
    });

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.productId !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.productId !== id) : prev.map((i) => (i.productId === id ? { ...i, quantity: qty } : i))
    );
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count }}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};