import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy | MatterCall",
  description: "How MatterCall collects, uses, and protects personal data.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section>
        <Container className="max-w-3xl">
          <h1 className={cn(heroHeadingClass, "text-neutral-900")}>
            Privacy Policy
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>
            We will share the full details about what we collect, why we collect
            it, and how we use it here. The complete policy will be available
            soon.
          </p>
        </Container>
      </Section>
    </main>
  );
}
