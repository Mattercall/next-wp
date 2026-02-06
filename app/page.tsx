import { Star } from "lucide-react";
import Link from "next/link";
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
import { getRecentPosts } from "@/lib/wordpress";
import { stripHtml } from "@/lib/metadata";
import { BookingCallTrigger } from "@/components/booking/booking-call-trigger";

const promoTiles: {
  title: string;
  description: string[];
  image: string;
  className: string;
  isDark?: boolean;
  singleCta?: string;
}[] = [
  {
    title: "Shopify Web Design",
    description: [
      "Conversion-first storefronts built to lift AOV,",
      "repeat orders, and mobile checkout completion.",
    ],
    image: "/illustrations/shopify-web-design.svg",
    className: "bg-[#0f172a] text-white",
    isDark: true,
  },
  {
    title: "Meta Ads",
    description: [
      "Creative, audiences, and landing flows",
      "that convert clicks into orders and bookings.",
    ],
    image: "/illustrations/meta-ads.svg",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Google Ads + Local Search",
    description: [
      "Capture demand with high-intent search",
      "coverage that lowers CAC and CPL.",
    ],
    image: "/illustrations/google-ads-local-search.svg",
    className: "bg-[#f5f5f7]",
  },
  {
    title: "Growth Strategy + Reporting",
    description: [
      "Unified offer, messaging, and analytics",
      "that keep growth predictable and measurable.",
    ],
    image: "/illustrations/growth-strategy-reporting.svg",
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

const BrandLogo = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/logo.svg"
    alt="Sale Growth Systems logo"
    className={cn("h-4 w-4 object-contain", className)}
  />
);

export default async function Home() {
  const recentPosts = (await getRecentPosts()).slice(0, 4);
  return (
    <main className="bg-white text-neutral-900">
      <div className="w-full border-b border-neutral-200 bg-white px-4 py-2 text-center text-xs text-[#6e6e73]">
        Done-for-you growth systems for Shopify brands and local businesses.
      </div>

      <section>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center px-4 py-16 text-center">
          <BrandLogo className="h-6 w-6" />
          <p className={cn("mt-3", heroEyebrowClass)}>
            Sale Growth Systems
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
            <BookingCallTrigger className={primaryButtonClass}>Book a growth call</BookingCallTrigger>
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
          <h2 className={heroHeadingClass}>
            SEO backlinks that build trust, rankings, and qualified demand
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Secure placements on real sites to improve authority, lift rankings,
            and compound high-intent traffic for Shopify and local services.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <BookingCallTrigger className={primaryButtonClass}>Book a growth call</BookingCallTrigger>
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

            <div className="mx-auto mt-10 flex w-full max-w-[1075px] flex-col gap-6 rounded-[22px] border border-[#e2e8f0] bg-[#f8fafc] px-8 py-8 shadow-sm md:flex-row md:items-center">
              <div className="flex w-full flex-col items-start gap-4 text-left md:w-[32%]">
                <h3 className="text-lg font-semibold text-slate-900">
                  Benchmark authority before
                  <br />
                  you scale SEO
                </h3>
                <button className="rounded-xl border border-[#d7e1f2] bg-white px-4 py-2 text-sm font-semibold text-[#1d4ed8] shadow-sm">
                  View services →
                </button>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:w-[68%]">
                {[
                  {
                    provider: "Authority Lab",
                    title: "Authority Foundations for Ranking Momentum",
                    type: "Backlink Blueprint",
                    rating: "4.9",
                    image: "/illustrations/authority-lab.svg",
                    imageLabel: "SEO",
                    headerClass:
                      "bg-[#e8f1ff]",
                  },
                  {
                    provider: "Shopify Growth",
                    title: "Authority Outreach + PR Placements",
                    type: "Growth Sprint",
                    rating: "4.8",
                    image: "/illustrations/shopify-growth.svg",
                    imageLabel: "Shopify",
                    headerClass:
                      "bg-[#ecfdf3]",
                    popular: true,
                  },
                  {
                    provider: "Digital PR",
                    title: "Content-Led Link Velocity",
                    type: "Authority Specialization",
                    rating: "4.6",
                    image: "/illustrations/digital-pr.svg",
                    imageLabel: "PR",
                    headerClass:
                      "bg-[#fff1e6]",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.3)]"
                  >
                    <div
                      className={`relative flex h-28 items-center justify-between overflow-hidden ${card.headerClass}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_70%)]" />
                      <div className="relative ml-4 flex flex-col gap-2">
                        <div className="w-fit rounded-full border border-white/60 bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                          {card.imageLabel}
                        </div>
                        {card.popular ? (
                          <div className="w-fit rounded-full bg-[#f97316] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                            POPULAR
                          </div>
                        ) : null}
                      </div>
                      <div className="relative mr-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70">
                        <img
                          src={card.image}
                          alt={`${card.provider} icon`}
                          className="h-12 w-12"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-4 py-4 text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {card.provider}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {card.title}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {card.type}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                        <span className="font-semibold">{card.rating}</span>
                        <span className="text-slate-500">/ 5.0 rating</span>
                      </div>
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
          <h2 className={heroHeadingClass}>
            Automation that turns speed-to-lead into orders and bookings.
          </h2>
          <div className="mt-10 space-y-8">
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
                      <BookingCallTrigger className={primaryButtonClass}>
                        Book a growth call
                      </BookingCallTrigger>
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
          <h2 className={cn("mb-10 text-center", heroHeadingClass)}>
            Proof that a growth system performs.
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recentPosts.slice(0, 2).map((post) => {
              const media = post._embedded?.["wp:featuredmedia"]?.[0];
              const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;
              const titleText = post.title?.rendered
                ? stripHtml(post.title.rendered)
                : "Untitled post";
              const dateLabel = new Date(post.date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );
              const meta = [category, dateLabel].filter(Boolean).join(" • ");

              return (
                <div
                  key={post.id}
                  className="relative aspect-square overflow-hidden rounded-[28px]"
                >
                  {media?.source_url ? (
                    <img
                      src={media.source_url}
                      alt={titleText}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-900/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 text-white">
                    <BrandLogo className="h-6 w-6" />
                    <p
                      className="min-h-[3rem] text-lg font-semibold line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: post.title?.rendered || "Untitled post",
                      }}
                    />
                    <p className="text-xs text-neutral-200">
                      {meta || "Recent post"}
                    </p>
                    <Link
                      href={`/${post.slug}`}
                      className="w-fit rounded-full bg-white/90 px-4 py-1 text-xs font-medium text-black"
                    >
                      Read post
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}
