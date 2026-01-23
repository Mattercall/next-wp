"use client";

import * as React from "react";
import Link from "next/link";

import {
  primaryButtonClass,
  secondaryButtonClass,
  heroHeadingClass,
} from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: "coursera plus",
    heading: "Ends soon! Next level skills. New Year savings.",
    body: "Unlock 10,000+ programs with your subscription and earn as many career certificates as you like.",
    cta: {
      label: "Save 50% on Coursera Plus →",
      href: "/posts",
      className: primaryButtonClass,
    },
    className: "bg-primary text-primary-foreground",
  },
  {
    eyebrow: "coursera for teams",
    heading: "Train your team in top skills and join 3,700+ teams worldwide",
    body: "",
    cta: {
      label: "Save 50% on Teams →",
      href: "/posts",
      className: secondaryButtonClass,
    },
    className: "bg-primary/90 text-primary-foreground",
  },
];

export function HeroCarousel() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const scrollToIndex = React.useCallback((index: number) => {
    const node = trackRef.current;
    if (!node) return;
    const slides = Array.from(node.children) as HTMLElement[];
    const target = slides[index];
    if (!target) return;
    node.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const handleScroll = () => {
      const slides = Array.from(node.children) as HTMLElement[];
      const current = slides.findIndex((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const viewportCenter = node.scrollLeft + node.clientWidth / 2;
        if (index === slides.length - 1) {
          return viewportCenter >= slideCenter;
        }
        return Math.abs(slideCenter - viewportCenter) < slide.clientWidth / 2;
      });
      if (current >= 0) {
        setActiveIndex(current);
      }
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      node.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section aria-label="Hero promotions" className="space-y-4">
      <div
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            scrollToIndex(Math.min(activeIndex + 1, slides.length - 1));
          }
          if (event.key === "ArrowLeft") {
            scrollToIndex(Math.max(activeIndex - 1, 0));
          }
        }}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.heading}
            className={cn(
              "min-w-[85%] snap-start rounded-3xl border p-6 shadow-sm sm:min-w-[70%] lg:min-w-0 lg:flex-1",
              slide.className
            )}
            aria-label={`Promotion ${index + 1}`}
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/80">
                  {slide.eyebrow}
                </p>
                <h2
                  className={cn(
                    heroHeadingClass,
                    "text-balance text-primary-foreground"
                  )}
                >
                  {slide.heading}
                </h2>
                {slide.body && (
                  <p className="text-lg text-primary-foreground/80">
                    {slide.body}
                  </p>
                )}
              </div>
              <div>
                <Link className={slide.cta.className} href={slide.cta.href}>
                  {slide.cta.label}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.heading}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-2 w-2 rounded-full transition",
              index === activeIndex
                ? "bg-primary"
                : "bg-muted-foreground/40"
            )}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
