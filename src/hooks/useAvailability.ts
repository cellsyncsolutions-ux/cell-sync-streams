import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StockStatus = "available" | "out_of_stock" | "coming_soon";
export type AvailabilityMap = Record<string, boolean>;
export type StatusMap = Record<string, StockStatus>;

const key = (productId: string, variant: string) => `${productId}::${variant ?? ""}`;

/**
 * Loads product availability from inventory.
 * `map` -> boolean purchasable; `status` -> why it isn't purchasable.
 */
export const useAvailability = () => {
  const [map, setMap] = useState<AvailabilityMap>({});
  const [status, setStatus] = useState<StatusMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("product_inventory")
        .select("product_id, variant, available, quantity");
      if (!active) return;
      if (error) {
        console.error("Failed to load availability", error);
      } else if (data) {
        const nextMap: AvailabilityMap = {};
        const nextStatus: StatusMap = {};
        for (const row of data) {
          const k = key(row.product_id, row.variant ?? "");
          const flagged = row.available ?? true;
          const qty = row.quantity ?? 0;
          nextMap[k] = flagged && qty > 0;
          nextStatus[k] = !flagged ? "coming_soon" : qty > 0 ? "available" : "out_of_stock";
        }
        setMap(nextMap);
        setStatus(nextStatus);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { map, status, loading };
};

/** True unless every known inventory row for the product is unavailable. */
export const isProductAvailable = (
  map: AvailabilityMap,
  productId: string,
  variantLabels: string[]
): boolean => {
  const labels = variantLabels.length > 0 ? variantLabels : [""];
  const known = labels
    .map((l) => map[key(productId, l)])
    .filter((v) => v !== undefined);
  if (known.length === 0) return true;
  return known.some(Boolean);
};

export const isVariantAvailable = (
  map: AvailabilityMap,
  productId: string,
  variant: string
): boolean => map[key(productId, variant)] ?? true;

export const variantStatus = (
  status: StatusMap,
  productId: string,
  variant: string
): StockStatus => status[key(productId, variant)] ?? "available";

/**
 * Rolls variant statuses into one product-level status:
 * available wins, then out_of_stock, then coming_soon.
 */
export const productStatus = (
  status: StatusMap,
  productId: string,
  variantLabels: string[]
): StockStatus => {
  const labels = variantLabels.length > 0 ? variantLabels : [""];
  const known = labels
    .map((l) => status[key(productId, l)])
    .filter((v): v is StockStatus => v !== undefined);
  if (known.length === 0) return "available";
  if (known.includes("available")) return "available";
  if (known.includes("out_of_stock")) return "out_of_stock";
  return "coming_soon";
};
