import { Star } from "lucide-react";

import { FeaturedCard, FeaturedCardsRow } from "@/components/featured-cards/featured-cards";
import { cn } from "@/lib/utils";

type ProductCard = {
  name: string;
  price: string;
  image: string;
  link: string;
};

type ProductCardsStripProps = {
  products: ProductCard[];
  className?: string;
  rowClassName?: string;
};

export function ProductCardsStrip({
  products,
  className,
  rowClassName,
}: ProductCardsStripProps) {
  if (products.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <FeaturedCardsRow className={rowClassName}>
        {products.map((product) => (
          <FeaturedCard
            key={`${product.name}-${product.link}`}
            href={product.link}
            media={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full rounded-t-[24px] object-cover"
              />
            }
          >
            <h4 className="line-clamp-2 text-sm font-semibold text-neutral-900">
              {product.name}
            </h4>
            <p className="mt-2 text-xs text-neutral-500">{product.price}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-neutral-600">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${product.name}-star-${index}`}
                  className="h-3 w-3 fill-current text-neutral-900"
                />
              ))}
            </div>
          </FeaturedCard>
        ))}
      </FeaturedCardsRow>
    </div>
  );
}
