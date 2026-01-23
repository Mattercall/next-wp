import type { Metadata } from "next";

import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";

import { Container, Section } from "@/components/craft";
import {
  heroBodyClass,
  heroHeadingClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/marketing/cta-styles";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About MatterCall",
  description:
    "Learn how MatterCall brings conversations, workflows, and trust into one connected experience for modern teams.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section className="bg-emerald-50 py-16 sm:py-20">
        <Container className="max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className={cn(heroHeadingClass, "text-balance")}>
                Meet the{" "}
                <span className="italic text-emerald-700">MatterCall</span> Platform
              </h1>
              <p className={cn("mt-4 max-w-xl", heroBodyClass)}>
                MatterCall helps teams connect, respond, and resolve faster—bringing
                conversations, workflows, and trust into one place so every customer
                interaction feels effortless and personal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className={cn(
                    primaryButtonClass,
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex h-[320px] w-full max-w-md items-center justify-center sm:h-[360px]">
              <div className="absolute left-2 top-10 w-56 rotate-[-8deg] rounded-3xl border border-emerald-100 bg-white shadow-lg sm:left-0 sm:w-60">
                <div className="h-28 rounded-3xl rounded-b-none bg-emerald-100" />
                <div className="space-y-2 rounded-b-3xl bg-white px-4 py-3">
                  <div className="h-2 w-20 rounded-full bg-emerald-200" />
                  <div className="h-2 w-32 rounded-full bg-emerald-100" />
                </div>
              </div>
              <div className="absolute right-0 top-4 hidden w-56 rotate-[6deg] rounded-3xl border border-emerald-100 bg-white shadow-lg sm:block sm:w-60">
                <div className="h-28 rounded-3xl rounded-b-none bg-emerald-200/70" />
                <div className="space-y-2 rounded-b-3xl bg-white px-4 py-3">
                  <div className="h-2 w-24 rounded-full bg-emerald-200" />
                  <div className="h-2 w-28 rounded-full bg-emerald-100" />
                </div>
              </div>
              <div className="relative z-10 w-64 rounded-[28px] border border-emerald-200 bg-white shadow-2xl sm:w-72">
                <div className="h-32 rounded-[28px] rounded-b-none bg-emerald-900" />
                <div className="rounded-b-[28px] bg-rose-200 px-5 py-4">
                  <p className="text-sm font-semibold text-emerald-950">
                    Guided conversations
                  </p>
                  <p className="mt-1 text-xs text-emerald-900/70">
                    Smart routing and outcomes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20">
        <Container className="max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Why MatterCall?
            </h2>
          </div>
          <div className="mt-10 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                It’s clear and simple
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                A clean experience that helps customers and teams communicate without
                friction.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Built for reliability
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Designed to scale with your organization and stay dependable as usage
                grows.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Zap className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Made to deliver value
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Tools and workflows that reduce response time and improve customer
                satisfaction.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-16 sm:py-20">
        <Container className="max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
              What you get with MatterCall
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Three capability areas that help your teams stay aligned and your
              customers feel heard.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex h-full flex-col border-neutral-200">
              <CardHeader>
                <CardTitle className="text-xl">Teams</CardTitle>
                <p className="text-sm text-neutral-600">
                  Collaboration features for internal workflows.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Shared inbox & assignments
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Notes, tags, and templates
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Role-based access
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <a
                  href="/contact"
                  className={cn(
                    secondaryButtonClass,
                    "w-full text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Explore Teams
                </a>
              </CardFooter>
            </Card>

            <Card className="flex h-full flex-col border-emerald-200 ring-2 ring-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Platform</CardTitle>
                <p className="text-sm text-neutral-600">
                  Core MatterCall experience for conversations and routing.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Smart routing
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Multi-channel ready
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Analytics & reporting
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <a
                  href="/contact"
                  className={cn(
                    primaryButtonClass,
                    "w-full text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Explore Platform
                </a>
              </CardFooter>
            </Card>

            <Card className="flex h-full flex-col border-neutral-200">
              <CardHeader>
                <CardTitle className="text-xl">Integrations</CardTitle>
                <p className="text-sm text-neutral-600">
                  Connect MatterCall to the tools you already use.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    CRM and helpdesk connections
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Webhooks & API
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden />
                    Automation triggers
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <a
                  href="/contact"
                  className={cn(
                    secondaryButtonClass,
                    "w-full text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Explore Integrations
                </a>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-emerald-950 py-16 sm:py-20">
        <Container className="max-w-4xl text-center">
          <h2 className={cn(heroHeadingClass, "text-emerald-50")}>
            Ready to <span className="italic text-emerald-200">talk</span> with
            MatterCall?
          </h2>
          <p className={cn("mt-4 text-emerald-200", heroBodyClass)}>
            Bring every conversation together with a platform designed for clarity,
            speed, and trust.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/contact"
              className="h-10 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
            >
              Get started
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
