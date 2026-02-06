"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

interface BookingModalContextValue {
  openBookingModal: (trigger?: HTMLElement | null) => void;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface BookingModalProviderProps {
  bookingUrl?: string;
  children: ReactNode;
}

export function BookingModalProvider({
  bookingUrl,
  children,
}: BookingModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [embeddingBlocked, setEmbeddingBlocked] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const embedTimeoutRef = useRef<number | null>(null);

  const clearEmbedTimeout = useCallback(() => {
    if (embedTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(embedTimeoutRef.current);
    embedTimeoutRef.current = null;
  }, []);

  const closeModal = useCallback(() => {
    clearEmbedTimeout();
    setIsOpen(false);
    setEmbeddingBlocked(false);
    setIsLoading(false);
    triggerRef.current?.focus();
  }, [clearEmbedTimeout]);

  const openBookingModal = useCallback(
    (trigger?: HTMLElement | null) => {
      triggerRef.current = trigger ?? null;
      setEmbeddingBlocked(false);
      setIsLoading(Boolean(bookingUrl));
      setIsOpen(true);
    },
    [bookingUrl]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalElement = modalRef.current;
      if (!modalElement) {
        return;
      }

      const focusable = Array.from(
        modalElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR
    );
    focusable?.[0]?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!isOpen || !bookingUrl) {
      clearEmbedTimeout();
      return;
    }

    clearEmbedTimeout();
    embedTimeoutRef.current = window.setTimeout(() => {
      setEmbeddingBlocked(true);
      setIsLoading(false);
    }, 7000);

    return () => {
      clearEmbedTimeout();
    };
  }, [clearEmbedTimeout, isOpen, bookingUrl]);

  const value = useMemo(() => ({ openBookingModal }), [openBookingModal]);

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-2 sm:p-4"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="flex h-[98vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-auto sm:max-h-[88vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
              <h2 id="booking-modal-title" className="text-lg font-semibold text-slate-900">
                Book a Growth Call
              </h2>
              <button
                type="button"
                aria-label="Close booking modal"
                onClick={closeModal}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!bookingUrl ? (
              <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-600">
                Booking link not configured.
              </div>
            ) : embeddingBlocked ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-slate-600">
                  The booking page cannot be embedded here.
                </p>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
                >
                  Open booking page
                </a>
              </div>
            ) : (
              <div className="relative flex-1 bg-slate-50">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                    Loading booking page…
                  </div>
                ) : null}
                <iframe
                  title="Book a Growth Call"
                  src={bookingUrl}
                  className="h-full min-h-[60vh] w-full border-0"
                  onLoad={() => {
                    clearEmbedTimeout();
                    setIsLoading(false);
                    setEmbeddingBlocked(false);
                  }}
                  onError={() => {
                    clearEmbedTimeout();
                    setIsLoading(false);
                    setEmbeddingBlocked(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);

  if (!context) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }

  return context;
}
