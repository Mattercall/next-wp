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
    title: "Shopify Revenue Lift",
    meta: "Paid Media + CRO • +18% conversion rate",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Local Pipeline Turnaround",
    meta: "Search + Automation • faster response times",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Automation Response Lift",
    meta: "AI Workflow • speed-to-lead under 5 min",
    image:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Authority Growth Sprint",
    meta: "SEO + Backlinks • ranking momentum",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
  },
];

const promoTiles = [
  {
    title: "Shopify Web Design",
    description: [
      "Conversion-first storefronts built to lift AOV,",
      "repeat orders, and mobile checkout completion.",
    ],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#0f172a] text-white",
    isDark: true,
  },
  {
    title: "Meta Ads",
    description: [
      "Creative, audiences, and landing flows",
      "that convert clicks into orders and bookings.",
    ],
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Google Ads + Local Search",
    description: [
      "Capture demand with high-intent search",
      "coverage that lowers CAC and CPL.",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Growth Strategy + Reporting",
    description: [
      "Unified offer, messaging, and analytics",
      "that keep growth predictable and measurable.",
    ],
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    className: "bg-[#f5f5f7]",
  },
];

const featuredCards = [
  {
    title: "Shopify Growth System",
    provider: "Atlas Growth Team",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Black_circle.svg",
    metaLabel: "Conversion Lift",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI Follow-Up Automation",
    provider: "Automation Lab",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Logo.min.svg",
    metaLabel: "Response Speed",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Checkout & CRO Sprint",
    provider: "Conversion Studio",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Font_Awesome_5_solid_store.svg",
    metaLabel: "AOV + CVR",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    isVideo: true,
  },
  {
    title: "Paid Social Growth Engine",
    provider: "Paid Media Desk",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    metaLabel: "ROAS Efficiency",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "High-Intent Search Capture",
    provider: "Performance Team",
    providerLogo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    metaLabel: "Lower CAC",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  },
];

const courseraQuickTiles = [
  {
    label: "Recover abandoned carts",
    icon: (
      <svg
        className="h-7 w-7 text-[#5960f2]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20h16" />
        <path d="M6 20V7l6-3 6 3v13" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    label: "Speed-to-lead follow-up",
    icon: (
      <svg
        className="h-7 w-7 text-[#5960f2]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6h16v12H4z" />
        <path d="M7 9h5" />
        <path d="M7 13h7" />
        <path d="M16 8l3 3-3 3" />
      </svg>
    ),
  },
  {
    label: "Review + referral boosters",
    icon: (
      <svg
        className="h-7 w-7 text-[#5960f2]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M7 10v5c0 2 10 2 10 0v-5" />
        <path d="M19 12v4" />
      </svg>
    ),
  },
];

const courseraPartnerChips = [
  { name: "Shopify", logo: "S", color: "text-[#95BF47]" },
  { name: "Meta", logo: "M", color: "text-[#1877F2]" },
  { name: "Google", logo: "G", color: "text-[#4285F4]" },
  { name: "Klaviyo", logo: "K", color: "text-[#1B1F23]" },
  { name: "Zapier", logo: "Z", color: "text-[#FF4F00]" },
  { name: "HubSpot", logo: "H", color: "text-[#FF7A59]" },
  { name: "GA4", logo: "GA", color: "text-[#F9AB00]" },
  { name: "Twilio", logo: "T", color: "text-[#E11D48]" },
  { name: "Stripe", logo: "S", color: "text-[#635BFF]" },
  { name: "Make", logo: "M", color: "text-[#0F172A]" },
];

const trendingCoursePanels = [
  {
    title: "Most requested →",
    items: [
      {
        provider: "Shopify + Meta",
        providerLogo: "S",
        title: "Abandoned Cart Recovery + Winback",
        meta: "Shopify Package • ★ 4.9",
      },
      {
        provider: "Local Growth",
        providerLogo: "L",
        title: "Lead-to-Booking Speed-to-Lead",
        meta: "Local System • ★ 4.8",
      },
      {
        provider: "Automation Lab",
        providerLogo: "A",
        title: "Missed Call Text-Back Workflow",
        meta: "Workflow Build • ★ 4.8",
      },
    ],
  },
  {
    title: "Shopify playbooks →",
    items: [
      {
        provider: "Ecommerce UX",
        providerLogo: "E",
        title: "Conversion-First PDP + Checkout",
        meta: "Design Sprint • ★ 4.9",
      },
      {
        provider: "Paid Search",
        providerLogo: "P",
        title: "High-Intent Search Capture",
        meta: "Campaign System • ★ 4.7",
      },
      {
        provider: "Backlink Authority",
        providerLogo: "B",
        title: "Authority Placement Program",
        meta: "SEO Engine • ★ 4.8",
      },
    ],
  },
  {
    title: "Local business playbooks →",
    items: [
      {
        provider: "CRM Sync",
        providerLogo: "AI",
        title: "Lead Qualification + CRM Sync",
        meta: "Automation Stack • ★ 4.8",
      },
      {
        provider: "Retention",
        providerLogo: "R",
        title: "Review Booster + Referral Loop",
        meta: "Retention Build • ★ 4.9",
      },
      {
        provider: "Local Teams",
        providerLogo: "LT",
        title: "Booking Confirmations + Reminders",
        meta: "Workflow System • ★ 4.8",
      },
    ],
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
        Done-for-you growth systems for Shopify brands and local businesses.
      </div>

      <section>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center px-4 py-16 text-center">
          <AppleLogo className="h-6 w-6 text-black" />
          <p className={cn("mt-3", heroEyebrowClass)}>
            Atlas Growth Systems
          </p>
          <h1 className={cn("mt-4", heroHeadingClass)}>
            More orders, bookings, and leads for Shopify brands and local teams.
          </h1>
          <p className={cn("mt-2", heroBodyClass)}>
            We build conversion-focused pages, run Facebook + Google ads, grow SEO
            and backlinks, and automate follow-up so you turn traffic into revenue
            without adding headcount.
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
            SEO backlinks that build trust, rankings, and qualified demand
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Secure placements on real sites to improve authority, lift rankings,
            and compound high-intent traffic for Shopify and local services.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className={primaryButtonClass}>Book a growth call</button>
            <button className={secondaryButtonClass}>View services</button>
          </div>
          <div className="mt-12 w-full">
            <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-4 rounded-full bg-[#F3F8FF] px-6 py-4 text-left">
              <p className="text-base font-semibold text-neutral-900">
                What backlink goal brings you here today?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: "Launch my authority growth plan" },
                  { label: "Improve rankings for core offers" },
                  { label: "Build trust with premium placements" },
                  { label: "Scale link building safely" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 rounded-full border border-[#dbe5f4] bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056D2] text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M5 12l5 5L19 7" />
                      </svg>
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-10 flex w-full max-w-[1075px] flex-col gap-6 rounded-[22px] bg-gradient-to-r from-[#C12BA8] via-[#7c3aed] to-[#2F80FF] px-8 py-8 md:flex-row md:items-center">
              <div className="flex w-full flex-col items-start gap-4 text-left md:w-[32%]">
                <h3 className="text-lg font-semibold text-white">
                  Benchmark authority before
                  <br />
                  you scale SEO
                </h3>
                <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0056D2]">
                  View services →
                </button>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:w-[68%]">
                {[
                  {
                    provider: "Authority Lab",
                    title: "Authority Foundations for Ranking Momentum",
                    type: "Backlink Blueprint",
                    rating: "★ 4.9",
                    imageClass:
                      "bg-gradient-to-br from-green-400 via-blue-500 to-yellow-400",
                    imageLabel: "SEO",
                  },
                  {
                    provider: "Shopify Growth",
                    title: "Authority Outreach + PR Placements",
                    type: "Growth Sprint",
                    rating: "★ 4.8",
                    imageClass:
                      "bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center",
                    imageLabel: "Shopify",
                    popular: true,
                  },
                  {
                    provider: "Local SEO",
                    title: "Local Authority + Map Pack Boost",
                    type: "Performance Kit",
                    rating: "★ 4.7",
                    imageClass: "bg-[#0b2b55]",
                    imageLabel: "Local",
                  },
                  {
                    provider: "Digital PR",
                    title: "Content-Led Link Velocity",
                    type: "Authority Specialization",
                    rating: "★ 4.6",
                    imageClass:
                      "bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center",
                    imageLabel: "PR",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex min-h-[210px] flex-col overflow-hidden rounded-xl bg-white shadow-sm"
                  >
                    <div
                      className={`relative h-24 ${card.imageClass}`}
                    >
                      <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-neutral-800">
                        {card.imageLabel}
                      </div>
                      {card.popular ? (
                        <div className="absolute left-3 top-10 rounded-full bg-[#e2554b] px-2 py-0.5 text-[10px] font-semibold text-white">
                          POPULAR
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col px-3 py-3 text-left">
                      <p className="text-xs font-semibold text-neutral-500">
                        {card.provider}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-neutral-900">
                        {card.title}
                      </p>
                      <p className="mt-3 text-[11px] text-neutral-500">
                        {card.type}
                      </p>
                      <p className="mt-2 text-[11px] text-neutral-700">
                        {card.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col px-4 py-16">
          <h2 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            Automation that turns speed-to-lead into orders and bookings.
          </h2>
          <div className="mt-10 space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="relative overflow-hidden rounded-3xl bg-[#062B57] p-8 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                  <span className="text-white">automation lab</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                    PLUS
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl">
                  Ends soon: Q4 automation onboarding is almost full.
                </h3>
                <p className="mt-3 max-w-sm text-sm text-white/80">
                  Launch always-on workflows for Shopify and local businesses:
                  abandoned cart recovery, lead-to-booking follow-up, missed call
                  text-back, review boosters, and CRM sync.
                </p>
                <button className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1b4fbf]">
                  Book a growth call →
                </button>
                <div className="absolute right-10 top-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#f6d6ff] text-center text-sm font-semibold text-[#1c1c1c]">
                  <span className="leading-tight">
                    <span className="block text-[10px] text-neutral-500 line-through">
                      €299
                    </span>
                    €149
                  </span>
                </div>
                <div className="absolute right-4 top-24 h-10 w-10 rounded-full border border-pink-200/70 bg-white/10" />
                <div className="absolute right-24 top-16 h-12 w-12 rounded-full border border-purple-300/70 bg-white/5" />
                <div className="absolute right-16 bottom-6 flex items-center gap-2">
                  {["S", "M", "G", "K"].map((logo) => (
                    <span
                      key={logo}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#0f1f3a] shadow"
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a5ad6] via-[#1a6fe0] to-[#0c54c4] p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                  Automation packages
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                  Keep every lead warm with instant replies, booking confirmations,
                  review requests, and revenue alerts.
                </h3>
                <button className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0b5bd3]">
                  View services →
                </button>
                <div className="absolute right-0 top-0 h-full w-1/2">
                  <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-[80px] bg-gradient-to-br from-[#8ef0ff] via-[#d2f7ff] to-white/80" />
                  <div className="absolute bottom-6 right-6 h-32 w-32 rounded-tl-[70px] bg-gradient-to-br from-white/90 via-[#d0f2ff] to-[#9cd7ff]" />
                  <div className="absolute bottom-0 right-10 h-52 w-52 rounded-tl-[120px] bg-gradient-to-br from-[#a0ffe2] via-[#d2f7ff] to-[#cfe0ff]" />
                </div>
                <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&q=80"
                    alt="Team meeting"
                    className="h-24 w-32 rounded-2xl object-cover"
                  />
                  <div className="rounded-xl bg-[#0b4cc0] px-3 py-2 text-center text-xs font-semibold">
                    50% off automation setup
                    <span className="block text-[10px] font-normal text-white/80">
                      up to 1000 workflows
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    dot === 0 ? "bg-[#6b7280]" : "bg-[#d1d5db]"
                  )}
                />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {courseraQuickTiles.map((tile) => (
                <div
                  key={tile.label}
                  className="flex h-[76px] items-center justify-between rounded-2xl bg-[#f4f3ff] px-6"
                >
                  <p className="text-sm font-semibold text-neutral-900">
                    {tile.label}
                  </p>
                  {tile.icon}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-base font-semibold text-neutral-900">
                Works with your growth stack
              </p>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex flex-wrap gap-3">
                  {courseraPartnerChips.map((chip) => (
                    <div
                      key={chip.name}
                      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm"
                    >
                      <span
                        className={cn(
                          "flex h-6 min-w-[24px] items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold",
                          chip.color
                        )}
                      >
                        {chip.logo}
                      </span>
                      <span className="whitespace-nowrap">{chip.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-sm text-neutral-600 shadow-sm"
                  aria-label="Scroll partners"
                >
                  →
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Trending workflows for Shopify + local
              </h3>
              <div className="grid gap-6 lg:grid-cols-3">
                {trendingCoursePanels.map((panel) => (
                  <div
                    key={panel.title}
                    className="rounded-2xl bg-[#eaf2ff] p-4"
                  >
                    <p className="text-sm font-semibold text-neutral-900">
                      {panel.title}
                    </p>
                    <div className="mt-4 space-y-3">
                      {panel.items.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3 rounded-xl border border-white/60 bg-white px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbe7ff] text-xs font-semibold text-[#1f4bb8]">
                            {item.providerLogo}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-neutral-500">
                              {item.provider}
                            </p>
                            <p className="mt-1 truncate text-[13px] font-semibold text-neutral-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[11px] text-neutral-500">
                              {item.meta}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                      <button className={primaryButtonClass}>
                        Book a growth call
                      </button>
                      <button className={secondaryButtonClass}>
                        View services
                      </button>
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
            Proof that a growth system performs.
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
