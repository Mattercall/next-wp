import type { Metadata } from "next";
import Link from "next/link";

import CopyReferenceButton from "./CopyReferenceButton";

type SearchParams = Record<string, string | string[] | undefined>;

type InfoRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

type StepProps = {
  title: string;
  description: string;
};

const getParam = (searchParams: SearchParams, key: string) => {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const formatReference = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.length <= 28) {
    return trimmed;
  }
  return `${trimmed.slice(0, 8)}…${trimmed.slice(-6)}`;
};

const InfoRow = ({ label, value, valueClassName }: InfoRowProps) => (
  <div className="flex flex-col gap-2 border-b border-slate-200/70 py-4 sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className={`text-sm font-semibold text-slate-900 ${valueClassName ?? ""}`}>
      {value}
    </dd>
  </div>
);

const Step = ({ title, description }: StepProps) => (
  <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
  </div>
);

export const metadata: Metadata = {
  title: "Thank you for your order",
  description:
    "Order confirmation details and next steps for your Stripe payment.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const referenceParam =
    getParam(searchParams, "client_reference_id") ||
    getParam(searchParams, "reference") ||
    getParam(searchParams, "order_ref") ||
    getParam(searchParams, "order_reference");
  const receiptUrl =
    getParam(searchParams, "receipt_url") ||
    getParam(searchParams, "receipt") ||
    getParam(searchParams, "receiptUrl");
  const sessionId = getParam(searchParams, "session_id");
  const paymentIntent = getParam(searchParams, "payment_intent");

  const displayReference = referenceParam ? formatReference(referenceParam) : "—";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Payment confirmed
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Thank you for your order
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            We have received your payment. A confirmation email is on its way, and
            our team is preparing the next steps.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Order confirmation
              </h2>
              <p className="text-sm text-slate-500">
                Keep this reference for your records or when contacting support.
              </p>
            </div>

            <dl className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-5">
              <InfoRow label="Order reference" value={displayReference} />
              <InfoRow
                label="Checkout session"
                value={sessionId ? formatReference(sessionId) : "—"}
                valueClassName="text-slate-600"
              />
              <InfoRow
                label="Payment intent"
                value={paymentIntent ? formatReference(paymentIntent) : "—"}
                valueClassName="text-slate-600"
              />
            </dl>

            <div className="flex flex-wrap items-center gap-4">
              <CopyReferenceButton reference={referenceParam ?? null} />
              {receiptUrl ? (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Download receipt
                </a>
              ) : null}
              <Link
                href="mailto:support@xyz.com"
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              What happens next
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Step
                title="Confirmation email"
                description="A receipt and summary are sent to your billing email within a few minutes."
              />
              <Step
                title="Account review"
                description="Our team validates the order and provisions access according to your plan."
              />
              <Step
                title="Kickoff resources"
                description="You will receive onboarding materials and next-step instructions."
              />
              <Step
                title="Ongoing support"
                description="Reach us anytime for questions or changes to your subscription."
              />
            </div>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Support</h2>
            <p className="text-sm text-slate-600">
              Need assistance? Our team is available during business hours.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <p className="font-medium">support@xyz.com</p>
              <p className="mt-1 text-slate-500">Mon–Fri, 9:00–18:00 ET</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              Payment processed securely by Stripe.
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Ready to continue? Head back to your workspace to review your
              account status.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Go to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
