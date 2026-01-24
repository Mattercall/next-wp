import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MatterCall — Service Terms (Digital Products & Services)",
  description:
    "Service terms governing purchases of MatterCall digital products and services.",
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
            MatterCall — Service Terms (Digital Products &amp; Services)
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>Last updated: [DATE]</p>
          <div className="mt-3 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">MatterCall</p>
            <p>Radelandstraße 38, 13589 Berlin, Germany</p>
            <p>privacy@mattercall.com</p>
          </div>

          <div className="mt-10 space-y-8 text-base leading-7 text-neutral-700">
            <section className="space-y-4">
              <p>
                These Service Terms apply to purchases of MatterCall digital
                products and services ("Offerings"). They supplement the MatterCall
                Terms of Use. If there is a conflict, these Service Terms control
                for the specific Offering, and the Payments, Billing &amp; Refunds
                Policy governs payment-related matters.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Scope</h2>
              <p>
                These Service Terms govern the order, delivery, and support of
                Offerings purchased through the Services, including one-time
                digital products, subscriptions, and scheduled services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Descriptions and Delivery
              </h2>
              <p>
                We describe each Offering on its listing page. Delivery may occur
                by immediate download, account access, email delivery, or scheduled
                service performance. If delivery timing is specified, we will use
                reasonable efforts to deliver in that timeframe.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Customer Responsibilities
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide accurate and complete order and contact information.</li>
                <li>Cooperate with reasonable requests needed to perform services.</li>
                <li>
                  Ensure you have the technical requirements to access or receive
                  the Offering.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Availability, Maintenance, and Support
              </h2>
              <p>
                We may perform maintenance or updates to improve security, comply
                with legal requirements, or enhance performance. Support scope and
                response times, if offered, are described on the applicable listing
                page or order confirmation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Subscriptions (If Applicable)
              </h2>
              <p>
                Subscription Offerings renew automatically at the stated billing
                interval unless canceled before the renewal date. Cancellation is
                effective at the end of the current billing cycle unless applicable
                law requires otherwise. Access continues through the paid period.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                14-Day Money-Back Guarantee
              </h2>
              <p>
                <strong>
                  MatterCall offers a 14-day money-back guarantee on digital
                  products and also if the service is not delivered as described
                  on the service listing page.
                </strong>
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Request a refund by emailing privacy@mattercall.com within 14
                  days of purchase, including your order details and the reason
                  for the request.
                </li>
                <li>
                  Approved refunds will be issued to the original payment method.
                </li>
                <li>
                  We may decline or limit refunds in cases of suspected fraud,
                  abuse, or repeated refund requests inconsistent with the purpose
                  of this guarantee, subject to applicable law.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                EU Consumer Withdrawal Rights
              </h2>
              <p>
                If you are a consumer in the EU, you may have statutory withdrawal
                rights. For digital content or services, the right of withdrawal
                can be affected once performance begins (for example, when
                download starts or account access is granted), where permitted by
                law and after any required consent and acknowledgment. These
                Service Terms do not limit mandatory consumer rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Changes to Offerings
              </h2>
              <p>
                We may update Offerings to improve security, compliance, or
                functionality. If an update materially reduces core features of an
                Offering you have purchased, we will provide reasonable remedies
                required by law, which may include access to a prior version,
                substitution, or a proportionate refund.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Termination for Breach
              </h2>
              <p>
                We may suspend or terminate access to an Offering if you materially
                breach these Service Terms or the Terms of Use, after providing
                notice where required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Contact</h2>
              <p>
                For questions about these Service Terms or to request a refund,
                contact privacy@mattercall.com.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
