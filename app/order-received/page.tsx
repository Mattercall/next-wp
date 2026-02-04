import Link from "next/link";
import { getOrder } from "@/lib/woocommerce";
import { formatDecimalPrice } from "@/lib/woocommerce-format";

export const dynamic = "force-dynamic";

export default async function OrderReceivedPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Order confirmation</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We couldn't find an order. Please check your confirmation email.
        </p>
        <Link href="/shop" className="mt-6 inline-flex text-sm text-primary">
          Back to shop →
        </Link>
      </main>
    );
  }

  const order = await getOrder(orderId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Thank you for your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your order #{order.id} is {order.status}.
      </p>

      <div className="mt-6 rounded-2xl border border-muted/60 bg-background p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          {order.line_items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold">
                {formatDecimalPrice(item.total, order.currency)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-muted/60 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold">
              {formatDecimalPrice(order.shipping_total, order.currency)}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Tax</span>
            <span className="font-semibold">
              {formatDecimalPrice(order.total_tax, order.currency)}
            </span>
          </div>
          <div className="mt-4 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatDecimalPrice(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      <Link href="/shop" className="mt-6 inline-flex text-sm text-primary">
        Continue shopping →
      </Link>
    </main>
  );
}
