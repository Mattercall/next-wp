"use client";

import Link from "next/link";
import { useCart } from "@/components/woocommerce/cart-context";
import { formatStorePrice } from "@/lib/woocommerce-format";

export default function CartPage() {
  const { cart, isLoading, error, updateItem, removeItem } = useCart();

  if (!cart) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Cart</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your cart...
        </p>
      </main>
    );
  }

  const currencyCode = cart.totals?.currency_code;
  const minorUnit = cart.totals?.currency_minor_unit ?? 2;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      {error ? (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      ) : null}

      {cart.items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-muted/60 bg-muted/20 p-6 text-sm">
          Your cart is empty.{' '}
          <Link href="/shop" className="text-primary">
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-4 rounded-2xl border border-muted/60 bg-background p-4 sm:flex-row sm:items-center"
              >
                {item.images?.[0]?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.images[0].src}
                    alt={item.images[0].alt || item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-muted" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  {item.variation?.length ? (
                    <p className="text-xs text-muted-foreground">
                      {item.variation
                        .map((entry) => `${entry.attribute}: ${entry.value}`)
                        .join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatStorePrice(
                      item.prices.price,
                      item.prices.currency_code,
                      item.prices.currency_minor_unit
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    onChange={(event) =>
                      updateItem({
                        key: item.key,
                        quantity: Number(event.target.value),
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-xs font-semibold text-destructive"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm font-semibold">
                  {formatStorePrice(
                    item.totals.total,
                    item.totals.currency_code,
                    item.totals.currency_minor_unit
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-muted/60 bg-muted/20 p-6 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatStorePrice(
                  cart.totals.total_items,
                  currencyCode,
                  minorUnit
                )}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold">
                {formatStorePrice(
                  cart.totals.total_shipping,
                  currencyCode,
                  minorUnit
                )}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Tax</span>
              <span className="font-semibold">
                {formatStorePrice(
                  cart.totals.total_tax,
                  currencyCode,
                  minorUnit
                )}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>
                {formatStorePrice(
                  cart.totals.total_price,
                  currencyCode,
                  minorUnit
                )}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
