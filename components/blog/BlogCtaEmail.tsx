"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BLOG_CTA_WEBHOOK_URL = "{{PASTE_YOUR_WEBHOOK_URL_HERE}}";

type BlogCtaEmailProps = {
  headline: string;
  valueProp: string;
  emailLabel: string;
  emailPlaceholder: string;
  ctaText: string;
  consentText: string;
};

export function BlogCtaEmail({
  headline,
  valueProp,
  emailLabel,
  emailPlaceholder,
  ctaText,
  consentText,
}: BlogCtaEmailProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(BLOG_CTA_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "blog_post_signup",
          company: "MatterCall",
          page: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {headline}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">{valueProp}</p>
      </div>
      <form
        className="space-y-3"
        aria-label="Newsletter signup"
        onSubmit={handleSubmit}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          {emailLabel}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={emailPlaceholder}
            className="rounded-full bg-background text-foreground"
          />
          <Button
            type="submit"
            className="h-10 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-foreground hover:bg-emerald-500"
          >
            {ctaText}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{consentText}</p>
        <div className="text-xs text-muted-foreground" aria-live="polite">
          {status === "success"
            ? "Thanks! You are on the list."
            : status === "error"
              ? "Something went wrong. Please try again."
              : null}
        </div>
      </form>
    </div>
  );
}
