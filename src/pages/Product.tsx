import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-3xl font-extrabold mb-3">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/#shop" className="text-primary hover:underline">← Back to shop</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const catLabel =
    product.category === "Peptides" ? t("cat_peptides") :
    product.category === "Blends" ? t("cat_blends") :
    product.category === "Capsules" ? t("cat_capsules") : product.category;

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-smooth"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative rounded-2xl overflow-hidden bg-secondary shadow-card aspect-square">
            {product.sale && (
              <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                {t("product_sale")}
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">{catLabel}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">{product.name}</h1>

            <div className="mb-6">
              {product.priceRange ? (
                <span className="text-primary font-extrabold text-3xl">
                  {fmt(product.priceRange[0])} – {fmt(product.priceRange[1])}
                </span>
              ) : product.originalPrice ? (
                <>
                  <span className="text-muted-foreground line-through mr-3 text-xl">{fmt(product.originalPrice)}</span>
                  <span className="text-primary font-extrabold text-3xl">{fmt(product.price)}</span>
                </>
              ) : (
                <span className="text-primary font-extrabold text-3xl">{fmt(product.price)}</span>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-2 text-sm text-muted-foreground">
              <p>
                Research-grade <strong className="text-foreground">{product.name}</strong> synthesized in ISO-certified
                facilities. Independently tested for purity, identity, and stability.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>≥99% verified purity</li>
                <li>Third-party COA available</li>
                <li>Cold-chain shipping in 24 hours</li>
              </ul>
            </div>

            <Button onClick={handleAdd} variant="hero" size="lg" className="w-full md:w-auto">
              {t("product_add")}
            </Button>

            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              For laboratory research use only. Not for human consumption. All products are intended
              exclusively for in vitro testing and laboratory experimentation.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Product;