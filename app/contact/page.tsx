"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const initialFormValues: FormValues = {
  name: "",
  email: "",
  message: "",
};

const faqItems = [
  {
    question: "How fast will I get a response?",
    answer: "We typically respond within 6 hours on business days.",
  },
  {
    question: "What information should I include in my message?",
    answer: "Goals, timeline, budget range, and any links/examples.",
  },
  {
    question: "Do you offer a free consultation?",
    answer: "Yes, a 15–30 minute intro call to understand your needs.",
  },
  {
    question: "What services do you provide?",
    answer: "Website design, UX/UI, strategy, content, and ongoing support.",
  },
  {
    question: "Can you work with my existing website/design?",
    answer: "Yes, we can improve, redesign, or iterate on existing work.",
  },
  {
    question: "Do you work with international clients and different time zones?",
    answer: "Yes, remote-friendly with flexible scheduling.",
  },
];

const commonQuestions = [
  {
    question: "What’s the typical project timeline?",
    answer: "Most projects take 2–6 weeks depending on scope.",
  },
  {
    question: "How do pricing and budgets work?",
    answer: "Fixed-price for defined scope; hourly/retainer for ongoing work.",
  },
  {
    question: "What’s your revision policy?",
    answer: "Includes 2–3 revision rounds (depending on package).",
  },
  {
    question: "How do we communicate?",
    answer: "Email + Slack/WhatsApp optional; weekly check-ins if needed.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes, maintenance and updates via monthly support plans.",
  },
  {
    question: "What files/deliverables will I receive?",
    answer:
      "Final designs/assets + handoff notes; code handoff if applicable.",
  },
];

const FaqList = ({
  items,
}: {
  items: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-6 divide-y divide-neutral-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between text-left text-base font-medium text-neutral-900"
              aria-expanded={isOpen}
            >
              {item.question}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 transition-transform ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="mt-3 font-sans text-[14px] text-[color:var(--color-neutral-600)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function ContactPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const title = useMemo(() => {
    const normalizedName = formValues.name.trim();
    const normalizedEmail = formValues.email.trim();

    if (normalizedName) {
      return `Website chat request from ${normalizedName}`;
    }

    if (normalizedEmail) {
      return `Website chat request from ${normalizedEmail}`;
    }

    return "Website chat request";
  }, [formValues.email, formValues.name]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (values: FormValues) => {
    const validationErrors: FieldErrors = {};

    if (!values.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!values.message.trim()) {
      validationErrors.message = "Message is required.";
    }

    return validationErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: formValues.message.trim(),
          sender: {
            first_name: formValues.name.trim(),
            email: formValues.email.trim(),
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "We could not start the chat. Please try again.");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent. We will get back to you shortly.",
      });
      setFormValues(initialFormValues);
      setErrors({});
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white">
      <section
        className="relative min-h-[40vh] w-full overflow-hidden bg-black"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(26,6,14,0.98) 0%, rgba(10,16,38,0.95) 48%, rgba(4,5,8,1) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-20 text-center text-white sm:py-24">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Start a chat with our team
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Send your details and message below and we&apos;ll follow up shortly.
          </p>
        </div>
      </section>

      <section className="relative -mt-16 pb-20 sm:-mt-20">
        <Card className="mx-auto w-[92%] max-w-3xl rounded-3xl border border-neutral-200 bg-white shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Start Chat</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Fields marked with * are required.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jane"
                  value={formValues.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email ? (
                  <p id="contact-email-error" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help?"
                  className="min-h-[160px] resize-y"
                  value={formValues.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message ? (
                  <p id="contact-message-error" className="text-xs text-destructive">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {status ? (
                <p
                  className={`rounded-md px-3 py-2 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-destructive/10 text-destructive"
                  }`}
                  role="status"
                >
                  {status.message}
                </p>
              ) : null}

              <Button className="h-12 w-full rounded-lg" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending..." : "Start Chat"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="faq-section">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-neutral-900">FAQs</h2>
          <FaqList items={faqItems} />
        </div>
      </section>

      <section className="faq-section">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-neutral-900">Common Questions</h2>
          <FaqList items={commonQuestions} />
        </div>
      </section>
    </main>
  );
}
