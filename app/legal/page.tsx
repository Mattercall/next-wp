import type { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/craft";
import {
  heroBodyClass,
  heroEyebrowClass,
  heroHeadingClass,
} from "@/components/marketing/cta-styles";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Legal Hub | MatterCall",
  description:
    "Policies, terms, and guidelines that keep the MatterCall community informed.",
  alternates: {
    canonical: "/legal",
  },
};

const legalCards = [
  {
    title: "Terms of Service",
    description: "Conditions users agree to when using MatterCall.",
    href: "/legal/terms",
  },
  {
    title: "Service Terms",
    description: "Conditions for organizations using MatterCall services.",
    href: "/legal/service-terms",
  },
  {
    title: "Privacy Policy",
    description: "What we collect, why we collect it, and how we use it.",
    href: "/legal/privacy",
  },
  {
    title: "Payment Terms",
    description: "Terms that govern payments made or received via MatterCall.",
    href: "/legal/payments",
  },
];

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 48 48"
    className={cn("h-10 w-10 text-emerald-500", className)}
    fill="none"
  >
    <rect
      x="10"
      y="8"
      width="28"
      height="32"
      rx="6"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 18h16M16 24h16M16 30h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 35c2.5 1.6 4.8 1.1 7.5-1.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function LegalHubPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section className="bg-emerald-950 py-16 text-white md:py-24">
        <Container className="max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className={cn(heroHeadingClass, "text-white")}>
                <span className="font-semibold">MatterCall’s</span>{" "}
                <span className="font-semibold italic">Legal Hub</span>
              </h1>
              <p className={cn(heroBodyClass, "mt-4 max-w-lg text-white/80")}>
                All the information you don&apos;t want to read, but should.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative z-10 overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-b from-emerald-200/20 via-emerald-200/10 to-emerald-400/20 shadow-2xl">
                <div className="aspect-[3/4] w-full" />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                    Portrait placeholder
                  </span>
                </div>
              </div>
              <div className="absolute -left-6 bottom-10 z-20 w-48 rounded-2xl bg-white/95 p-4 text-emerald-900 shadow-xl ring-1 ring-emerald-100/70 sm:-left-10">
                <div className="space-y-3">
                  <div className="h-2 w-3/4 rounded-full bg-emerald-200" />
                  <div className="h-2 w-full rounded-full bg-emerald-100" />
                  <div className="h-2 w-5/6 rounded-full bg-emerald-100" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <svg
                    aria-hidden
                    viewBox="0 0 64 24"
                    className="h-6 w-auto text-emerald-600"
                    fill="none"
                  >
                    <path
                      d="M4 14c8-8 12 8 20 0s12 4 20-6 12 6 16 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Sign
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 md:py-20">
        <Container className="max-w-6xl">
          <div className="text-center">
            <p className={cn(heroEyebrowClass, "text-emerald-600")}>
              How MatterCall Works
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Policies and Guidelines for the MatterCall Community
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {legalCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group focus-visible:outline-none"
              >
                <Card className="flex h-full flex-col gap-4 border-emerald-100/60 bg-white p-6 transition-shadow duration-200 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-emerald-500 group-focus-visible:ring-offset-2">
                  <div className="flex h-24 items-center justify-center rounded-2xl bg-emerald-50">
                    <DocumentIcon className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {card.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {card.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
