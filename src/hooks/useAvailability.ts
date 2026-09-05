import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AvailabilityMap = Record<string, boolean>;

const key = (productId: string, variant: string) => `${productId}::${variant ?? ""}`;

/**
 * Loads product availability flags from inventory.
 * Returns a map of `${product_id}::${variant}` -> available.
 */
export const useAvailability = () => {
  const [map, setMap] = useState<AvailabilityMap>({});
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
        const next: AvailabilityMap = {};
        for (const row of data) {
          next[key(row.product_id, row.variant ?? "")] =
            (row.available ?? true) && (row.quantity ?? 0) > 0;
        }
        setMap(next);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { map, loading };
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
