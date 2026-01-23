"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CategoryProduct = {
  name: string;
  price: string;
  link?: string;
};

type ProductSidebarProps = {
  products: CategoryProduct[];
};

export default function ProductSidebar({ products }: ProductSidebarProps) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const startNowLink = useMemo(() => {
    const selectedLink = products[selectedProductIndex]?.link?.trim();
    if (selectedLink) {
      return selectedLink;
    }

    return products.find((product) => product.link?.trim())?.link?.trim() ?? "";
  }, [products, selectedProductIndex]);

  return (
    <Card className="not-prose pointer-events-auto sticky top-[calc(6rem+2rem)] w-full rounded-2xl border border-border/60 bg-background shadow-[0_1px_0_rgba(255,255,255,0.7),0_18px_50px_-30px_rgba(15,23,42,0.35),0_0_40px_rgba(59,130,246,0.2)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              For Business Shark
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Here, I focus on a range of items and features that we use in life
              without them.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-border/70 px-2 py-1 text-xs text-muted-foreground"
          >
            •••
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            Choose a plan to get started
          </p>
          <div className="space-y-2">
            {products.map((product, index) => {
              const isSelected = index === selectedProductIndex;

              return (
                <label
                  key={`${product.name}-${index}`}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm",
                    isSelected && "bg-muted/40 text-foreground",
                  )}
                  onClick={() => setSelectedProductIndex(index)}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="plan"
                      checked={isSelected}
                      onChange={() => setSelectedProductIndex(index)}
                      className="h-4 w-4 accent-foreground"
                    />
                    {product.name}
                  </span>
                  <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-xs font-semibold text-foreground">
                    {product.price}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Taxes</span>
            <span>$32</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-foreground">
            <span>Total amount</span>
            <span>$1</span>
          </div>
        </div>

        {startNowLink ? (
          <Button asChild className="w-full rounded-full">
            <a href={startNowLink}>Start Now</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
