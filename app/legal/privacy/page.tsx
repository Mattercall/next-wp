import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MatterCall — Privacy Policy (GDPR)",
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
            MatterCall — Privacy Policy (GDPR)
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>Last updated: [DATE]</p>
          <div className="mt-3 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">MatterCall</p>
            <p>Radelandstraße 38, 13589 Berlin, Germany</p>
            <p>privacy@mattercall.com</p>
          </div>

          <div className="mt-10 space-y-8 text-base leading-7 text-neutral-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Data Controller
              </h2>
              <p>
                MatterCall is the data controller for personal data processed under
                this Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                What Data We Collect
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Account data:</strong> name, username, password hash, and
                  account preferences.
                </li>
                <li>
                  <strong>Contact data:</strong> email address, phone number, and
                  communications with us.
                </li>
                <li>
                  <strong>Transaction metadata:</strong> order IDs, invoice data,
                  timestamps, and status. Payment card details are handled by
                  third-party payment processors, not stored by MatterCall.
                </li>
                <li>
                  <strong>Usage, device, and log data:</strong> IP address, device
                  identifiers, browser type, pages viewed, and diagnostic logs.
                </li>
                <li>
                  <strong>Cookies and similar technologies:</strong> identifiers and
                  preferences stored on your device.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Purposes and Legal Bases
              </h2>
              <p>We process personal data for the following purposes:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Provide the Services</strong> (Art. 6(1)(b) GDPR),
                  including account management, delivery of Offerings, and support.
                </li>
                <li>
                  <strong>Compliance with legal obligations</strong> (Art. 6(1)(c)
                  GDPR), such as tax and accounting requirements.
                </li>
                <li>
                  <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR), such as
                  improving the Services, preventing abuse, and ensuring security.
                </li>
                <li>
                  <strong>Consent</strong> (Art. 6(1)(a) GDPR) for optional cookies,
                  analytics, or marketing where required by law.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Cookies and Tracking
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Essential cookies:</strong> required for the Services to
                  function, such as authentication and security features.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> may be used to understand
                  usage trends and improve performance, subject to consent where
                  required.
                </li>
                <li>
                  <strong>Advertising cookies:</strong> Google Ads and
                  Facebook/Meta ads may be used for conversion measurement and
                  remarketing, subject to consent where required.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Cloudflare
              </h2>
              <p>
                We use Cloudflare as a content delivery network (CDN) and security
                provider. Cloudflare may process IP addresses and request metadata
                for security, performance, and reliability purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Sharing and Recipients
              </h2>
              <p>
                We share personal data with service providers who process data on
                our behalf (processors), including hosting, analytics, and payment
                processing providers. We may also share data with advertising
                partners where you have provided consent, and with authorities or
                professional advisors where required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                International Transfers
              </h2>
              <p>
                If personal data is transferred outside the European Economic Area,
                we rely on appropriate safeguards such as adequacy decisions,
                Standard Contractual Clauses, and supplementary measures as
                required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Data Retention
              </h2>
              <p>
                We retain personal data only as long as necessary for the purposes
                described in this policy, including legal and contractual
                obligations. For example, account data is kept while your account
                is active; invoices are retained for statutory retention periods;
                and security logs are retained for a limited time to prevent abuse.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Your Rights
              </h2>
              <p>Subject to applicable law, you have the right to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Access your personal data.</li>
                <li>Rectify inaccurate or incomplete data.</li>
                <li>Request erasure of your data.</li>
                <li>Restrict processing.</li>
                <li>Object to processing based on legitimate interests.</li>
                <li>Data portability.</li>
                <li>Withdraw consent at any time where processing is based on consent.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Complaints</h2>
              <p>
                You may lodge a complaint with your local supervisory authority or
                the Berlin supervisory authority for data protection. Contacting
                us first is appreciated and may resolve concerns more quickly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Security</h2>
              <p>
                We implement appropriate technical and organizational measures to
                protect personal data. No method of transmission or storage is
                completely secure; therefore, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Children</h2>
              <p>
                The Services are not directed to children under 16. We do not
                knowingly collect personal data from children. If you believe a
                child has provided personal data, contact us so we can delete it.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. The latest
                version will always be posted on this page with the updated date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Contact</h2>
              <p>
                If you have questions about this Privacy Policy or want to exercise
                your rights, contact privacy@mattercall.com.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
