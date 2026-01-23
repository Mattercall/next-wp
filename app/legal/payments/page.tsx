import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment Terms | MatterCall",
  description: "Terms governing payments made or received via MatterCall.",
  alternates: {
    canonical: "/legal/payments",
  },
};

export default function PaymentTermsPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section>
        <Container className="max-w-3xl">
          <h1 className={cn(heroHeadingClass, "text-neutral-900")}>
            Payment Terms
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>
            This page will cover the terms that apply to payments made or
            received through MatterCall. Detailed terms are coming soon.
          </p>
        </Container>
      </Section>
    </main>
  );
}
