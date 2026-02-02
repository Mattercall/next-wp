"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, Plus, ShoppingBag } from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80",
];

const heroVideoUrl = "https://alidrives.b-cdn.net/alibacklink-main.mp4";

const logos = [
  "allbirds",
  "GYMSHARK",
  "brooklinen",
  "Leesa",
  "KYLIE",
  "Crate&Barrel",
  "MONOS",
];

const features = [
  {
    tag: "HIGH-AUTHORITY BACKLINKS",
    title: "DA 50+ to DA 90+ placements on real sites",
    description:
      "Build authority with contextual mentions, clean link profiles, and live reporting. Best for competitive niches and new category pages. Deliverables include target page + anchor strategy, optional placement shortlist approval, and live links + reporting. Note: DA is a third-party metric popularized by Moz.",
    image:
      "/service/seo/feature-backlinks.svg",
  },
  {
    tag: "KEYWORD RANKING ACCELERATOR",
    title: "Move priority pages up the SERP faster",
    description:
      "We map quick wins, sharpen on-page relevance, and ship updates that match search intent. Best for pages stuck on page 2 or new keyword clusters. Deliverables include a keyword map, on-page optimization plan, and SERP-based outlines when new pages are needed.",
    image:
      "/service/seo/feature-keyword-accelerator.svg",
  },
  {
    tag: "PRESS RELEASE + DISTRIBUTION",
    title: "PR visibility that builds credibility",
    description:
      "We write your release, format it correctly, and distribute it for brand mentions that stick. Best for launches, funding, and milestones. Deliverables include writing + revisions, distribution, and a live URL list where available.",
    image:
      "/service/seo/feature-press-release.svg",
  },
  {
    tag: "DR GROWTH PROGRAM",
    title: "Grow organic traffic with compounding authority",
    description:
      "We build durable authority that lifts rankings and organic traffic over time. You receive a DR growth roadmap, a safe link velocity plan, and monthly progress reports with next-step priorities so you always know what is moving the needle. DR is an Ahrefs metric that reflects backlink profile strength.",
    image:
      "/service/seo/feature-dr-growth.svg",
  },
];

const faqs = [
  {
    question: "What services can I order?",
    answer:
      "You can order DA 30+ backlinks, DA 50+ backlinks, DA 90+ backlinks, and even DA 100 backlinks (including opportunities like wikipedia.org when they are a fit). We also offer press release writing + distribution and a DR growth program. If we cannot provide a service as promised, we issue a 100% refund with no questions asked.",
  },
  {
    question: "How do you decide which pages and keywords to focus on?",
    answer:
      "We look for the fastest path to revenue: pages already close to page one, high-intent queries with clear buying signals, and competitor gaps you can win. You get a focused priority map that ties each keyword to a page, intent, and expected business impact.",
  },
  {
    question: "What does the press release service include?",
    answer:
      "We handle strategy, drafting, edits, formatting, and distribution. You receive the final release, a distribution report with available live URLs, and notes on what to amplify next for continued visibility.",
  },
  {
    question: "How does the DR growth program help organic traffic?",
    answer:
      "We strengthen authority in a safe, consistent way so more of your pages can rank. Monthly updates cover DR changes, referring domains, link velocity, and the specific actions that support organic traffic growth so you can see progress and next steps clearly.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "We need your website URL, target pages or products, and any priority keywords or markets. If you can share Search Console, Analytics, or competitor examples, we can move faster, but it is not required.",
  },
  {
    question: "How soon should I expect results?",
    answer:
      "Most brands see early movement in 4–8 weeks, with stronger gains compounding over 3–6 months. Timelines depend on competition, site health, and the scope of the strategy, and we set expectations upfront.",
  },
  {
    question: "Do you guarantee rankings or traffic?",
    answer:
      "No. Search algorithms change and results depend on multiple factors. What we guarantee is a clear plan, high-quality deliverables, and transparent reporting so you always know what work was completed and why it matters.",
  },
  {
    question: "Can you support local or international SEO goals?",
    answer:
      "Yes. We align your strategy to local geo targets or international markets with localized content guidance and authority-building tailored to each region.",
  },
  {
    question: "How do you ensure quality and relevance?",
    answer:
      "We focus on relevance first, then authority. Every site and topic is reviewed for fit with your industry, audience, and content standards so your growth looks natural and protects long-term brand trust.",
  },
  {
    question: "What happens if the service is not delivered?",
    answer:
      "If we cannot provide a service as promised, you receive a 100% refund without any additional questions. We keep the terms simple so you can purchase with confidence.",
  },
];

