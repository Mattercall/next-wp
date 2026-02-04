import Link from "next/link";
import { AddToCartForm } from "@/components/woocommerce/add-to-cart-form";
import { getProductBySlug, getProductVariations } from "@/lib/woocommerce";
import { formatDecimalPrice } from "@/lib/woocommerce-format";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

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
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {product.images?.[0]?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              className="w-full rounded-3xl border border-muted/50 object-cover"
            />
          ) : (
            <div className="h-96 w-full rounded-3xl bg-muted" />
          )}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
        <aside className="rounded-3xl border border-muted/50 bg-background p-6">
          <p className="text-sm text-muted-foreground">Product</p>
          <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-lg font-semibold">
            {formatDecimalPrice(product.price, currency)}
          </p>
          <AddToCartForm product={product} variations={variations} />
          <Link href="/cart" className="mt-6 inline-flex text-sm font-semibold text-primary">
            Go to cart →
          </Link>
        </aside>
      </div>
    </main>
  );
}
