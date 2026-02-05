"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/woocommerce/cart-context";
import { formatStorePrice } from "@/lib/woocommerce-format";

interface PaymentMethod {
  id: string;
  title: string;
  description?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartKey, isLoading, error, clearCart } = useCart();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingOptions = useMemo(() => {
    if (!cart?.shipping_rates?.length) {
      return [] as Array<{ id: string; name: string; price: string }>;
    }

    return cart.shipping_rates.flatMap((pkg) =>
      pkg.shipping_rates.map((rate) => ({
        id: rate.rate_id,
        name: rate.name,
        price: rate.price,
      }))
    );
  }, [cart]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      const response = await fetch("/api/woo/payment-methods");
      const data = await response.json();
      if (response.ok) {
        setPaymentMethods(data.payment_methods || []);
        if (data.payment_methods?.length) {
          setSelectedPayment(data.payment_methods[0].id);
        }
      }
    };

    loadPaymentMethods();
  }, []);

  useEffect(() => {
    if (!selectedShipping && shippingOptions.length) {
      setSelectedShipping(shippingOptions[0].id);
    }
  }, [selectedShipping, shippingOptions]);

  if (!cart) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your checkout...
        </p>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your cart is empty. Add items before checking out.
        </p>
      </main>
    );
  }

  const currencyCode = cart.totals?.currency_code;
  const minorUnit = cart.totals?.currency_minor_unit ?? 2;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const billing_address = {
      first_name: String(formData.get("first_name") || ""),
      last_name: String(formData.get("last_name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address_1: String(formData.get("address_1") || ""),
      address_2: String(formData.get("address_2") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      postcode: String(formData.get("postcode") || ""),
      country: String(formData.get("country") || ""),
    };

    const shipping_address = billing_address;

    try {
      const response = await fetch("/api/woo/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billing_address,
          shipping_address,
          payment_method: selectedPayment || "cod",
          payment_method_title:
            paymentMethods.find((method) => method.id === selectedPayment)
              ?.title || "Cash on delivery",
          shipping_method: selectedShipping ? [selectedShipping] : undefined,
          cartKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to place order");
      }

      await clearCart();

      router.push(`/order-received?orderId=${data.order_id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your order with secure payment options.
          </p>
          {error ? (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-6 rounded-3xl border border-muted/60 bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Billing details</h2>
              <span className="text-xs text-muted-foreground">
                * Required fields
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                First name*
                <input
                  name="first_name"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Last name*
                <input
                  name="last_name"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              Email*
              <input
                type="email"
                name="email"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Phone
              <input
                name="phone"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Address*
              <input
                name="address_1"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Address line 2
              <input
                name="address_2"
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                City*
                <input
                  name="city"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                State*
                <input
                  name="state"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Postal code*
                <input
                  name="postcode"
                  required
                  className="rounded-md border border-input bg-background px-3 py-2"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              Country*
              <input
                name="country"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Order notes
              <textarea
                name="order_notes"
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2"
                placeholder="Notes about your order, e.g. special delivery instructions."
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-muted/60 bg-muted/10 p-6">
            <h2 className="text-lg font-semibold">Your order</h2>
            <div className="space-y-3 text-sm">
              {cart.items.map((item) => (
                <div key={item.key} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatStorePrice(
                      item.totals.total,
                      item.totals.currency_code,
                      item.totals.currency_minor_unit
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-muted/60 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatStorePrice(
                    cart.totals.total_items,
                    currencyCode,
                    minorUnit
                  )}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">
                  {formatStorePrice(
                    cart.totals.total_shipping,
                    currencyCode,
                    minorUnit
                  )}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">
                  {formatStorePrice(
                    cart.totals.total_tax,
                    currencyCode,
                    minorUnit
                  )}
                </span>
              </div>
              <div className="mt-4 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>
                  {formatStorePrice(
                    cart.totals.total_price,
                    currencyCode,
                    minorUnit
                  )}
                </span>
              </div>
            </div>

            {shippingOptions.length ? (
              <label className="flex flex-col gap-2 text-sm">
                Shipping method
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedShipping}
                  onChange={(event) => setSelectedShipping(event.target.value)}
                >
                  {shippingOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} ({
                        formatStorePrice(option.price, currencyCode, minorUnit)
                      })
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="flex flex-col gap-2 text-sm">
              Payment method
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedPayment}
                onChange={(event) => setSelectedPayment(event.target.value)}
                required
              >
                {paymentMethods.length === 0 ? (
                  <option value="cod">Cash on delivery</option>
                ) : (
                  paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.title}
                    </option>
                  ))
                )}
              </select>
            </label>

            {submitError ? (
              <p className="text-sm text-destructive">{submitError}</p>
            ) : null}

            <p className="text-xs text-muted-foreground">
              By placing your order, you agree to our terms and confirm that all
              details are correct.
            </p>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}
