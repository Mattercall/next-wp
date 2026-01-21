import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThankYouOrderPageProps = {
  searchParams?: Promise<{
    orderId?: string | string[];
    date?: string | string[];
    email?: string | string[];
    paymentMethod?: string | string[];
  }>;
};

const resolveValue = (
  value: string | string[] | undefined,
  fallback = "—"
) => {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value?.trim() ? value : fallback;
};

export default async function ThankYouOrderPage({
  searchParams,
}: ThankYouOrderPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const orderId = resolveValue(resolvedSearchParams.orderId, "Pending");
  const orderDate = resolveValue(resolvedSearchParams.date, "Processing");
  const email = resolveValue(resolvedSearchParams.email, "On file");
  const paymentMethod = resolveValue(
    resolvedSearchParams.paymentMethod,
    "On file"
  );

  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold text-neutral-900 sm:text-4xl">
          Thank you — your order has been placed.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
          We&apos;ve received your order and it&apos;s now being confirmed. A
          confirmation email will arrive shortly with your receipt and next
          steps. Most orders are reviewed within one business day.
        </p>

        <section className="mt-10 w-full rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Order status
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Confirmed
              </div>
            </div>
            <div className="text-right text-sm text-neutral-500">
              <p>Need help? Contact support.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Order ID
              </p>
              <p className="mt-2 text-base font-medium text-neutral-900">
                {orderId}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Date
              </p>
              <p className="mt-2 text-base font-medium text-neutral-900">
                {orderDate}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Email
              </p>
              <p className="mt-2 text-base font-medium text-neutral-900">
                {email}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Payment method
              </p>
              <p className="mt-2 text-base font-medium text-neutral-900">
                {paymentMethod}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="h-11 rounded-lg px-6">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
