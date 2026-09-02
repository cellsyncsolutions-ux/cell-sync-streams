import {
  GROUND_ADVANTAGE_RATES,
  PRIORITY_RATES,
  PRIORITY_EXPRESS_RATES,
  ZIP3_ZONES,
  type RateRow,
} from "@/data/uspsRates";

export const FREE_SHIPPING_THRESHOLD = 200;

/** Flat estimated package weight: vials are light, every order fits the base tier. */
export const DEFAULT_PACKAGE_WEIGHT_LBS = 0.75;

export type ShippingMethodId = "ground" | "priority" | "express";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  eta: string;
  rates: RateRow[];
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "ground", name: "USPS Ground Advantage", eta: "2-5 business days", rates: GROUND_ADVANTAGE_RATES },
  { id: "priority", name: "USPS Priority Mail", eta: "1-3 business days", rates: PRIORITY_RATES },
  { id: "express", name: "USPS Priority Mail Express", eta: "1-2 days, guaranteed", rates: PRIORITY_EXPRESS_RATES },
];

/** USPS zone for a destination ZIP, measured from origin 53121. Falls back to zone 8. */
export function zoneForZip(postalCode: string): number {
  const zip3 = (postalCode || "").replace(/\D/g, "").slice(0, 3);
  if (zip3.length < 3) return 0; // unknown
  return ZIP3_ZONES[zip3] ?? 8;
}

function rateFor(rates: RateRow[], weightLbs: number, zone: number): number | null {
  if (zone < 1 || zone > 9) return null;
  const row = rates.find(([maxW]) => weightLbs <= maxW) ?? rates[rates.length - 1];
  const price = row?.[1]?.[zone - 1];
  return typeof price === "number" ? price : null;
}

export interface ShippingQuote {
  id: ShippingMethodId;
  name: string;
  eta: string;
  price: number;
  free: boolean;
}

/**
 * Quotes every service for a destination ZIP.
 * Returns an empty list when the ZIP isn't recognized (US domestic only).
 */
export function getShippingQuotes(
  postalCode: string,
  orderValue: number,
  weightLbs = DEFAULT_PACKAGE_WEIGHT_LBS
): ShippingQuote[] {
  const zone = zoneForZip(postalCode);
  if (!zone) return [];
  const free = orderValue >= FREE_SHIPPING_THRESHOLD;
  return SHIPPING_METHODS.flatMap((m) => {
    const price = rateFor(m.rates, weightLbs, zone);
    if (price === null) return [];
    // Free shipping promo applies to the economy service only.
    const isFree = free && m.id === "ground";
    return [{ id: m.id, name: m.name, eta: m.eta, price: isFree ? 0 : price, free: isFree }];
  });
}
