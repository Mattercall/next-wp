import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your payment is being confirmed.",
  alternates: {
    canonical: "/thank-you",
  },
};

type ThankYouPageProps = {
  searchParams?: Promise<{
    session_id?: string;
  }>;
};

export default async function ThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const sessionId = resolvedParams?.session_id;

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
        Payment confirmation
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold text-neutral-900">
        Thanks for your purchase!
      </h1>
      <p className="mt-4 text-base text-neutral-600">
        We&apos;ve received your payment. Your order is being finalized, and you&apos;ll
        receive a confirmation email shortly.
      </p>
      <p className="mt-6 text-sm text-neutral-500">
        Stripe webhook updates are the source of truth for payment status, so it
        may take a moment for fulfillment to complete.
      </p>
      {sessionId ? (
        <div className="mt-6 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600">
          Session ID: <span className="font-medium text-neutral-900">{sessionId}</span>
        </div>
      ) : null}
    </main>
  );
}
