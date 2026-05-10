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
  variants?: boolean;
};

export const products: Product[] = [
  { id: "glp-3", name: "GLP-3 RT", category: "Peptides", price: 99, priceRange: [80, 300], sale: true, image: vial, variants: true },
  { id: "glow-70", name: "GLOW 70mg (GHK-Cu/BPC157/TB500)", category: "Blends", price: 115, originalPrice: 125, sale: true, image: vial },
  { id: "cjc-ipa", name: "CJC 1295 No DAC + Ipamorelin 5mg/5mg", category: "Blends", price: 85, originalPrice: 89, sale: true, image: vial },
  { id: "bpc-157", name: "BPC-157", category: "Peptides", price: 45, priceRange: [45, 64], image: vial, variants: true },
  { id: "cjc-nodac", name: "CJC 1295 No DAC 5mg", category: "Peptides", price: 45, image: vial },
  { id: "cjc-wdac", name: "CJC 1295 W/DAC 5mg", category: "Peptides", price: 66, originalPrice: 80, sale: true, image: vial },
  { id: "klow", name: "KLOW 80mg (KPV/GHK-Cu/BPC157/TB500)", category: "Blends", price: 117.5, originalPrice: 120, sale: true, image: vial },
  { id: "enclomiphene", name: "Enclomiphene", category: "Capsules", price: 89, originalPrice: 115, sale: true, image: vial },
  { id: "hcg", name: "HCG 5000iu", category: "Peptides", price: 75, image: vial },
  { id: "mk-677", name: "MK-677", category: "Capsules", price: 99, originalPrice: 115, sale: true, image: vial },
  { id: "rad-140", name: "RAD-140", category: "Capsules", price: 79, originalPrice: 89, sale: true, image: vial, variants: true },
  { id: "igf-lr3", name: "IGF1-LR3 1mg", category: "Peptides", price: 95, originalPrice: 105, sale: true, image: vial },
];