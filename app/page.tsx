"use client";

import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FeaturedCard,
  FeaturedCardsRow,
} from "@/components/featured-cards/featured-cards";
import { FeaturedCardsSection } from "@/components/featured-cards/featured-cards-section";
import { cn } from "@/lib/utils";
import {
  primaryButtonClass,
  secondaryButtonClass,
  heroEyebrowClass,
  heroHeadingClass,
  heroBodyClass,
} from "@/components/marketing/cta-styles";

const posterSlides = [
  {
    title: "Velocity Growth Playbook",
    meta: "Paid Media • Conversion Scale",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Shopfront Redefined",
    meta: "Ecommerce • UX Design",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Automation Engine",
    meta: "AI Workflow • Ops Efficiency",
    image:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Authority Link Network",
    meta: "SEO • Backlinks",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
  },
];

const promoTiles = [
  {
    title: "SEO Backlinks",
    description: [
      "Dominate search with high-authority placements",
      "that push rankings, traffic, and trust.",
    ],
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    className: "bg-gradient-to-b from-[#eff6ff] to-white",
  },
  {
    title: "AI Automation",
    description: [
      "Replace manual work with smart AI flows",
      "that close deals, answer customers, and scale.",
    ],
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f7ff]",
  },
  {
    title: "Ecommerce Web Design",
    description: ["Storefronts built to convert and retain."],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#0f172a] text-white",
    isDark: true,
  },
  {
    title: "Facebook Ads",
    description: [
      "Full-funnel campaigns that turn attention",
      "into revenue at scale.",
    ],
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Google Ads",
    description: [
      "Precision search campaigns",
      "that capture demand and lower CAC.",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
    singleCta: "Request a strategy call",
  },
  {
    title: "Growth Strategy",
    description: [
      "Unified messaging, creative, and analytics",
      "that unlock predictable growth.",
    ],
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
  },
];

const featuredCards = [
  {
    title: "Enterprise SEO Backlinks",
    provider: "Link Authority Team",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Black_circle.svg",
    metaLabel: "High-Authority Placement",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI Automation Systems",
    provider: "Automation Lab",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Logo.min.svg",
    metaLabel: "Workflow Acceleration",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ecommerce Experience Design",
    provider: "Conversion Studio",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Font_Awesome_5_solid_store.svg",
    metaLabel: "Conversion Architecture",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    isVideo: true,
  },
  {
    title: "Facebook & Instagram Ads",
    provider: "Paid Social Squad",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    metaLabel: "Paid Social Mastery",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Google Search Ads",
    provider: "Performance Team",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    metaLabel: "Demand Capture",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
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
        Precision marketing for brands that want unstoppable growth.
      </div>

      <section>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center px-4 py-16 text-center">
          <AppleLogo className="h-6 w-6 text-black" />
          <p className={cn("mt-3", heroEyebrowClass)}>
            Growth Marketing Company
          </p>
          <h1 className={cn("mt-4", heroHeadingClass)}>
            Sell more with relentless, revenue-first marketing.
          </h1>
          <p className={cn("mt-2", heroBodyClass)}>
            SEO backlinks, AI automation, ecommerce web design, and high-impact
            Facebook + Google ads built to scale.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Book a growth call</button>
            <button className={secondaryButtonClass}>View services</button>
          </div>
          <FeaturedCardsSection>
            <FeaturedCardsRow>
              {featuredCards.map((card) => (
                <FeaturedCard
                  key={card.title}
                  href="#"
                  className={cn(
                    card.isVideo && "order-first sm:order-none"
                  )}
                  media={
                    card.isVideo ? (
                      <video
                        src="https://alidrives.b-cdn.net/alibacklink-main.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controls={false}
                        className="h-full w-full rounded-t-[24px] object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full rounded-t-[24px] object-cover"
                      />
                    )
                  }
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.providerLogo}
                      alt={`${card.provider} logo`}
                      className="h-5 w-5 rounded-sm object-contain"
                    />
                    <span className="line-clamp-1">{card.provider}</span>
                  </div>
                  <h4 className="mt-3 line-clamp-2 text-sm font-semibold text-neutral-900">
                    {card.title}
                  </h4>
                  <p className="mt-4 text-xs text-neutral-500">{card.metaLabel}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-neutral-600">
                    <Star className="h-3 w-3 fill-current text-neutral-900" />
                    <span>{card.rating}</span>
                  </div>
                </FeaturedCard>
              ))}
            </FeaturedCardsRow>
          </FeaturedCardsSection>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            SEO Backlinks that build authority fast
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Get premium placements on real, trusted sites that move rankings
            and keep compounding traffic.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Get backlink plan</button>
            <button className={secondaryButtonClass}>See case studies</button>
          </div>
          <div className="mt-8 w-full max-w-4xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1400&q=80"
              alt="SEO growth analytics"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#cfe6f7] via-[#e7f2fb] to-white">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-16 text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            AI automation that never sleeps
          </h2>
          <p className="mt-3 text-base text-neutral-700">
            Automate lead capture, follow-ups, and reporting with intelligent
            workflows tailored to your stack.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Build my workflow</button>
            <button className={secondaryButtonClass}>See automation demos</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1400&q=80"
            alt="AI automation visualization"
            className="mt-8 w-full max-w-3xl object-contain"
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
                <p
                  className={cn(
                    "text-lg font-semibold",
                    tile.isDark ? "text-white" : "text-neutral-900"
                  )}
                >
                  {tile.title}
                </p>
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
                      <button className={secondaryButtonClass}>Get started</button>
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
            Proof that performance marketing wins.
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
                        View results
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

        </div>
      </section>
    </main>
  );
}
