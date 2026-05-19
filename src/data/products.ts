import vial from "@/assets/vial.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  priceRange?: [number, number];
  sale?: boolean;
  image: string;
  variants?: { label: string; price: number; outOfStock?: boolean }[];
};

export const products: Product[] = [
  { id: "glp-3", name: "GLP-3 RT", category: "Peptides", price: 60, priceRange: [60, 295], image: vial,
    variants: [{ label: "5mg", price: 60 }, { label: "10mg", price: 100 }, { label: "20mg", price: 175 }, { label: "30mg", price: 200 }, { label: "60mg", price: 295 }] },
  { id: "glow-70", name: "GLOW (GHK-Cu/BPC157/TB500)", category: "Blends", price: 120, image: vial,
    variants: [{ label: "70mg", price: 120 }] },
  { id: "cjc-ipa", name: "CJC 1295 No DAC + Ipamorelin", category: "Blends", price: 85, image: vial,
    variants: [{ label: "5mg/5mg", price: 85 }] },
  { id: "bpc-157", name: "BPC-157", category: "Peptides", price: 45, priceRange: [45, 65], image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 65 }] },
  { id: "cjc-nodac", name: "CJC 1295 No DAC", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 80 }] },
  { id: "cjc-wdac", name: "CJC 1295 W/DAC", category: "Peptides", price: 65, image: vial,
    variants: [{ label: "5mg", price: 65 }] },
  { id: "klow", name: "KLOW (KPV/GHK-Cu/BPC157/TB500)", category: "Blends", price: 115, image: vial,
    variants: [{ label: "80mg", price: 115 }] },
  { id: "igf-lr3", name: "IGF1-LR3", category: "Peptides", price: 95, image: vial,
    variants: [{ label: "1mg", price: 95 }] },
  { id: "tb-500", name: "TB-500", category: "Peptides", price: 40, priceRange: [40, 65], image: vial,
    variants: [{ label: "5mg", price: 40 }, { label: "10mg", price: 65 }] },
  { id: "mots-c", name: "MOTS-C", category: "Peptides", price: 55, priceRange: [55, 85], image: vial,
    variants: [{ label: "10mg", price: 55 }, { label: "20mg", price: 85 }] },
  { id: "w-blend", name: "W BLEND (BPC-157 + TB-500)", category: "Blends", price: 75, priceRange: [75, 130], image: vial,
    variants: [{ label: "5mg/5mg", price: 75 }, { label: "10mg/10mg", price: 130 }] },
  { id: "ghk-cu", name: "GHK-Cu", category: "Peptides", price: 35, priceRange: [35, 50], image: vial,
    variants: [{ label: "50mg", price: 35 }, { label: "100mg", price: 50 }] },
  { id: "selank", name: "SELANK", category: "Peptides", price: 35, priceRange: [35, 50], image: vial,
    variants: [{ label: "5mg", price: 35 }, { label: "10mg", price: 50 }] },
  { id: "tesamorelin", name: "TESAMORELIN", category: "Peptides", price: 60, priceRange: [60, 160], image: vial,
    variants: [{ label: "5mg", price: 60 }, { label: "10mg", price: 90 }, { label: "20mg", price: 160 }] },
  { id: "semax", name: "SEMAX", category: "Peptides", price: 40, image: vial,
    variants: [{ label: "5mg", price: 40 }] },
  { id: "ss-31", name: "SS-31", category: "Peptides", price: 95, priceRange: [95, 400], image: vial,
    variants: [{ label: "10mg", price: 95 }, { label: "50mg", price: 400, outOfStock: true }] },
  { id: "nad", name: "NAD+", category: "Peptides", price: 70, priceRange: [70, 120], image: vial,
    variants: [{ label: "500mg", price: 70 }, { label: "1000mg", price: 120 }] },
  { id: "mt-1", name: "MT-1 (Melanotan 1)", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "10mg", price: 45 }] },
  { id: "mt-2", name: "MT-2 (Melanotan 2)", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "10mg", price: 45 }] },
  { id: "ipa", name: "IPA (Ipamorelin)", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 80 }] },
];