"use client";

import { Menu, Search, ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const primaryButtonClass =
  "rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700";
const secondaryButtonClass =
  "rounded-full border border-blue-600 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50";

const posterSlides = [
  {
    title: "The Final Lap",
    meta: "Action • High Velocity",
    image:
      "https://www.apple.com/v/tv-home/o/images/overview/billboard/napoleon__x1909y0r6f2u_large.jpg",
  },
  {
    title: "Moonrise",
    meta: "Sci-Fi • Adventure",
    image:
      "https://www.apple.com/v/tv-home/o/images/overview/billboard/monarch__gplp8a65a8q6_large.jpg",
  },
  {
    title: "Echo Valley",
    meta: "Drama • Award Winner",
    image:
      "https://www.apple.com/v/tv-home/o/images/overview/billboard/the_morning_show__d0s7x04h7rqu_large.jpg",
  },
  {
    title: "Pulse",
    meta: "Thriller • Limited Series",
    image:
      "https://www.apple.com/v/tv-home/o/images/overview/billboard/shrinking__b2o0a7o7mymq_large.jpg",
  },
];

const serviceSlides = [
  {
    service: "Fitness+",
    cta: "Watch now",
    image:
      "https://www.apple.com/v/fitness-plus/aa/images/overview/hero/hero__cjlgwly5teq2_large.jpg",
  },
  {
    service: "Music",
    cta: "Listen now",
    image:
      "https://www.apple.com/v/music/s/images/overview/hero__cz2x9d8dzqa2_large.jpg",
  },
  {
    service: "Arcade",
    cta: "Play now",
    image:
      "https://www.apple.com/v/apple-arcade/a/images/overview/hero/hero__cw8t36n8ztu6_large.jpg",
  },
  {
    service: "TV+",
    cta: "Stream now",
    image:
      "https://www.apple.com/v/tv-home/o/images/overview/hero/hero__dvmk39xg1kqe_large.jpg",
  },
];

const promoTiles = [
  {
    title: "MacBook Air",
    description: ["Sky blue color.", "Sky high performance with M4."],
    image:
      "https://www.apple.com/v/macbook-air/x/images/overview/hero/hero_static__c9sislzzicq6_large.png",
    className: "bg-gradient-to-b from-[#e6f2ff] to-white",
  },
  {
    title: "iPad",
    description: [
      "Now with the speed of the A16 chip",
      "and double the starting storage.",
    ],
    image:
      "https://www.apple.com/v/ipad-11/c/images/overview/hero/hero__ecv967jz1y82_large.jpg",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "WATCH ULTRA 3",
    description: ["Personal beast."],
    image:
      "https://www.apple.com/v/apple-watch-ultra-3/b/images/overview/welcome/hero_endframe__e4ls9pihykya_large.jpg",
    className: "bg-black text-white",
    isDark: true,
  },
  {
    title: "AirPods Pro 3",
    description: [
      "The world’s best in-ear",
      "Active Noise Cancellation.",
    ],
    image:
      "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero__b0eal3mn03ua_large.jpg",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Trade In",
    description: [
      "Get up to $180–$650",
      "in credit when you trade in",
      "iPhone 13 or higher.",
    ],
    image:
      "https://www.apple.com/v/iphone/home/ch/images/overview/consider/getting_started__f98z0j9hm7m2_large.jpg",
    className: "bg-[#f5f5f7]",
    singleCta: "Get your estimate",
  },
  {
    title: "Card",
    description: ["Get up to 3% Daily Cash back", "with every purchase."],
    image:
      "https://www.apple.com/newsroom/images/product/apple-card/standard/Apple-Card-available-today-Apple-Card-082019_inline.jpg.large.jpg",
    className: "bg-[#f5f5f7]",
  },
];

const AppleLogo = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className={cn("h-4 w-4 fill-current", className)}
  >
    <path d="M16.2 2.4c-.9.1-2 .6-2.7 1.4-.7.8-1.2 1.9-1 3 1 .1 2.1-.5 2.8-1.3.7-.8 1.1-2 1-3.1ZM19.8 17.5c-.4.9-.9 1.7-1.6 2.5-1 1.2-2 2.4-3.7 2.4-1.7 0-2.1-1-4.1-1s-2.5 1-4.1 1c-1.6 0-2.7-1.1-3.7-2.3-2-2.3-3.6-6.5-1.5-9.4 1-1.4 2.7-2.3 4.6-2.3 1.7 0 3.3 1.1 4.1 1.1.8 0 2.7-1.3 4.6-1.1.8 0 3.1.3 4.6 2.2-0.1.1-2.7 1.6-2.6 4.7.1 3.8 3.4 5.1 3.5 5.2Z" />
  </svg>
);

