"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
};

type CarouselProps = {
  opts?: Record<string, never>;
  plugins?: unknown;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    React.useEffect(() => {
      if (!carouselRef.current) {
        return;
      }

      const updateScrollState = () => {
        const node = carouselRef.current;
        if (!node) {
          return;
        }
        if (orientation === "horizontal") {
          setCanScrollPrev(node.scrollLeft > 0);
          setCanScrollNext(
            node.scrollLeft + node.clientWidth < node.scrollWidth - 1
          );
        } else {
          setCanScrollPrev(node.scrollTop > 0);
          setCanScrollNext(
            node.scrollTop + node.clientHeight < node.scrollHeight - 1
          );
        }
      };

      updateScrollState();
      const node = carouselRef.current;
      node?.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);

      return () => {
        node?.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }, [orientation]);

    const scrollByAmount = () => {
      const node = carouselRef.current;
      if (!node) {
        return 0;
      }

      return orientation === "horizontal" ? node.clientWidth : node.clientHeight;
    };

    const scrollPrev = () => {
      const node = carouselRef.current;
      if (!node) {
        return;
      }
      const amount = scrollByAmount();
      node.scrollBy({
        left: orientation === "horizontal" ? -amount : 0,
        top: orientation === "vertical" ? -amount : 0,
        behavior: "smooth",
      });
    };

    const scrollNext = () => {
      const node = carouselRef.current;
      if (!node) {
        return;
      }
      const amount = scrollByAmount();
      node.scrollBy({
        left: orientation === "horizontal" ? amount : 0,
        top: orientation === "vertical" ? amount : 0,
        behavior: "smooth",
      });
    };

    React.useEffect(() => {
      setApi?.({ scrollPrev, scrollNext });
    }, [scrollPrev, scrollNext, setApi]);

    void opts;
    void plugins;

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className={cn(
        "overflow-auto scroll-smooth",
        orientation === "horizontal"
          ? "flex w-full snap-x snap-mandatory"
          : "flex h-full flex-col snap-y snap-mandatory",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full snap-center",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute -left-6 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full",
        orientation === "vertical" && "-top-6 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute -right-6 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full",
        orientation === "vertical" && "-bottom-6 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
