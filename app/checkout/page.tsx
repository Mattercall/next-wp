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
  const [selectedShipping, setSelectedShipping] = useState<Record<number, string>>(
    {}
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingOptions = useMemo(() => {
    if (!cart?.shipping_rates?.length) {
      return [] as Array<{
        packageId: number;
        rates: Array<{ id: string; name: string; price: string }>;
      }>;
    }

    return cart.shipping_rates.map((pkg) => ({
      packageId: pkg.package_id,
      rates: pkg.shipping_rates.map((rate) => ({
        id: rate.rate_id,
        name: rate.name,
        price: rate.price,
      })),
    }));
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
    if (!shippingOptions.length) {
      return;
    }

    setSelectedShipping((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const pkg of shippingOptions) {
        if (!next[pkg.packageId] && pkg.rates.length) {
          next[pkg.packageId] = pkg.rates[0].id;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [shippingOptions]);

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
      const shipping_method = shippingOptions.length
        ? shippingOptions
            .map((pkg) => selectedShipping[pkg.packageId])
            .filter(Boolean)
        : [];

      if (
        shippingOptions.length &&
        shipping_method.length !== shippingOptions.length
      ) {
        setSubmitError("Please select a shipping method for each package.");
        setIsSubmitting(false);
        return;
      }

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
          shipping_method: shipping_method.length ? shipping_method : undefined,
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
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      {error ? (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-2">
        <section className="space-y-6 rounded-2xl border border-muted/60 bg-background p-6">
          <h2 className="text-lg font-semibold">Billing details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              First name
              <input
                name="first_name"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Last name
              <input
                name="last_name"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Email
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
            Address
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
              City
              <input
                name="city"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              State
              <input
                name="state"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Postal code
              <input
                name="postcode"
                required
                className="rounded-md border border-input bg-background px-3 py-2"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Country
            <input
              name="country"
              required
              className="rounded-md border border-input bg-background px-3 py-2"
            />
          </label>
        </section>

        <section className="space-y-6 rounded-2xl border border-muted/60 bg-muted/10 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
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
            <div className="space-y-3 text-sm">
              <p className="font-medium">Shipping method</p>
              {shippingOptions.map((pkg, index) => (
                <label
                  key={pkg.packageId}
                  className="flex flex-col gap-2 text-sm"
                >
                  Package {index + 1}
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedShipping[pkg.packageId] || ""}
                    onChange={(event) =>
                      setSelectedShipping((prev) => ({
                        ...prev,
                        [pkg.packageId]: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a shipping method
                    </option>
                    {pkg.rates.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} (
                        {formatStorePrice(option.price, currencyCode, minorUnit)}
                        )
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
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

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </section>
      </form>
    </main>
  );
}