const AppleTvLogo = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 56 24"
    className={cn("h-5 w-auto fill-white", className)}
  >
    <path d="M9.6 0c-.9.1-2 .6-2.7 1.4-.7.8-1.2 1.9-1 3 1 .1 2.1-.5 2.8-1.3.7-.8 1.1-2 1-3.1ZM13.2 15.4c-.4.9-.9 1.7-1.6 2.5-1 1.2-2 2.4-3.7 2.4-1.7 0-2.1-1-4.1-1s-2.5 1-4.1 1c-1.6 0-2.7-1.1-3.7-2.3-2-2.3-3.6-6.5-1.5-9.4C1.6 7.2 3.3 6.3 5.2 6.3c1.7 0 3.3 1.1 4.1 1.1.8 0 2.7-1.3 4.6-1.1.8 0 3.1.3 4.6 2.2-.1.1-2.7 1.6-2.6 4.7.1 3.8 3.4 5.1 3.5 5.2Z" />
    <path d="M32.7 7.2h-6.3v2.1h2.1v8.4h2.1V9.3h2.1V7.2Zm7.8 10.5c-1.8 0-3.3-1.5-3.3-3.5 0-2.1 1.4-3.5 3.3-3.5s3.3 1.4 3.3 3.5c0 2-1.5 3.5-3.3 3.5Zm0 1.9c3 0 5.4-2.2 5.4-5.4 0-3.2-2.4-5.4-5.4-5.4s-5.4 2.2-5.4 5.4c0 3.2 2.4 5.4 5.4 5.4ZM55.4 17.6h-5.9V7.2h2.1v8.4h3.8v2Z" />
  </svg>
);

