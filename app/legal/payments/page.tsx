import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MatterCall — Payments, Billing & Refunds Policy",
  description: "Payment, billing, and refund terms for MatterCall Offerings.",
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
            MatterCall — Payments, Billing &amp; Refunds Policy
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
                This Payments, Billing &amp; Refunds Policy applies to paid
                Offerings and should be read together with the Terms of Use and
                Service Terms (Digital Products &amp; Services).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Pricing, Taxes, and VAT
              </h2>
              <p>
                Prices are shown at checkout in the applicable currency. Taxes or
                VAT may be added where required and will be displayed before you
                complete your purchase.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Payment Processing
              </h2>
              <p>
                Payments are processed by third-party payment processors. MatterCall
                does not store full payment card details; processors handle that
                data in accordance with their security standards.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Billing and Failed Payments
              </h2>
              <p>
                Charges are applied at the time of purchase or at the start of each
                subscription billing cycle, as described on the Offering page. If a
                payment fails, we may retry the charge and notify you. Access to
                paid Offerings may be suspended until payment is received.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Subscriptions
              </h2>
              <p>
                Subscriptions renew automatically unless canceled before the
                renewal date. Cancellation takes effect at the end of the current
                billing period unless applicable law requires otherwise. We do not
                guarantee prorated refunds for unused periods unless explicitly
                required by law or stated on the Offering page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Refunds</h2>
              <p>
                <strong>
                  14-day money-back guarantee for digital products and 14-day
                  money-back guarantee if a service is not delivered as described
                  on the service listing page.
                </strong>
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Request a refund by emailing privacy@mattercall.com within 14
                  days of purchase with your order details and a description of the
                  issue.
                </li>
                <li>
                  We may ask for reasonable verification to confirm the purchase
                  and eligibility for the guarantee.
                </li>
                <li>
                  Approved refunds are issued to the original payment method and
                  are typically processed within 5-10 business days, subject to
                  the payment processor&apos;s timelines.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Chargebacks and Disputes
              </h2>
              <p>
                Please contact us before initiating a chargeback so we can attempt
                to resolve the issue. We may contest chargebacks that are
                fraudulent, abusive, or inconsistent with this policy, consistent
                with applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Contact</h2>
              <p>
                If you have questions about billing or refunds, contact
                privacy@mattercall.com.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
