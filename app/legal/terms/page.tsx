import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { heroBodyClass, heroHeadingClass } from "@/components/marketing/cta-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MatterCall — Terms of Use",
  description: "Terms of use governing access to and use of MatterCall.",
  alternates: {
    canonical: "/legal/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-white text-neutral-900">
      <Section>
        <Container className="max-w-3xl">
          <h1 className={cn(heroHeadingClass, "text-neutral-900")}>
            MatterCall — Terms of Use
          </h1>
          <p className={cn(heroBodyClass, "mt-4")}>
            Last updated: February 2, 2026
          </p>
          <div className="mt-3 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">MatterCall</p>
            <p>Radelandstraße 38, 13589 Berlin, Germany</p>
            <p>privacy@mattercall.com</p>
            <p>https://mattercall.com/contact</p>
          </div>

          <div className="mt-10 space-y-8 text-base leading-7 text-neutral-700">
            <section className="space-y-4">
              <p>
                These Terms of Use ("Terms") govern your access to and use of
                MatterCall&apos;s websites, applications, digital products, and
                services (collectively, the "Services"). By accessing or using
                the Services, you agree to these Terms and our Privacy Policy. If
                you do not agree, you must not use the Services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Plain-English Summary
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Use the Services lawfully, keep your account secure, and respect
                  our intellectual property.
                </li>
                <li>
                  You remain responsible for your content and how you use the
                  Services.
                </li>
                <li>
                  We can change, suspend, or discontinue Services when needed, and
                  our liability is limited as permitted by law.
                </li>
                <li>
                  Paid Offerings follow additional Service Terms and the Payments,
                  Billing &amp; Refunds Policy.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Definitions</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>"Content"</strong> means any text, files, images, audio,
                  video, software, data, or other materials submitted, uploaded,
                  or made available through the Services.
                </li>
                <li>
                  <strong>"Customer"</strong> means the individual or entity that
                  purchases or subscribes to Offerings.
                </li>
                <li>
                  <strong>"Offerings"</strong> means our digital products,
                  subscriptions, and professional services described on the
                  Services.
                </li>
                <li>
                  <strong>"Services"</strong> means the MatterCall website, apps,
                  and related features, including Offerings.
                </li>
                <li>
                  <strong>"User"</strong> (or "you") means any individual or
                  entity accessing or using the Services.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Eligibility and Authority
              </h2>
              <p>
                You must be at least 18 years old (or the age of majority in your
                jurisdiction) to use the Services. If you use the Services on
                behalf of a company or other organization, you represent that you
                have the authority to bind that entity to these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Account Registration and Security
              </h2>
              <p>
                You must provide accurate, complete, and up-to-date information.
                You are responsible for maintaining the confidentiality of your
                credentials and for all activity under your account. Notify us
                promptly of any unauthorized access or security breach.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Acceptable Use
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Use the Services for any unlawful, fraudulent, or abusive purpose.</li>
                <li>
                  Interfere with, disrupt, or attempt to gain unauthorized access
                  to the Services or related systems.
                </li>
                <li>
                  Reverse engineer, decompile, or attempt to extract source code
                  except where such restrictions are prohibited by applicable law.
                </li>
                <li>
                  Scrape, harvest, or collect data from the Services without our
                  prior written consent.
                </li>
                <li>Upload or transmit malware, harmful code, or security exploits.</li>
                <li>
                  Use the Services to infringe intellectual property or privacy
                  rights or to transmit unlawful content.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                User Content and Submissions
              </h2>
              <p>
                You retain ownership of your Content. You are responsible for your
                Content and for ensuring that you have all rights needed to submit
                it. You grant MatterCall a worldwide, non-exclusive, royalty-free
                license to host, reproduce, display, and process your Content
                solely to provide, maintain, secure, and improve the Services, in
                accordance with the Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Intellectual Property; Limited License
              </h2>
              <p>
                The Services and all related intellectual property rights are
                owned by MatterCall or its licensors. We grant you a limited,
                non-exclusive, non-transferable, revocable license to access and
                use the Services for your internal or personal purposes in
                accordance with these Terms. Except for this license, no rights
                are granted.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Third-Party Services and Links
              </h2>
              <p>
                The Services may integrate or link to third-party services.
                MatterCall does not control those services and is not responsible
                for their content, availability, or practices. Your use of third-
                party services is at your own risk and subject to their terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Availability and Changes
              </h2>
              <p>
                We may modify, suspend, or discontinue any part of the Services at
                any time for operational, security, legal, or business reasons.
                We will use reasonable efforts to notify you of material changes
                where required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Disclaimers</h2>
              <p>
                The Services are provided <strong>"as is"</strong> and
                <strong> "as available"</strong>, without warranties of any kind,
                express or implied, to the maximum extent permitted by law.
                MatterCall does not warrant that the Services will be
                uninterrupted, error-free, or secure, nor that any Content will be
                accurate, complete, or reliable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, MatterCall and its
                affiliates, directors, employees, and agents shall not be liable
                for indirect, incidental, special, consequential, or punitive
                damages, or for loss of profits, revenue, data, or goodwill,
                arising out of or related to your use of the Services.
              </p>
              <p>
                For simple negligence, our liability is limited to foreseeable,
                typical damages arising from a breach of a material contractual
                obligation ("cardinal duty"). Nothing in these Terms limits or
                excludes liability for intent, gross negligence, death or bodily
                injury, liability under the German Product Liability Act, or other
                mandatory liability that cannot be limited under applicable law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Indemnity</h2>
              <p>
                To the extent permitted by law, you agree to indemnify and hold
                harmless MatterCall from claims, damages, liabilities, and costs
                arising from your misuse of the Services or violation of these
                Terms, except where such liability is caused by MatterCall.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Suspension and Termination
              </h2>
              <p>
                MatterCall may suspend or terminate your access to the Services if
                you violate these Terms, if payment is overdue, or if required for
                security, legal, or operational reasons. You may stop using the
                Services at any time. Sections that by their nature should survive
                termination will remain in effect.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Related Terms
              </h2>
              <p>
                Additional terms may apply to specific Offerings, including the
                Service Terms (Digital Products &amp; Services) and the Payments,
                Billing &amp; Refunds Policy. In case of conflict, those terms
                govern the specific Offering. Please review the Privacy Policy to
                understand how we process personal data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Changes to These Terms
              </h2>
              <p>
                We may update these Terms from time to time for legal, regulatory,
                or business reasons. We will indicate the latest update date above
                and provide notice of material changes where required by law.
                Continued use of the Services after the effective date constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms are governed by the laws of Germany. Exclusive
                jurisdiction is the courts of Berlin, Germany, unless mandatory
                consumer protection laws provide otherwise. If you are a consumer
                in the EU, you retain any mandatory rights under the laws of your
                country of residence.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Miscellaneous</h2>
              <p>
                If any provision of these Terms is held invalid or unenforceable,
                the remaining provisions will remain in full force. You may not
                assign these Terms without our prior written consent; MatterCall
                may assign these Terms as part of a merger, acquisition, or sale
                of assets. These Terms and the referenced policies constitute the
                entire agreement between you and MatterCall regarding the
                Services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Contact</h2>
              <p>
                If you have questions about these Terms, contact us at
                https://mattercall.com/contact or privacy@mattercall.com.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