export default function Home() {
  return (
    <main className="bg-white text-neutral-900">
      <div className="w-full border-b border-neutral-200 bg-white px-4 py-2 text-center text-xs text-[#6e6e73]">
        Save on iPhone with carrier deals and trade-in. Terms apply.
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-end px-4 py-2 text-[11px] text-neutral-600">
          <button className="flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5">
            Suomi
            <span className="text-[10px]">▾</span>
          </button>
          <span className="ml-2 rounded-full bg-neutral-900 px-3 py-0.5 text-[11px] text-white">
            Iida
          </span>
        </div>
        <div className="mx-auto flex h-11 max-w-[1100px] items-center justify-between px-4">
          <div className="flex items-center gap-4 lg:hidden">
            <button aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center lg:justify-start">
            <AppleLogo className="h-5 w-5" />
          </div>
          <nav className="hidden flex-1 items-center justify-center text-[13px] text-neutral-700 lg:flex">
            <ul className="flex items-center gap-6">
              {
                [
                  "Store",
                  "Mac",
                  "iPad",
                  "iPhone",
                  "Watch",
                  "Vision",
                  "AirPods",
                  "TV & Home",
                  "Entertainment",
                  "Accessories",
                  "Support",
                ].map((item) => (
                  <li key={item} className="transition hover:text-black">
                    {item}
                  </li>
                ))
              }
            </ul>
          </nav>
          <div className="flex flex-1 items-center justify-end gap-4 text-neutral-700">
            <button aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <button aria-label="Bag">
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 text-center">
          <AppleLogo className="h-6 w-6 text-black" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">
            Watch Series 11
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Turn resolutions into routines.
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Quit quitting your fitness goals.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Learn more</button>
            <button className={secondaryButtonClass}>Buy</button>
          </div>
          <img
            src="https://www.apple.com/v/apple-watch-series-11/c/images/overview/highlights/highlights_motivation__dqyf9xo8hjsm_large.jpg"
            alt="Apple Watch Series 11 lineup"
            className="mt-12 w-full max-w-4xl object-contain"
          />
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            iPhone
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Say hello to the latest generation of iPhone.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Learn more</button>
            <button className={secondaryButtonClass}>Shop iPhone</button>
          </div>
          <div className="mt-10 w-full max-w-4xl overflow-hidden">
            <img
              src="https://www.apple.com/v/iphone/home/ch/images/overview/consider/designed-to_last__c3hmkknr9scy_large.jpg"
              alt="iPhone lineup"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#cfe6f7] via-[#e7f2fb] to-white">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            iPad <span className="font-light italic text-sky-500">air</span>
          </h2>
          <p className="mt-3 text-base text-neutral-700">
            Now supercharged by the M3 chip.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Learn more</button>
            <button className={secondaryButtonClass}>Buy</button>
          </div>
          <img
            src="https://www.apple.com/v/ipad-air/af/images/overview/hero/hero_endframe__fvm22b45e5me_large.png"
            alt="iPad Air"
            className="mt-10 w-full max-w-3xl object-contain"
          />
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 px-4 md:grid-cols-2">
          {promoTiles.map((tile, index) => (
            <article
              key={tile.title}
              className={cn(
                "flex min-h-[520px] flex-col items-center justify-between overflow-hidden rounded-3xl px-6 pb-8 pt-10 text-center",
                tile.className
              )}
            >
              <div>
                {tile.title === "Trade In" || tile.title === "Card" ? (
                  <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold">
                    <AppleLogo
                      className={cn(
                        "h-4 w-4",
                        tile.isDark ? "text-white" : "text-black"
                      )}
                    />
                    <span>{tile.title}</span>
                  </div>
                ) : tile.title === "WATCH ULTRA 3" ? (
                  <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                    <AppleLogo className="h-4 w-4 text-white" />
                    <span>{tile.title}</span>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-neutral-900">
                    {tile.title}
                  </p>
                )}
                <div className={cn("mt-3 space-y-1", tile.isDark && "text-white")}>
                  {tile.description.map((line) => (
                    <p
                      key={line}
                      className={cn(
                        "text-sm",
                        tile.isDark ? "text-neutral-200" : "text-neutral-600"
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {tile.singleCta ? (
                    <button className={primaryButtonClass}>{tile.singleCta}</button>
                  ) : (
                    <>
                      <button className={primaryButtonClass}>Learn more</button>
                      <button className={secondaryButtonClass}>Buy</button>
                    </>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "mt-6 flex w-full flex-1 items-end justify-center",
                  index === 5 && "justify-end"
                )}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className={cn(
                    "max-h-[300px] w-auto object-contain",
                    index === 5 && "max-h-[240px]"
                  )}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white pb-20 pt-6">
        <div className="mx-auto max-w-[1100px] px-4">
          <h2 className="mb-10 text-center text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Endless entertainment.
          </h2>
          <Carousel opts={{ align: "center", loop: true }} className="w-full">
            <CarouselContent>
              {posterSlides.map((slide) => (
                <CarouselItem
                  key={slide.title}
                  className="pl-4 md:basis-4/5 lg:basis-2/3"
                >
                  <div className="relative h-[420px] overflow-hidden rounded-[28px]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex flex-col gap-3 text-white">
                      <AppleTvLogo />
                      <p className="text-lg font-semibold">{slide.title}</p>
                      <p className="text-xs text-neutral-200">{slide.meta}</p>
                      <button className="w-fit rounded-full bg-white/90 px-4 py-1 text-xs font-medium text-black">
                        Stream now
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <div className="mt-10">
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {serviceSlides.map((slide) => (
                  <CarouselItem
                    key={slide.service}
                    className="pl-4 sm:basis-1/2 lg:basis-1/4"
                  >
                    <div className="relative h-[220px] overflow-hidden rounded-2xl">
                      <img
                        src={slide.image}
                        alt={slide.service}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-semibold">Apple {slide.service}</p>
                        <button className="mt-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                          {slide.cta}
                        </button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="mt-4 flex items-center justify-center gap-2">
              {serviceSlides.map((slide) => (
                <span
                  key={slide.service}
                  className="h-1.5 w-1.5 rounded-full bg-neutral-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
