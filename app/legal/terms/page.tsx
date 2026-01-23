import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service | MatterCall",
  description: "The conditions users agree to when using MatterCall.",
  alternates: {
    canonical: "/legal/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section>
        <Container className="max-w-3xl">
          <h1 className={cn(heroHeadingClass, "text-neutral-900")}>Terms of Service</h1>
          <p className={cn(heroBodyClass, "mt-4")}>
            These terms outline the rules, responsibilities, and expectations for
            using MatterCall. A full legal document will be published here soon.
          </p>
        </Container>
      </Section>
    </main>
  );
}
