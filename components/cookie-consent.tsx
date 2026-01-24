"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const CONSENT_STORAGE_KEY = "cookie-consent"
const CONSENT_COOKIE_KEY = "cookie_consent"
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365

type ConsentDecision = "accept" | "reject" | "custom"

type CookiePreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

type ConsentState = {
  decision: ConsentDecision
  preferences: CookiePreferences
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

const focusableSelector =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"

const readCookieValue = (key: string) => {
  if (typeof document === "undefined") return null
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`))
  return value ? decodeURIComponent(value.split("=")[1]) : null
}

const writeConsentCookie = (value: string) => {
  document.cookie = `${CONSENT_COOKIE_KEY}=${encodeURIComponent(
    value
  )}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax`
}

export const CookieConsent = () => {
  const [decision, setDecision] = useState<ConsentDecision | null>(null)
  const [preferences, setPreferences] = useState<CookiePreferences>(
    defaultPreferences
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expanded, setExpanded] = useState<
    "necessary" | "analytics" | "marketing"
  >("necessary")
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const hasDecision = decision !== null
  const shouldShowBanner = !hasDecision && !isModalOpen

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ConsentState
        if (parsed?.decision) {
          setDecision(parsed.decision)
          setPreferences(parsed.preferences ?? defaultPreferences)
          return
        }
      } catch (error) {
        console.warn("Unable to parse consent preferences", error)
      }
    }

    const cookieValue = readCookieValue(CONSENT_COOKIE_KEY)
    if (cookieValue) {
      setDecision("custom")
      setPreferences({
        ...defaultPreferences,
        analytics: cookieValue.includes("analytics"),
        marketing: cookieValue.includes("marketing"),
      })
    }
  }, [])

  useEffect(() => {
    if (!isModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
      }

      if (event.key !== "Tab" || !modalRef.current) return

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen])

  const saveConsent = (nextPreferences: CookiePreferences, nextDecision: ConsentDecision) => {
    const nextState: ConsentState = {
      decision: nextDecision,
      preferences: nextPreferences,
    }

    setDecision(nextDecision)
    setPreferences(nextPreferences)
    setIsModalOpen(false)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextState))
    }

    const cookieValue = [
      nextPreferences.analytics ? "analytics" : null,
      nextPreferences.marketing ? "marketing" : null,
    ]
      .filter(Boolean)
      .join(",")

    writeConsentCookie(cookieValue || "necessary")
  }

  const handleRejectAll = () => {
    saveConsent(
      {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      "reject"
    )
  }

  const handleAcceptAll = () => {
    saveConsent(
      {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      "accept"
    )
  }

  const handleSavePreferences = () => {
    saveConsent(preferences, "custom")
  }

  const bannerActions = (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        onClick={handleRejectAll}
        className="h-10 rounded-full bg-white px-4 text-sm font-medium text-black shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Reject all
      </button>
      <button
        type="button"
        onClick={handleAcceptAll}
        className="h-10 rounded-full bg-white px-4 text-sm font-medium text-black shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Accept cookies
      </button>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        aria-label="Manage preferences"
      >
        <GearIcon className="h-5 w-5" />
      </button>
    </div>
  )

  return (
    <>
      {shouldShowBanner && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#3F4644] bg-[#0B0B0C]/95 px-5 py-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <CookieIcon className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-white/90 sm:text-sm">
                We and our partners use cookies and other technologies to
                personalize your experience, show you ads, and perform
                analytics. See our{" "}
                <Link
                  href="/legal/privacy"
                  className="font-semibold text-white underline underline-offset-2"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-white/70">
                Manage your choices anytime in settings.
              </div>
              {bannerActions}
            </div>
          </div>
        </div>
      )}

      {hasDecision && !isModalOpen && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#0B0B0C] text-white shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label="Open cookie preferences"
        >
          <CookieIcon className="h-5 w-5" />
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0B0B0C] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Close cookie preferences"
            >
              <span className="text-xl">×</span>
            </button>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2
                  id="cookie-preferences-title"
                  className="text-2xl font-semibold sm:text-3xl"
                >
                  We use cookies
                </h2>
                <p className="text-sm text-white/80">
                  We and our partners use cookies and other technologies to
                  personalize your experience, show you ads, and perform
                  analytics. See our{" "}
                  <Link
                    href="/legal/privacy"
                    className="font-semibold text-white underline underline-offset-2"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>

              <p className="text-xs uppercase tracking-wide text-white/60">
                Save your preferences to close:
              </p>

              <div className="rounded-2xl bg-[#27272A] p-4">
                <p className="text-xs font-semibold text-white/70">You allow:</p>

                <div className="mt-4 space-y-4">
                  <ConsentRow
                    title="Necessary"
                    description="Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences."
                    expanded={expanded === "necessary"}
                    onToggleExpand={() =>
                      setExpanded(expanded === "necessary" ? "analytics" : "necessary")
                    }
                    required
                    toggleOn
                    toggleDisabled
                  />

                  <ConsentRow
                    title="Performance & analytics"
                    expanded={expanded === "analytics"}
                    onToggleExpand={() =>
                      setExpanded(expanded === "analytics" ? "marketing" : "analytics")
                    }
                    toggleOn={preferences.analytics}
                    onToggle={() =>
                      setPreferences((current) => ({
                        ...current,
                        analytics: !current.analytics,
                      }))
                    }
                  />

                  <ConsentRow
                    title="Marketing & Advertising"
                    expanded={expanded === "marketing"}
                    onToggleExpand={() =>
                      setExpanded(expanded === "marketing" ? "analytics" : "marketing")
                    }
                    toggleOn={preferences.marketing}
                    onToggle={() =>
                      setPreferences((current) => ({
                        ...current,
                        marketing: !current.marketing,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="h-11 w-full rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
                >
                  Accept cookies
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="h-11 w-full rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
                >
                  Save preferences
                </button>
              </div>
            </div>

            <div className="absolute -bottom-5 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0B0B0C] shadow-lg">
              <CookieIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

type ConsentRowProps = {
  title: string
  description?: string
  expanded: boolean
  onToggleExpand: () => void
  required?: boolean
  toggleOn: boolean
  toggleDisabled?: boolean
  onToggle?: () => void
}

const ConsentRow = ({
  title,
  description,
  expanded,
  onToggleExpand,
  required = false,
  toggleOn,
  toggleDisabled = false,
  onToggle,
}: ConsentRowProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-3 text-left"
          aria-expanded={expanded}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white">
            {expanded ? "−" : "+"}
          </span>
          <span className="text-sm font-semibold text-white">
            {title}
            {required && (
              <span className="ml-2 rounded-full bg-[#1E3A2E] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#22C55E]">
                Required
              </span>
            )}
          </span>
        </button>
        <ToggleSwitch
          checked={toggleOn}
          disabled={toggleDisabled}
          onToggle={onToggle}
        />
      </div>
      {expanded && description && (
        <p className="text-xs text-white/70">{description}</p>
      )}
      <div className="h-px w-full bg-white/10" />
    </div>
  )
}

type ToggleSwitchProps = {
  checked: boolean
  disabled?: boolean
  onToggle?: () => void
}

const ToggleSwitch = ({ checked, disabled, onToggle }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={() => {
        if (disabled) return
        onToggle?.()
      }}
      className={`relative h-7 w-12 rounded-full border border-white/20 transition ${
        checked ? "bg-[#248D4B]" : "bg-white/20"
      } ${disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

type IconProps = {
  className?: string
}

const CookieIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 2.25c.45 0 .9.03 1.34.09a1 1 0 01.66 1.5 3.5 3.5 0 004.26 4.86 1 1 0 011.27.8c.08.43.12.86.12 1.31a8 8 0 11-7.65-7.96z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <circle cx="14" cy="13" r="1.6" />
    <circle cx="9.5" cy="15.5" r="1.2" />
  </svg>
)

const GearIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M19.14 12.94a7.41 7.41 0 000-1.88l2.03-1.58a.5.5 0 00.12-.65l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.47 7.47 0 00-1.62-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.57.22-1.11.52-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.7 8.83a.5.5 0 00.12.65l2.03 1.58a7.41 7.41 0 000 1.88L2.82 14.52a.5.5 0 00-.12.65l1.92 3.32a.5.5 0 00.61.22l2.39-.96c.5.4 1.05.72 1.62.94l.36 2.54a.5.5 0 00.5.42h3.84a.5.5 0 00.5-.42l.36-2.54c.57-.22 1.11-.52 1.62-.94l2.39.96a.5.5 0 00.61-.22l1.92-3.32a.5.5 0 00-.12-.65l-2.03-1.58zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
  </svg>
)
