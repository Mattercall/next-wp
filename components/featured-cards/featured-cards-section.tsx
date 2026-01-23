import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeaturedCardsSectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function FeaturedCardsSection({
  title = "Featured Cards",
  children,
  className,
}: FeaturedCardsSectionProps) {
  return (
    <div
      className={cn(
        "mt-8 w-full rounded-[28px] bg-gradient-to-r from-[#d8f0ff] via-[#d8f5f2] to-[#c8f2ea] p-6 text-left sm:mx-auto sm:w-[calc(5*260px+4*24px+2*32px)] sm:p-8",
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
