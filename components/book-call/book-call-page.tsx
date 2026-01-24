"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const ALLOWED_BOOKING_HOSTS = new Set([
  "mattercall.com",
  "www.mattercall.com",
]);

type BookingUrlCheck =
  | { isValid: true; url: string }
  | { isValid: false; reason: string };

const validateBookingUrl = (value?: string): BookingUrlCheck => {
  if (!value) {
    return { isValid: false, reason: "missing" };
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return { isValid: false, reason: "protocol" };
    }
    if (!ALLOWED_BOOKING_HOSTS.has(url.hostname)) {
      return { isValid: false, reason: "hostname" };
    }
    return { isValid: true, url: url.toString() };
  } catch {
    return { isValid: false, reason: "invalid" };
  }
};

export function BookCallPage() {
  const [isLoading, setIsLoading] = useState(true);
  const rawBookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const bookingUrlCheck = useMemo(
    () => validateBookingUrl(rawBookingUrl),
    [rawBookingUrl]
  );
  const fallbackUrl = rawBookingUrl ?? "";
  const canOpenFallback = Boolean(fallbackUrl);

  useEffect(() => {
    trackEvent("book_call_page_view");
  }, []);

  const handleOpenNewTab = () => {
    trackEvent("booking_open_new_tab");
  };

  return (
    <main className="bg-white text-neutral-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Book a call
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Book a 30-min Growth Audit
          </h1>
          <p className="max-w-2xl text-base text-neutral-600">
            Pick a time that works. We’ll send a calendar invite + reminders.
          </p>
        </div>

        {bookingUrlCheck.isValid ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              {isLoading ? (
                <div
                  className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-50 px-6 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                  <p className="text-sm font-medium text-neutral-600">
                    Loading the booking calendar…
                  </p>
                </div>
              ) : null}
              <iframe
                title="FluentBooking calendar"
                src={bookingUrlCheck.url}
                className="h-[1050px] w-full border-0 sm:h-[1020px] md:h-[780px] lg:h-[720px] xl:h-[680px]"
                onLoad={() => setIsLoading(false)}
              />
            </div>
            <div className="text-sm text-neutral-600">
              <span>Trouble seeing the calendar? </span>
              <a
                href={bookingUrlCheck.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700"
                onClick={handleOpenNewTab}
              >
                Open in a new tab
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-left">
            <h2 className="text-lg font-semibold text-neutral-900">
              Booking calendar unavailable
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              The booking link is missing or invalid. Please try again later or
              open the booking page in a new tab.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="rounded-full px-5"
                disabled={!canOpenFallback}
              >
                <a
                  href={canOpenFallback ? fallbackUrl : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={canOpenFallback ? handleOpenNewTab : undefined}
                >
                  Open booking page
                </a>
              </Button>
              {!canOpenFallback ? (
                <span className="text-xs text-neutral-500">
                  Configure NEXT_PUBLIC_BOOKING_URL to enable booking.
                </span>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
