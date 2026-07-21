import vialAsset from "@/assets/retatrutide-vial.png.asset.json";
import glp3RtAsset from "@/assets/glp3-rt-vial.png.asset.json";
import glowAsset from "@/assets/glow-70mg-vial.jpg.asset.json";
import bpc157Asset from "@/assets/bpc-157-vial.jpg.asset.json";
import cjcNoDacAsset from "@/assets/cjc-1295-no-dac-vial.jpg.asset.json";
import klowAsset from "@/assets/klow-70mg-vial.jpg.asset.json";
import igf1Lr3Asset from "@/assets/igf1-lr3-vial.jpg.asset.json";
import motsCAsset from "@/assets/mots-c-vial.jpg.asset.json";
const vial = vialAsset.url;
const glp3RtVial = glp3RtAsset.url;
const glowVial = glowAsset.url;
const bpc157Vial = bpc157Asset.url;
const cjcNoDacVial = cjcNoDacAsset.url;
const klowVial = klowAsset.url;
const igf1Lr3Vial = igf1Lr3Asset.url;
const motsCVial = motsCAsset.url;

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  priceRange?: [number, number];
  sale?: boolean;
  image: string;
  variants?: { label: string; price: number; originalPrice?: number; outOfStock?: boolean }[];
};

export const products: Product[] = [
  { id: "glp-3", name: "GLP-3 RT", category: "Peptides", price: 60, priceRange: [60, 295], image: glp3RtVial,
    sale: true,
    variants: [{ label: "5mg", price: 60, originalPrice: 67 }, { label: "10mg", price: 100, originalPrice: 112 }, { label: "20mg", price: 175, originalPrice: 195 }, { label: "30mg", price: 200, originalPrice: 223 }, { label: "60mg", price: 295, originalPrice: 328, outOfStock: true }] },
  { id: "glow-70", name: "GLOW (GHK-Cu/BPC157/TB500)", category: "Blends", price: 120, image: glowVial,
    sale: true,
    variants: [{ label: "70mg", price: 120, originalPrice: 134 }] },
  { id: "cjc-ipa", name: "CJC 1295 No DAC + Ipamorelin", category: "Blends", price: 85, image: vial,
    sale: true,
    variants: [{ label: "5mg/5mg", price: 85, originalPrice: 95 }] },
  { id: "bpc-157", name: "BPC-157", category: "Peptides", price: 45, priceRange: [45, 65], image: bpc157Vial,
    sale: true,
    variants: [{ label: "5mg", price: 45, originalPrice: 50 }, { label: "10mg", price: 65, originalPrice: 73 }] },
  { id: "cjc-nodac", name: "CJC 1295 No DAC", category: "Peptides", price: 45, image: cjcNoDacVial,
    sale: true,
    variants: [{ label: "5mg", price: 45, originalPrice: 50 }, { label: "10mg", price: 80, originalPrice: 89, outOfStock: true }] },
  { id: "cjc-wdac", name: "CJC 1295 W/DAC", category: "Peptides", price: 65, image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 65, originalPrice: 73 }] },
  { id: "klow", name: "KLOW (KPV/GHK-Cu/BPC157/TB500)", category: "Blends", price: 115, image: klowVial,
    sale: true,
    variants: [{ label: "80mg", price: 115, originalPrice: 128 }] },
  { id: "igf-lr3", name: "IGF1-LR3", category: "Peptides", price: 95, image: igf1Lr3Vial,
    sale: true,
    variants: [{ label: "1mg", price: 95, originalPrice: 106 }] },
  { id: "tb-500", name: "TB-500", category: "Peptides", price: 40, priceRange: [40, 65], image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 40, originalPrice: 45 }, { label: "10mg", price: 65, originalPrice: 73, outOfStock: true }] },
  { id: "mots-c", name: "MOTS-C", category: "Peptides", price: 55, priceRange: [55, 85], image: motsCVial,
    sale: true,
    variants: [{ label: "10mg", price: 55, originalPrice: 62 }, { label: "20mg", price: 85, originalPrice: 95, outOfStock: true }] },
  { id: "w-blend", name: "W BLEND (BPC-157 + TB-500)", category: "Blends", price: 75, priceRange: [75, 130], image: vial,
    sale: true,
    variants: [{ label: "5mg/5mg", price: 75, originalPrice: 84 }, { label: "10mg/10mg", price: 130, originalPrice: 145 }] },
  { id: "ghk-cu", name: "GHK-Cu", category: "Peptides", price: 35, priceRange: [35, 50], image: vial,
    sale: true,
    variants: [{ label: "50mg", price: 35, originalPrice: 39 }, { label: "100mg", price: 50, originalPrice: 56 }] },
  { id: "selank", name: "SELANK", category: "Peptides", price: 35, priceRange: [35, 50], image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 35, originalPrice: 39 }, { label: "10mg", price: 50, originalPrice: 56 }] },
  { id: "tesamorelin", name: "TESAMORELIN", category: "Peptides", price: 60, priceRange: [60, 160], image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 60, originalPrice: 67 }, { label: "10mg", price: 90, originalPrice: 100 }, { label: "20mg", price: 160, originalPrice: 178, outOfStock: true }] },
  { id: "semax", name: "SEMAX", category: "Peptides", price: 40, image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 40, originalPrice: 45 }] },
  { id: "ss-31", name: "SS-31", category: "Peptides", price: 95, priceRange: [95, 400], image: vial,
    sale: true,
    variants: [{ label: "10mg", price: 95, originalPrice: 106 }, { label: "50mg", price: 400, originalPrice: 445, outOfStock: true }] },
  { id: "nad", name: "NAD+", category: "Peptides", price: 70, priceRange: [70, 120], image: vial,
    sale: true,
    variants: [{ label: "500mg", price: 70, originalPrice: 78 }, { label: "1000mg", price: 120, originalPrice: 134 }] },
  { id: "mt-1", name: "MT-1 (Melanotan 1)", category: "Peptides", price: 45, image: vial,
    sale: true,
    variants: [{ label: "10mg", price: 45, originalPrice: 50 }] },
  { id: "mt-2", name: "MT-2 (Melanotan 2)", category: "Peptides", price: 45, image: vial,
    sale: true,
    variants: [{ label: "10mg", price: 45, originalPrice: 50 }] },
  { id: "ipa", name: "IPA (Ipamorelin)", category: "Peptides", price: 45, image: vial,
    sale: true,
    variants: [{ label: "5mg", price: 45, originalPrice: 50 }, { label: "10mg", price: 80, originalPrice: 89, outOfStock: true }] },
];
