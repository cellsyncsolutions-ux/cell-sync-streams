import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;

const ProductCard = ({ p }: { p: Product }) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const catLabel =
    p.category === "Peptides" ? t("cat_peptides") :
    p.category === "Blends" ? t("cat_blends") :
    p.category === "Capsules" ? t("cat_capsules") : p.category;
  const handleAdd = () => {
    if (p.variants && p.variants.length > 0) return;
    addItem(p);
    toast.success(`${p.name} added to cart`);
  };
  return (
  <article className="group rounded-lg border border-border bg-card overflow-hidden shadow-card transition-smooth hover:-translate-y-1 hover:shadow-glow">
    <Link to={`/product/${p.id}`} className="relative aspect-square bg-secondary overflow-hidden block">
      {p.sale && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          {t("product_sale")}
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
    </Link>
    <div className="p-5 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{catLabel}</p>
      <Link to={`/product/${p.id}`} className="block hover:text-primary transition-smooth">
        <h3 className="font-semibold text-base mb-2 min-h-[3rem] leading-snug">{p.name}</h3>
      </Link>
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
      {p.variants && p.variants.length > 0 ? (
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/product/${p.id}`}>{t("product_select")}</Link>
        </Button>
      ) : (
        <Button onClick={handleAdd} variant="hero" size="sm" className="w-full">
          {t("product_add")}
        </Button>
      )}
    </div>
  </article>
  );
};

export default ProductCard;