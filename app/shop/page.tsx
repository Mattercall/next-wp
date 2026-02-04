import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";
import { formatDecimalPrice } from "@/lib/woocommerce-format";

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { s?: string };
}) {
  const products = await getProducts({ search: searchParams.s, perPage: 12 });
  const currency = process.env.NEXT_PUBLIC_WC_CURRENCY ?? "USD";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Shop</h1>
        <p className="text-sm text-muted-foreground">
          Browse our latest products and add them to your cart.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-muted/60 bg-muted/20 p-6 text-sm">
          No products found. Try adjusting your search or check back later.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-muted/50 bg-background p-4"
            >
              {product.images?.[0]?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="h-48 w-full rounded-xl bg-muted" />
              )}
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDecimalPrice(product.price, currency)}
                </p>
              </div>
              <Link
                href={`/product/${product.slug}`}
                className="text-sm font-semibold text-primary"
              >
                View product →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