const cardSurfaceClasses =
  "rounded-3xl border border-neutral-100 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]";
const cardBadgeClasses =
  "inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600";

const prospectFacts = [
  {
    title: "NO GUESSWORK",
    body: "See every placement, page update,\nand PR distribution as it ships.",
    left: 531,
    imageUrl: "/service/seo/fact-no-guesswork.svg",
  },
  {
    title: "NO FLUFF",
    body:
      "You’ll get clear reporting on\nrankings, traffic, and authority.",
    left: 826,
    imageUrl: "/service/seo/fact-no-fluff.svg",
  },
  {
    title: "OUTCOMES YOU CAN TRACK",
    body: "Know what went live, where it\nlanded, and how it performs.",
    left: 1121,
    imageUrl: "/service/seo/fact-outcomes.svg",
  },
];

const prospectFactsSecondary = [
  {
    title: "STEP 1",
    body: "Tell us your goal, site, and\npriority pages or keywords.",
    left: 395,
    imageUrl: "/service/seo/step-goal.svg",
  },
  {
    title: "STEP 2",
    body:
      "We audit, map opportunities, and\nfind the fastest path to impact.",
    left: 660,
    imageUrl: "/service/seo/step-audit.svg",
  },
  {
    title: "STEP 3",
    body: "You approve a clear plan with\ntargets, timelines, and outputs.",
    left: 925,
    imageUrl: "/service/seo/step-plan.svg",
  },
  {
    title: "STEP 4",
    body: "We execute: placements, updates,\nPR distribution, and DR growth.",
    left: 1190,
    imageUrl: "/service/seo/step-execute.svg",
  },
];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type StartForFreeBarProps = {
  className?: string;
  variant: "dark" | "light";
  email: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  buttonName?: string;
};

