import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = ["All", "Peptides", "Blends", "Capsules"];

const Shop = () => {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");

  let list = products.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <section id="shop" className="py-16 bg-secondary/40">
      <div className="container">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Home / Shop</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Shop</h2>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 bg-card"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Categories</h3>
              <ul className="space-y-1.5">
                {categories.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => setCat(c)}
                      className={`text-sm w-full text-left px-3 py-2 rounded transition-smooth ${
                        cat === c ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-card text-muted-foreground"
                      }`}
                    >
                      {c} <span className="opacity-60">({c === "All" ? products.length : products.filter((p) => p.category === c).length})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Status</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="px-3">● In stock</li>
                <li className="px-3">○ Out of stock</li>
              </ul>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
              <span>Showing {list.length} of {products.length} results</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-card border border-border rounded px-3 py-1.5 text-sm"
              >
                <option value="default">Default sorting</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;