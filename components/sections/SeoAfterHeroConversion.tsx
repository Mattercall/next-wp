import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const trustBadges = ["B2B", "SaaS", "E-commerce", "Local SEO", "Enterprise"];

const problemFacts = [
  "Prospects can only buy from you if they can find you in search.",
  "People scan results fast — if your snippet and page don’t match intent, they leave.",
  "Great text can explain complex offers, but without visibility and structure it won’t get read.",
];

const seoConditions = [
  {
    title: "...you target the right search intent and keywords…",
    description:
      "We align intent, pages, and offers so the traffic you earn is actually ready to convert.",
  },
  {
    title: "...your website is technically strong and fast…",
    description:
      "Speed, crawlability, and clean architecture give every page the best chance to rank.",
  },
  {
    title: "...your content and authority are built consistently — and measured…",
    description:
      "SEO is a system: we ship improvements, measure impact, and iterate for compounding growth.",
  },
];

const differentiationRows = [
  {
    label: "Strategy",
    standard: "Random keywords and one-off tasks without business priorities.",
    us: "Business-first roadmap: pages, intent, and funnels aligned to revenue.",
  },
  {
    label: "Content",
    standard: "Blog posts that don’t rank or convert.",
    us: "Topic clusters + landing pages that answer intent and drive action.",
  },
  {
    label: "Technical",
    standard: "Basic audits with no follow-through.",
    us: "Hands-on fixes: Core Web Vitals, crawl/indexation, schema, internal linking.",
  },
  {
    label: "Authority",
    standard: "Low-quality links or none at all.",
    us: "Digital PR + link earning strategies that build trust safely.",
  },
  {
    label: "Measurement",
    standard: "Traffic reports without decisions.",
    us: "Conversion tracking + experiments so SEO improves leads/sales.",
  },
];

const workSteps = [
  {
    title: "Step 1",
    description: "Fill out the questionnaire — tell us about your business and goals.",
  },
  {
    title: "Step 2",
    description: "Opportunity analysis — we review your site, competitors, and quick wins.",
  },
  {
    title: "Step 3",
    description: "Strategy — in the consultation we define a clear plan and priorities.",
  },
];

const processSteps = [
  {
    title: "Kick Off",
    description: "We align on goals, target audience, and offers.",
    time: "60 minutes",
  },
  {
    title: "Audit",
    description: "Technical + content audit with prioritized fixes.",
    time: "~20 minutes (your review)",
  },
  {
    title: "Roadmap",
    description: "Keyword + topic plan, pages to build, internal linking structure.",
    time: "~20 minutes (feedback)",
  },
  {
    title: "Implementation",
    description: "We execute fixes and content improvements.",
    time: "We do the work",
  },
  {
    title: "Reporting & iteration",
    description: "Measure conversions, refine pages, expand what works.",
    time: "15 minutes/month (your review)",
  },
];

export default function SeoAfterHeroConversion() {
  const contactHref = "/contact";
  const caseStudiesHref = "/category/case-studies";

  return (
    <>
      <section id="reviews" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                SEO Service Reviews
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                What our clients say
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                See the case studies — and start with a free initial consultation.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                <li>Free initial consultation</li>
                <li>Proven SEO frameworks (technical + content + authority)</li>
                <li>Clear roadmap in the first call</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={contactHref}>Free initial consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={caseStudiesHref}>See the case studies</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href={caseStudiesHref}>More examples</Link>
                </Button>
              </div>
            </div>
            <Card className="h-full border-border/60 bg-background/60">
              <CardHeader>
                <CardTitle className="text-xl">
                  Trusted by growth-focused teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  We partner with ambitious teams that need predictable, qualified
                  inbound traffic and a clear plan to convert it.
                </p>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {trustBadges.map((badge) => (
                    <Badge key={badge} variant="outline" className="px-3 py-1">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="problem" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Why do many of your prospects never become customers?
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              You know why customers choose you. But you don’t know why many
              prospects never even find you — or choose a competitor instead…
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {problemFacts.map((fact) => (
              <Card key={fact} className="h-full">
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  {fact}
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-6 text-sm text-foreground">
              Result: Prospects spend only a few seconds deciding whether to
              click and stay. If they don’t immediately see relevance and trust,
              they bounce — and you lose the customer even if your offer is the
              perfect fit.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="conditions" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            SEO will only bring you more customers if…
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {seoConditions.map((condition) => (
              <Card key={condition.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{condition.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {condition.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="differentiation" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Why do our SEO results outperform?
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              You won’t get a generic checklist. You get a strategy built to grow
              qualified traffic and conversions.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Focus area
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Standard SEO
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Our approach
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {differentiationRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-4 font-medium text-foreground">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {row.standard}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="engagement" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Here’s how you can work with us
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              We focus on projects where we see the highest potential for
              measurable growth.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {workSteps.map((step) => (
              <Card key={step.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {step.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="consultation" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                What happens during the initial consultation?
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                In the free consultation, an SEO specialist maps your current
                situation, identifies the fastest growth levers, and outlines a
                realistic roadmap.
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                You’ll leave with clear next steps: what to fix, what to build,
                and how we’ll measure success.
              </p>
            </div>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex h-full flex-col justify-between gap-4 pt-6">
                <p className="text-sm text-muted-foreground">
                  Ready to map your SEO roadmap?
                </p>
                <Button asChild className="w-full">
                  <Link href={contactHref}>Free initial consultation</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="process" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              How the SEO process works
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Your time investment: ~2 hours for the core setup.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((step) => (
              <Card key={step.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{step.description}</p>
                  <p className="font-medium text-foreground">{step.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={caseStudiesHref}>Our portfolio</Link>
            </Button>
            <Button asChild>
              <Link href={contactHref}>Free initial consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Who are we?
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              We’re a team of SEO strategists, technical specialists, and content
              experts focused on sustainable growth.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What we do</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We build visibility that brings qualified traffic — and turn
                that traffic into leads and sales.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Our philosophy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Rankings matter, but conversions matter more. SEO should pay for
                itself.
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href={contactHref}>Book the free consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
