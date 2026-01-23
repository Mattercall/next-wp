import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeaturedCardProps = {
  href: string;
  media: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function FeaturedCard({
  href,
  media,
  children,
  className,
  contentClassName,
}: FeaturedCardProps) {
  return (
    <a href={href} className={cn("group shrink-0 snap-start", className)}>
      <Card className="h-full w-[82vw] max-w-[260px] overflow-hidden border border-neutral-200/70 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:w-[260px]">
        <div className="h-[150px] w-full overflow-hidden">{media}</div>
        <CardContent className={cn("p-4", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </a>
  );
}

type FeaturedCardsRowProps = {
  children: ReactNode;
  className?: string;
};

export function FeaturedCardsRow({ children, className }: FeaturedCardsRowProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory scroll-smooth touch-pan-x [-webkit-overflow-scrolling:touch] sm:gap-6 sm:overflow-visible sm:snap-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
