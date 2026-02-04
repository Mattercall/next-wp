"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/woocommerce/cart-context";
import type { WooProduct, WooVariation } from "@/lib/woocommerce";

function formatVariationLabel(variation: WooVariation) {
  if (!variation.attributes?.length) {
    return `Variation #${variation.id}`;
  }
  return variation.attributes
    .map((attr) => `${attr.name}: ${attr.option ?? ""}`)
    .join(" / ");
}

export function AddToCartForm({
  product,
  variations,
}: {
  product: WooProduct;
  variations: WooVariation[];
}) {
  const { addItem, isLoading, error } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(
    variations[0]?.id ?? null
  );
  const [message, setMessage] = useState<string | null>(null);

  const isVariable = product.type === "variable";

  const availableVariations = useMemo(
    () =>
      variations.filter(
        (variation) => variation.stock_status !== "outofstock"
      ),
    [variations]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (isVariable && !selectedVariationId) {
      setMessage("Please select a variation.");
      return;
    }

    await addItem({
      id: product.id,
      quantity,
      variationId: isVariable ? selectedVariationId ?? undefined : undefined,
    });

    setMessage("Added to cart.");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {isVariable ? (
        <label className="flex flex-col gap-2 text-sm font-medium">
          Choose an option
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedVariationId ?? ""}
            onChange={(event) =>
              setSelectedVariationId(Number(event.target.value))
            }
          >
            {availableVariations.map((variation) => (
              <option key={variation.id} value={variation.id}>
                {formatVariationLabel(variation)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="flex flex-col gap-2 text-sm font-medium">
        Quantity
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
        disabled={isLoading || product.stock_status === "outofstock"}
      >
        {product.stock_status === "outofstock"
          ? "Out of stock"
          : isLoading
            ? "Adding..."
            : "Add to cart"}
      </button>

      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
