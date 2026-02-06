import { EmbeddedPage, buildEmbeddedPageMetadata } from "@/components/embedded-page";

const shopUrl = process.env.SHOP__URL ?? process.env.SHOP_URL ?? process.env.NEXT_PUBLIC_SHOP_URL;

const shopUrlEnvKeys = ["SHOP__URL", "SHOP_URL", "NEXT_PUBLIC_SHOP_URL"];

export const metadata = buildEmbeddedPageMetadata(
  "Shop",
  "Browse products inside the embedded shop experience.",
  "/shop"
);

export default function ShopPage() {
  return (
    <EmbeddedPage
      title="Shop"
      description="Browse and purchase products from this embedded shop view."
      url={shopUrl}
      missingEnvVarNames={shopUrlEnvKeys}
    />
  );
}
