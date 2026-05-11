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
  { id: "igf-lr3", name: "IGF1-LR3", category: "Peptides", price: 95, image: vial,
    variants: [{ label: "1mg", price: 95 }] },
  { id: "tb-500", name: "TB-500", category: "Peptides", price: 60, priceRange: [60, 110], image: vial,
    variants: [{ label: "5mg", price: 60 }, { label: "10mg", price: 110 }] },
  { id: "mots-c", name: "MOTS-C", category: "Peptides", price: 70, image: vial,
    variants: [{ label: "10mg", price: 70 }] },
  { id: "w-blend", name: "W BLEND (BPC-157 + TB-500)", category: "Blends", price: 95, image: vial,
    variants: [{ label: "5mg/5mg", price: 95 }, { label: "10mg/10mg", price: 165 }] },
  { id: "ghk-cu", name: "GHK-Cu", category: "Peptides", price: 55, image: vial,
    variants: [{ label: "50mg", price: 55 }, { label: "100mg", price: 95 }] },
  { id: "selank", name: "SELANK", category: "Peptides", price: 50, image: vial,
    variants: [{ label: "10mg", price: 50 }] },
  { id: "tesamorelin", name: "TESAMORELIN", category: "Peptides", price: 90, image: vial,
    variants: [{ label: "10mg", price: 90 }] },
  { id: "semax", name: "SEMAX", category: "Peptides", price: 50, image: vial,
    variants: [{ label: "10mg", price: 50 }] },
  { id: "ss-31", name: "SS-31", category: "Peptides", price: 110, image: vial,
    variants: [{ label: "10mg", price: 110 }] },
  { id: "nad", name: "NAD+", category: "Peptides", price: 85, image: vial,
    variants: [{ label: "500mg", price: 85 }] },
  { id: "mt-1", name: "MT-1 (Melanotan 1)", category: "Peptides", price: 55, image: vial,
    variants: [{ label: "10mg", price: 55 }] },
  { id: "mt-2", name: "MT-2 (Melanotan 2)", category: "Peptides", price: 50, image: vial,
    variants: [{ label: "10mg", price: 50 }] },
  { id: "ipa", name: "IPA (Ipamorelin)", category: "Peptides", price: 45, image: vial,
    variants: [{ label: "5mg", price: 45 }, { label: "10mg", price: 80 }] },
];