const StartForFreeBar = ({
  className,
  variant,
  email,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onSubmit,
  buttonName,
}: StartForFreeBarProps) => {
  const isDark = variant === "dark";
  const trimmedButtonName = buttonName?.trim();
  const showButton = Boolean(trimmedButtonName);
  const isEmailValid = EMAIL_REGEX.test(email);

  return (
    <div
      className={cn(
        isDark
          ? "rounded-[28px] border border-white/10 bg-gradient-to-b from-[#111111] to-[#0B0B0B] p-5 text-left text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          : "rounded-full border border-transparent bg-white px-4 py-2 text-neutral-900 focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/20",
        className
      )}
    >
      {isDark && (
        <div>
          <div className="text-base font-semibold">
            Get 1 backlink for $1
          </div>
          <p className="mt-1 text-xs text-white/60">
            By continuing, you agree to receive marketing emails.
          </p>
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className={cn(
          isDark ? "mt-3 border-t border-white/10 pt-3" : "flex w-full"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-4 rounded-full",
            isDark
              ? "h-14 border border-white/10 bg-[#1a1a1a] px-5 focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/20"
              : "w-full"
          )}
        >
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isSubmitting}
            className={cn(
              "flex-1 border-0 bg-transparent shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              isDark
                ? "h-14 text-base text-white placeholder:text-neutral-500"
                : "h-9 text-sm placeholder:text-neutral-500"
            )}
          />
          {showButton ? (
            <Button
              type="submit"
              disabled={isSubmitting || !isEmailValid}
              className={cn(
                "h-10 rounded-full border px-5 text-sm font-semibold shadow-sm transition-all focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                isDark
                  ? "border-white/15 bg-white text-neutral-900 hover:bg-white/90"
                  : "border-neutral-900/10 bg-neutral-900 text-white hover:bg-neutral-800"
              )}
            >
              {trimmedButtonName}
            </Button>
          ) : isDark ? (
            <button
              type="submit"
              aria-label="Submit email"
              disabled={isSubmitting}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 shadow-none outline-none transition-colors hover:text-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={isSubmitting}
              className="h-9 w-9 rounded-full bg-neutral-900 text-white shadow-none hover:bg-neutral-900/90 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {errorMessage && (
          <p
            className={cn(
              "mt-2 text-xs",
              isDark ? "text-red-200" : "text-red-600"
            )}
          >
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default function SeoLanding() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const primaryCtaLabel = "Checkout now";
  const secondaryCtaLabel = "Checkout Now ($1)";
  const hasHeroVideo = (() => {
    if (!heroVideoUrl?.trim()) return false;
    try {
      new URL(heroVideoUrl);
      return true;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    const heroSentinel = heroSentinelRef.current;
    if (!heroSentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(heroSentinel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footerSentinel = footerSentinelRef.current;
    if (!footerSentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(footerSentinel);

    return () => observer.disconnect();
  }, []);

  const showStickyCta = !isHeroVisible && !isFooterVisible;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/seo-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      const data = (await response.json()) as { checkoutUrl?: string };

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setErrorMessage("Missing checkout URL. Please try again.");
    } catch (error) {
      console.error("Failed to submit lead", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background font-sans text-foreground">
      <section className="relative overflow-hidden bg-background pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="absolute inset-0">
          {hasHeroVideo ? (
            <div className="absolute inset-0">
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                src={heroVideoUrl}
              />
            </div>
          ) : (
            <div className="absolute inset-[-35%] rotate-[-4deg]">
              <div className="grid h-full w-full grid-cols-4 gap-6 opacity-90">
                {heroImages.map((image, index) => (
                  <div
                    key={image}
                    className="relative overflow-hidden rounded-3xl bg-neutral-100 shadow-sm"
                  >
                    <img
                      src={image}
                      alt="MatterCall SEO collage"
                      className="h-full w-full object-cover"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4">
          <div className="mt-6 w-full max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600">
              <ShoppingBag className="h-5 w-5" />
              MatterCall
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold text-neutral-900 sm:text-4xl">
              Authority + rankings that turn searchers into customers
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Get high-authority placements (DA 50–DA 90+), keyword wins, and
              PR-driven visibility built to grow trust, traffic, and revenue.
              Choose from backlinks, ranking accelerators, press releases, or
              DR growth programs.
            </p>
            <StartForFreeBar
              className="mt-6"
              variant="dark"
              email={email}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              buttonName={primaryCtaLabel}
            />
          </div>
        </div>
        <div ref={heroSentinelRef} className="h-px w-full" aria-hidden="true" />
      </section>

      <section className="bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {logos.map((logo) => (
            <span key={logo} className="px-3">
              {logo}
            </span>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FAFCFF]">
        <div className="absolute inset-x-0 top-0 h-[206px] bg-white" />
        <div className="absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 1906 739"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="seo-prospect-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0.1"
              >
                <stop offset="0%" stopColor="#275B9C" />
                <stop offset="50%" stopColor="#3873B9" />
                <stop offset="100%" stopColor="#275B9C" />
              </linearGradient>
            </defs>
            <path
              d="M0,433 C350,425 550,435 805,423 C1100,415 1350,435 1906,433 L1906,739 L0,739 Z"
              fill="url(#seo-prospect-gradient)"
            />
          </svg>
        </div>
        <div className="relative mx-auto w-full max-w-[1906px]">
          <div className="relative mx-auto w-full max-w-[920px] px-4 pt-12 text-center lg:absolute lg:left-1/2 lg:top-[70px] lg:-translate-x-1/2 lg:px-0 lg:pt-0">
            <h2 className="text-[30px] font-semibold leading-[1.15] text-[#2B5E98] sm:text-[36px] lg:text-[42px]">
              No guesswork.{" "}
              <span className="font-normal">No fluff.</span>
              <br />
              <span className="text-[28px] font-normal sm:text-[34px] lg:text-[40px]">
                Just outcomes you can track.
              </span>
            </h2>
            <p className="mt-4 text-[13px] font-semibold text-[#406DA2] sm:text-[14px]">
              See what shipped, where it went live, and how performance moves
              across rankings, traffic, and authority metrics.
            </p>
          </div>

          <div className="relative px-4 pb-12 pt-8 lg:h-[739px] lg:px-0 lg:pb-0 lg:pt-0">
            <div className="flex flex-col gap-6 lg:contents">
              {prospectFacts.map((fact) => (
                <div
                  key={fact.title}
                  className={cn(
                    "mx-auto w-full max-w-[320px] px-5 pb-5 pt-4 text-center lg:absolute lg:top-[238px] lg:w-[253px]",
                    cardSurfaceClasses
                  )}
                  style={{ left: `${fact.left}px` }}
                >
                  <div className="mx-auto flex h-[175px] w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-50">
                    <img
                      src={fact.imageUrl}
                      alt=""
                      className="h-full w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <span className={cardBadgeClasses}>{fact.title}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.35] text-neutral-500">
                    {fact.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 w-full max-w-[880px] text-center text-white lg:absolute lg:left-1/2 lg:top-[560px] lg:mt-0 lg:-translate-x-1/2">
              <div className="text-[15px] font-bold tracking-wide sm:text-[17px]">
                RESULT
              </div>
              <p className="mt-3 text-[12px] leading-[1.55] sm:text-[13px]">
                Every update ties back to measurable trust, visibility, and
                revenue impact.
              </p>
            </div>

            <svg
              className="absolute bottom-0 right-0 h-[260px] w-[420px]"
              viewBox="0 0 420 260"
              fill="none"
              aria-hidden="true"
            >
              <g stroke="rgba(0,0,0,0.12)" strokeWidth="1">
                <path d="M320 190 l30 -17 30 17 0 34 -30 17 -30 -17z" />
                <path d="M260 150 l30 -17 30 17 0 34 -30 17 -30 -17z" />
                <path d="M360 130 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M200 190 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M300 230 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M380 210 l18 -10 18 10 0 20 -18 10 -18 -10z" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FAFCFF]">
        <div className="absolute inset-x-0 top-0 h-[206px] bg-white" />
        <div className="absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 1906 739"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="seo-prospect-gradient-secondary"
                x1="0"
                y1="0"
                x2="1"
                y2="0.1"
              >
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="50%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            <path
              d="M0,433 C350,425 550,435 805,423 C1100,415 1350,435 1906,433 L1906,739 L0,739 Z"
              fill="url(#seo-prospect-gradient-secondary)"
            />
          </svg>
        </div>
        <div className="relative mx-auto w-full max-w-[1906px]">
          <div className="relative mx-auto w-full max-w-[920px] px-4 pt-12 text-center lg:absolute lg:left-1/2 lg:top-[70px] lg:-translate-x-1/2 lg:px-0 lg:pt-0">
            <h2 className="text-[30px] font-semibold leading-[1.15] text-[#2B5E98] sm:text-[36px] lg:text-[42px]">
              How it works{" "}
              <span className="font-normal">step-by-step</span>
              <br />
              <span className="text-[28px] font-normal sm:text-[34px] lg:text-[40px]">
                a simple process that ships.
              </span>
            </h2>
            <p className="mt-4 text-[13px] font-semibold text-[#406DA2] sm:text-[14px]">
              Choose your service, approve a clear plan, and we execute the
              deliverables that grow authority and rankings.
            </p>
          </div>

          <div className="relative px-4 pb-12 pt-8 lg:h-[739px] lg:px-0 lg:pb-0 lg:pt-0">
            <div className="flex flex-col gap-6 lg:contents">
              {prospectFactsSecondary.map((fact) => (
                <div
                  key={fact.title}
                  className={cn(
                    "mx-auto w-full max-w-[320px] px-5 pb-5 pt-4 text-center lg:absolute lg:top-[238px] lg:w-[253px]",
                    cardSurfaceClasses
                  )}
                  style={{ left: `${fact.left}px` }}
                >
                  <div className="mx-auto flex h-[175px] w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-50">
                    <img
                      src={fact.imageUrl}
                      alt=""
                      className="h-full w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4">
                    <span className={cardBadgeClasses}>{fact.title}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.35] text-neutral-500">
                    {fact.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-10 w-full max-w-[880px] text-center text-white lg:absolute lg:left-1/2 lg:top-[560px] lg:mt-0 lg:-translate-x-1/2">
              <div className="text-[15px] font-bold tracking-wide sm:text-[17px]">
                RESULT
              </div>
              <p className="mt-3 text-[12px] leading-[1.55] sm:text-[13px]">
                Real deliverables, transparent reporting, and momentum you can
                measure every month.
              </p>
            </div>

            <svg
              className="absolute bottom-0 right-0 h-[260px] w-[420px]"
              viewBox="0 0 420 260"
              fill="none"
              aria-hidden="true"
            >
              <g stroke="rgba(0,0,0,0.12)" strokeWidth="1">
                <path d="M320 190 l30 -17 30 17 0 34 -30 17 -30 -17z" />
                <path d="M260 150 l30 -17 30 17 0 34 -30 17 -30 -17z" />
                <path d="M360 130 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M200 190 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M300 230 l24 -14 24 14 0 28 -24 14 -24 -14z" />
                <path d="M380 210 l18 -10 18 10 0 20 -18 10 -18 -10z" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Pick your service (what you can buy today)
          </h2>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={cn("p-6", cardSurfaceClasses)}
            >
              <span className={cardBadgeClasses}>
                {feature.tag}
              </span>
              <div className="mt-5 overflow-hidden rounded-2xl bg-neutral-100">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="border-t border-neutral-200" />
      </div>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <blockquote className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            “We needed authority and rankings that actually drove customers.
            MatterCall delivered placements, wins, and revenue momentum.”
          </blockquote>
          <p className="mt-4 text-sm text-neutral-500">
            Clare Jerome, NEOM Studio
          </p>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl bg-gradient-to-br from-[#3b0fb8] via-[#4512c4] to-[#2b088f] px-6 py-12 text-center text-white shadow-[0_30px_80px_rgba(35,8,112,0.4)] sm:px-12">
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
              Turn authority and rankings into booked revenue.
              <br />
              Start with a growth plan built for real outcomes.
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3">
              <StartForFreeBar
                className="w-full max-w-md"
                variant="light"
                email={email}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
                buttonName={secondaryCtaLabel}
              />
              <p className="text-xs text-white/70">
                By continuing, you agree to receive marketing emails.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-neutral-900">
            Questions?
          </h2>
          <div className="mt-6 divide-y divide-neutral-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left text-base font-medium text-neutral-900"
                  >
                    {faq.question}
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 transition-transform ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 text-sm text-neutral-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="bg-background pb-6">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[10px] leading-relaxed text-neutral-400">
            Disclaimer: SEO results vary based on competition, website
            condition, industry, and algorithm changes. We cannot guarantee
            specific rankings, traffic, or revenue outcomes.
          </p>
        </div>
      </div>
      <div ref={footerSentinelRef} className="h-px w-full" aria-hidden="true" />

      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 transition-all duration-300",
          showStickyCta
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <StartForFreeBar
          variant="dark"
          email={email}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
          buttonName={primaryCtaLabel}
        />
      </div>
    </main>
  );
}
