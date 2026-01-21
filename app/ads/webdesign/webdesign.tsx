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

const heroVideoUrl = "https://alidrives.b-cdn.net/Intro.mp4";

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
    tag: "SIGNATURE DESIGN",
    title: "Design that feels custom the moment it loads",
    description:
      "MatterCall crafts layouts that match your voice, not a template.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "CONVERSION FOCUS",
    title: "Every page built to earn trust and action",
    description:
      "We shape the flow so visitors see the proof, the offer, and the next step.",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "MOBILE-FIRST",
    title: "Fast, responsive, and built for real shoppers",
    description:
      "Speed, clarity, and tap-friendly UX mean more buyers on every device.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "SEO-READY",
    title: "Structure that search engines can actually read",
    description:
      "Clean hierarchy, metadata, and content strategy help you rank with intent.",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80",
  },
];

const faqs = [
  "How fast can MatterCall launch my new site?",
  "What is included in a MatterCall web design build?",
  "Will my site be optimized for mobile and SEO?",
  "Can you work with my existing brand and content?",
];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type StartForFreeBarProps = {
  className?: string;
  variant: "dark" | "light";
  email: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  showCheckoutCta: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const StartForFreeBar = ({
  className,
  variant,
  email,
  isSubmitting,
  errorMessage,
  showCheckoutCta,
  onEmailChange,
  onSubmit,
}: StartForFreeBarProps) => {
  const isDark = variant === "dark";
  const showSubmitIcon = !showCheckoutCta;

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
          "flex w-full flex-col gap-2",
          isDark ? "mt-3 border-t border-white/10 pt-3" : ""
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-4 rounded-full",
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
          {showSubmitIcon &&
            (isDark ? (
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
            ))}
        </div>
        {showCheckoutCta && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full rounded-full font-semibold shadow-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
              isDark
                ? "h-14 border border-white/10 bg-white/10 text-sm text-white hover:bg-white/20"
                : "h-9 bg-neutral-900 text-sm text-white hover:bg-neutral-900/90"
            )}
          >
            Checkout Now
          </Button>
        )}
        {errorMessage && (
          <p
            className={cn(
              "w-full text-xs",
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

export default function WebDesignLanding() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false);
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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/webdesign-config");
        if (!response.ok) return;
        const data = (await response.json()) as { enabled?: boolean };
        setIsCheckoutEnabled(Boolean(data.enabled));
      } catch (error) {
        console.error("Failed to load webdesign config", error);
      }
    };

    fetchConfig();
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
      const response = await fetch("/api/webdesign-lead", {
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
                      alt="MatterCall design collage"
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
              Premium web design that turns clicks into clients
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Launch a site that feels high-end, loads fast, and explains your
              value in seconds.
            </p>
            <StartForFreeBar
              className="mt-6"
              variant="dark"
              email={email}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              showCheckoutCta={isCheckoutEnabled}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
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
            “MatterCall gave us a site that finally reflects the caliber of our
            work. Leads feel warmer, and deals close faster.”
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
              Turn your best traffic into confident yeses.
              <br />
              Start with a MatterCall build sprint.
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3">
              <StartForFreeBar
                className="w-full max-w-md"
                variant="light"
                email={email}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
                showCheckoutCta={isCheckoutEnabled}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
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
                        We map your goals, design around proof and clarity, and
                        deliver a launch-ready site with conversion-focused
                        messaging.
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
          showCheckoutCta={isCheckoutEnabled}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
