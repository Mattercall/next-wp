"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  message: "",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const title = useMemo(() => {
    const normalizedName = values.name.trim();
    const normalizedEmail = values.email.trim();

    if (normalizedName) {
      return `Website chat request from ${normalizedName}`;
    }

    if (normalizedEmail) {
      return `Website chat request from ${normalizedEmail}`;
    }

    return "Website chat request";
  }, [values.name, values.email]);

  function validateForm(formValues: FormValues): FieldErrors {
    const validationErrors: FieldErrors = {};

    if (!formValues.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formValues.email.trim())) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.message.trim()) {
      validationErrors.message = "Message is required.";
    }

    return validationErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    setFeedback(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: values.message.trim(),
          sender: {
            first_name: values.name.trim(),
            email: values.email.trim(),
          },
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: payload?.error ?? "We could not start the chat. Please try again.",
        });
        return;
      }

      setValues(INITIAL_VALUES);
      setErrors({});
      setFeedback({
        type: "success",
        text: "Your message has been sent. We will get back to you shortly.",
      });
    } catch (error) {
      console.error("chat submission failed", error);
      setFeedback({
        type: "error",
        text: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
        aria-label={isOpen ? "Close chat form" : "Open chat form"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen ? (
        <div className="fixed inset-x-4 bottom-24 z-50 w-auto rounded-2xl border bg-background p-4 shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[380px]">
          <div className="mb-3">
            <h2 className="text-base font-semibold">Start a chat</h2>
            <p className="text-sm text-muted-foreground">
              Share a few details and our team will respond shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div>
              <label htmlFor="chat-name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input
                id="chat-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Jane"
              />
            </div>

            <div>
              <label htmlFor="chat-email" className="mb-1 block text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="chat-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "chat-email-error" : undefined}
              />
              {errors.email ? (
                <p id="chat-email-error" className="mt-1 text-xs text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="chat-message" className="mb-1 block text-sm font-medium">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="chat-message"
                value={values.message}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, message: event.target.value }))
                }
                className="min-h-[110px] w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="How can we help?"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "chat-message-error" : undefined}
              />
              {errors.message ? (
                <p id="chat-message-error" className="mt-1 text-xs text-destructive">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {feedback ? (
              <p
                className={`rounded-md px-3 py-2 text-sm ${
                  feedback.type === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {feedback.text}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Start Chat"}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
