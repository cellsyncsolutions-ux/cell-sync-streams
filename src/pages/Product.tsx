import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const fmt = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t } = useLanguage();
  const product = products.find((p) => p.id === id);

  const [variantLabel, setVariantLabel] = useState<string | undefined>(
    product?.variants?.[0]?.label
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setVariantLabel(product?.variants?.[0]?.label);
  }, [id, product]);

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
    const variant = product.variants?.find((v) => v.label === variantLabel);
    if (variant?.outOfStock) return;
    addItem(product, variant);
    toast.success(`${product.name}${variant ? ` – ${variant.label}` : ""} added to cart`);
  };

  const selectedVariant = product.variants?.find((v) => v.label === variantLabel);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOriginal = selectedVariant?.originalPrice ?? product.originalPrice;

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
              {displayOriginal ? (
                <>
                  <span className="text-muted-foreground line-through mr-3 text-xl">{fmt(displayOriginal)}</span>
                  <span className="text-primary font-extrabold text-3xl">{fmt(displayPrice)}</span>
                </>
              ) : (
                <span className="text-primary font-extrabold text-3xl">{fmt(displayPrice)}</span>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Dosage</label>
                <Select value={variantLabel} onValueChange={setVariantLabel}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((v) => (
                      <SelectItem key={v.label} value={v.label}>
                        {v.label} — {v.originalPrice ? <span className="text-muted-foreground line-through mr-1">{fmt(v.originalPrice)}</span> : null}{fmt(v.price)}{v.outOfStock ? " (Out of stock)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVariant?.outOfStock && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
                    Out of stock — this dosage is currently unavailable
                  </p>
                )}
              </div>
            )}

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

            <Button onClick={handleAdd} variant="hero" size="lg" className="w-full md:w-auto" disabled={selectedVariant?.outOfStock}>
              {selectedVariant?.outOfStock ? "Out of Stock" : t("product_add")}
            </Button>

            <div className="mt-6 rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Research Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href="https://peptide-res-73eea6b2.vibepreview.com" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="https://peptide-res-73eea6b2.vibepreview.com" target="_blank" rel="noopener noreferrer">
                    Research Information
                  </a>
                </Button>
                <Button asChild variant="hero" size="sm">
                  <a href="https://peptide-res-73eea6b2.vibepreview.com" target="_blank" rel="noopener noreferrer">
                    View Research Library
                  </a>
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground italic">
                Educational content is provided through an independent research resource. Products sold on this website are strictly for Research Use Only.
              </p>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card p-5 flex items-center gap-5">
              <div className="bg-white p-3 rounded-md shrink-0">
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : "https://cellssyncsolutions.com"}/product/${product.id}`}
                  size={112}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Scan to Share</h2>
                <p className="text-xs text-muted-foreground">
                  Scan this QR code with any phone camera to open this product page instantly.
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-6 leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground block mb-1">Intended Use:</strong>
                This product is supplied strictly for laboratory and in vitro research purposes by trained and
                qualified professionals. It is not approved for human or animal consumption and may not be used in
                the production of food, pharmaceuticals, medical devices, or cosmetic products.
              </p>
              <p>
                <strong className="text-foreground block mb-1">Disclaimer:</strong>
                These statements have not been reviewed or approved by the U.S. Food and Drug Administration (FDA).
                This material is not intended to diagnose, mitigate, treat, cure, or prevent any medical condition or
                disease. Users are responsible for ensuring all handling and applications comply with applicable
                institutional, local, and federal regulations.
              </p>
              <p>
                <strong className="text-foreground block mb-1">Terms of Sale:</strong>
                By placing an order with Cell Sync Solutions, the purchaser confirms they are a qualified researcher,
                laboratory, or authorized institution. All purchases are considered final. The buyer accepts full
                responsibility for the safe handling, proper use, and legal compliance associated with the product
                after delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Product;
