import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;

const ProductCard = ({ p }: { p: Product }) => (
  <article className="group rounded-lg border border-border bg-card overflow-hidden shadow-card transition-smooth hover:-translate-y-1 hover:shadow-glow">
    <div className="relative aspect-square bg-secondary overflow-hidden">
      {p.sale && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          Sale!
        </span>
      )}
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        width={768}
        height={768}
        className="h-full w-full object-cover transition-smooth group-hover:scale-105"
      />
    </div>
    <div className="p-5 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{p.category}</p>
      <h3 className="font-semibold text-base mb-2 min-h-[3rem] leading-snug">{p.name}</h3>
      <div className="mb-4">
        {p.priceRange ? (
          <span className="text-primary font-bold text-lg">
            {fmt(p.priceRange[0])} – {fmt(p.priceRange[1])}
          </span>
        ) : p.originalPrice ? (
          <>
            <span className="text-muted-foreground line-through mr-2 text-sm">{fmt(p.originalPrice)}</span>
            <span className="text-primary font-bold text-lg">{fmt(p.price)}</span>
          </>
        ) : (
          <span className="text-primary font-bold text-lg">{fmt(p.price)}</span>
        )}
      </div>
      <Button variant={p.variants ? "outline" : "hero"} size="sm" className="w-full">
        {p.variants ? "Select Options" : "Add to Cart"}
      </Button>
    </div>
  </article>
);

export default ProductCard;