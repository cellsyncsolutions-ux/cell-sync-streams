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
  variants?: { label: string; price: number }[];
};

export const products: Product[] = [
  { id: "glp-3", name: "GLP-3 RT", category: "Peptides", price: 60, priceRange: [60, 295], image: vial,
    variants: [{ label: "5mg", price: 60 }, { label: "10mg", price: 100 }, { label: "20mg", price: 175 }, { label: "30mg", price: 200 }, { label: "60mg", price: 295 }] },
  { id: "glow-70", name: "GLOW (GHK-Cu/BPC157/TB500)", category: "Blends", price: 120, image: vial,
    variants: [{ label: "70mg", price: 120 }] },
  { id: "cjc-ipa", name: "CJC 1295 No DAC + Ipamorelin", category: "Blends", price: 85, image: vial,
    variants: [{ label: "5mg/5mg", price: 85 }, { label: "10mg/10mg", price: 160 }] },
  { id: "bpc-157", name: "BPC-157", category: "Peptides", price: 45, priceRange: [45, 65], image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 65 }] },
  { id: "cjc-nodac", name: "CJC 1295 No DAC", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 80 }] },
  { id: "cjc-wdac", name: "CJC 1295 W/DAC", category: "Peptides", price: 65, image: vial,
    variants: [{ label: "5mg", price: 65 }] },
  { id: "klow", name: "KLOW (KPV/GHK-Cu/BPC157/TB500)", category: "Blends", price: 115, image: vial,
    variants: [{ label: "80mg", price: 115 }] },
  { id: "hcg", name: "HCG", category: "Peptides", price: 75, image: vial,
    variants: [{ label: "5000iu", price: 75 }, { label: "10000iu", price: 140 }] },
  { id: "igf-lr3", name: "IGF1-LR3", category: "Peptides", price: 95, image: vial,
    variants: [{ label: "1mg", price: 95 }, { label: "2mg", price: 170 }] },
];