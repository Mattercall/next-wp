import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";
import { formatDecimalPrice } from "@/lib/woocommerce-format";

export const revalidate = 60;

function formatProductPrice(price: string, currency: string) {
  if (!price) {
    return "";
  }
  return formatDecimalPrice(price, currency);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { s?: string };
}) {
  const products = await getProducts({ search: searchParams.s, perPage: 12 });
  const currency = process.env.NEXT_PUBLIC_WC_CURRENCY ?? "USD";
  const searchValue = searchParams.s ?? "";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="flex flex-col gap-4 rounded-3xl border border-muted/60 bg-muted/10 p-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            WooCommerce Store
          </p>
          <h1 className="text-4xl font-semibold">Shop</h1>
          <p className="text-sm text-muted-foreground">
            Browse the latest products, explore categories, and add your
            favorites to the cart.
          </p>
        </div>
        <form action="/shop" className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="s"
            defaultValue={searchValue}
            placeholder="Search products..."
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            {products.length} product{products.length === 1 ? "" : "s"}
          </span>
          {searchValue ? (
            <span className="rounded-full border border-muted/60 bg-background px-3 py-1">
              Searching for “{searchValue}”
            </span>
          ) : null}
        </div>
      </section>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-muted/60 bg-muted/20 p-6 text-sm">
          No products found. Try adjusting your search or check back later.
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-muted/50 bg-background"
            >
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                {product.images?.[0]?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {product.name}
                  </h2>
                  <p className="text-sm font-semibold">
                    {formatProductPrice(product.price, currency)}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded-full border border-muted/60 px-3 py-1">
                    {product.type === "variable"
                      ? "Select options"
                      : "In stock"}
                  </span>
                  <Link
                    href={`/product/${
                      product.slug
                        ? `${product.id}-${product.slug}`
                        : String(product.id)
                    }`}
                    className="text-sm font-semibold text-primary"
                  >
                    View product →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
