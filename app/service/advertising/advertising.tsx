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

const heroVideoUrl = "";

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
    tag: "FULL-FUNNEL ADS",
    title: "Campaigns that match intent at every stage",
    description:
      "We build ad journeys that warm audiences, retarget visitors, and close sales.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "CREATIVE STRATEGY",
    title: "Scroll-stopping creative for Facebook and Instagram",
    description:
      "Messaging, hooks, and visuals that earn clicks and keep CPMs efficient.",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "SEARCH DOMINANCE",
    title: "High-intent Google Ads that convert",
    description:
      "We engineer keyword, ad, and landing page alignment to win the paid auction.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "OPTIMIZATION",
    title: "Real-time tuning that keeps ROAS climbing",
    description:
      "Daily budget shifts, creative testing, and bid strategy upgrades keep spend efficient.",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80",
  },
];

const faqs = [
  "How quickly can MatterCall launch paid campaigns?",
  "What is included in a MatterCall ads engagement?",
  "Do you manage both Facebook Ads and Google Ads?",
  "Can you work with our existing creative and data?",
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
          <div className="text-base font-semibold">Start for free</div>
          <p className="mt-1 text-xs text-white/60">
            You agree to receive marketing emails.
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
            placeholder="Enter your email"
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

export default function AdvertisingLanding() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ctaButtonLabel = "Start free";
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
      const response = await fetch("/api/advertising-lead", {
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
    <main className="bg-background text-foreground">
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
                      alt="MatterCall advertising collage"
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
              Paid advertising that turns clicks into customers
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Launch Facebook and Google campaigns that scale traffic, capture
              demand, and convert with confidence.
            </p>
            <StartForFreeBar
              className="mt-6"
              variant="dark"
              email={email}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              buttonName={ctaButtonLabel}
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

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
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
            “MatterCall rebuilt our ad engine and the traffic jumped
            immediately. Leads are higher intent, and spend is finally
            predictable.”
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
              Turn paid traffic into confident yeses.
              <br />
              Start with a MatterCall ads sprint.
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
                buttonName={ctaButtonLabel}
              />
              <p className="text-xs text-white/70">
                You agree to receive MatterCall marketing emails.
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
            {faqs.map((question, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left text-base font-medium text-neutral-900"
                  >
                    {question}
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
                        We audit your funnel, build tailored campaigns, and
                        optimize bids and creative to scale paid traffic with
                        measurable results.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
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
          buttonName={ctaButtonLabel}
        />
      </div>
    </main>
  );
}
