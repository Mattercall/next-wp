import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Service Terms | MatterCall",
  description: "Conditions for organizations using MatterCall services.",
  alternates: {
    canonical: "/legal/service-terms",
  },
};

export default function ServiceTermsPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section>
        <Container className="max-w-3xl">
          <h1 className={cn(heroHeadingClass, "text-neutral-900")}>
            Service Terms
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>
            This page will include the legal terms that apply to organizations
            using MatterCall services. Detailed terms will be available soon.
          </p>
        </Container>
      </Section>
    </main>
  );
}
