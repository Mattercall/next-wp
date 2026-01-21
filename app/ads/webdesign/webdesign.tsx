"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    tag: "CUSTOMIZABLE THEMES",
    title: "Create a stunning store in seconds",
    description:
      "Pre-built designs make it fast and easy to kickstart your brand.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "OPTIMIZED CHECKOUT",
    title: "Sell more with the world's best checkout",
    description:
      "15% higher conversion means you can sell more on Shopify than elsewhere.",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "NEXT-LEVEL",
    title: "Level up with an AI assistant",
    description:
      "Selling is easy with a built-in business partner who can help scale your vision.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "ALL-IN-ONE",
    title: "Getting stuff done? Done.",
    description:
      "Shopify handles everything from secure payments to marketing and hardware.",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80",
  },
];

const faqs = [
  "What is Shopify and how does it work?",
  "How much does Shopify cost?",
  "Can I use my own domain name with Shopify?",
  "Do I need to be a designer or developer to use Shopify?",
];

export default function WebDesignLanding() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden bg-background pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-[-35%] rotate-[-4deg]">
            <div className="grid h-full w-full grid-cols-4 gap-6 opacity-90">
              {heroImages.map((image, index) => (
                <div
                  key={image}
                  className="relative overflow-hidden rounded-3xl bg-neutral-100 shadow-sm"
                >
                  <img
                    src={image}
                    alt="Shopify collage"
                    className="h-full w-full object-cover"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4">
          <div className="mt-6 w-full max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600">
              <ShoppingBag className="h-5 w-5" />
              shopify
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold text-neutral-900 sm:text-4xl">
              Your business starts with Shopify
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Try 3 days free, then $1/month for 3 months.
              <br />
              What are you waiting for?
            </p>
            <div className="mt-6 rounded-2xl bg-neutral-900 p-4 text-left text-white">
              <div className="text-xs font-semibold uppercase tracking-wide">
                Start for free
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                You agree to receive marketing emails.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-neutral-950 px-4 py-3">
                <Input
                  placeholder="Enter your email"
                  className="h-9 flex-1 border-0 bg-transparent text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white text-neutral-900 hover:bg-white/90"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
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
            “We&apos;ve tripled in size since we first started on Shopify. It
            gives us the tools we need to keep pushing forward.”
          </blockquote>
          <p className="mt-4 text-sm text-neutral-500">
            Clare Jerome, NEOM Wellbeing
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
              No risk, all rewards.
              <br />
              Try Shopify for $1/month.
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white px-4 py-2 text-neutral-900">
                <Input
                  placeholder="Enter your email"
                  className="h-9 flex-1 border-0 bg-transparent text-sm placeholder:text-neutral-500 focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-full bg-neutral-900 text-white hover:bg-neutral-900/90"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-white/70">
                You agree to receive Shopify marketing emails.
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
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
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
                        Shopify gives you everything you need to set up your
                        store, accept payments, and manage your business in one
                        place.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Shopify</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {[
              "Terms of Service",
              "Privacy Policy",
              "Sitemap",
              "Your Privacy Choices",
            ].map((link) => (
              <button
                key={link}
                type="button"
                className="transition-colors hover:text-neutral-900"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
