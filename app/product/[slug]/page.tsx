import Link from "next/link";
import { AddToCartForm } from "@/components/woocommerce/add-to-cart-form";
import {
  getProductById,
  getProductBySlug,
  getProductVariations,
} from "@/lib/woocommerce";
import { formatDecimalPrice } from "@/lib/woocommerce-format";

export const revalidate = 60;

function renderPrice({
  price,
  regular_price,
  sale_price,
  currency,
}: {
  price: string;
  regular_price: string;
  sale_price: string;
  currency: string;
}) {
  if (sale_price && sale_price !== regular_price) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold">
          {formatDecimalPrice(sale_price, currency)}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {formatDecimalPrice(regular_price, currency)}
        </span>
      </div>
    );
  }

  return (
    <span className="text-2xl font-semibold">
      {formatDecimalPrice(price, currency)}
    </span>
  );
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const slugParam = params.slug;
  const idMatch = slugParam.match(/^(\d+)(?:-|$)/);
  const slugFromParam = slugParam.replace(/^\d+-/, "");
  let product = null;

  if (idMatch) {
    try {
      product = await getProductById(Number(idMatch[1]));
    } catch (error) {
      console.warn("Failed to load product by id.", error);
    }
  }

  if (!product) {
    product = await getProductBySlug(slugFromParam);
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Try browsing our{" "}
          <Link href="/shop" className="text-primary">
            shop
          </Link>
          .
        </p>
      </main>
    );
  }

  const variations =
    product.type === "variable"
      ? await getProductVariations(product.id)
      : [];
  const currency = process.env.NEXT_PUBLIC_WC_CURRENCY ?? "USD";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-8">
        <nav className="text-xs text-muted-foreground">
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-muted/50 bg-muted">
              {product.images?.[0]?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-96 w-full" />
              )}
            </div>
            {product.images?.length > 1 ? (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-muted/50 bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            {product.description ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : null}
          </div>
          <aside className="flex flex-col gap-6 rounded-3xl border border-muted/50 bg-background p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Product details
              </p>
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              {renderPrice({
                price: product.price,
                regular_price: product.regular_price,
                sale_price: product.sale_price,
                currency,
              })}
              {product.short_description ? (
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              ) : null}
            </div>

            <div className="rounded-2xl border border-muted/50 bg-muted/10 p-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-semibold text-foreground">
                  {product.stock_status === "outofstock"
                    ? "Out of stock"
                    : "In stock"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Type</span>
                <span className="font-semibold text-foreground">
                  {product.type}
                </span>
              </div>
            </div>

            <AddToCartForm product={product} variations={variations} />

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Link href="/cart" className="font-semibold text-primary">
                View cart →
              </Link>
              <Link href="/checkout" className="font-semibold text-primary">
                Checkout →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
