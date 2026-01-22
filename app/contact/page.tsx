"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useState } from "react"
import { Mail, Phone, Plus, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
}

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
]

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
]

const FaqList = ({
  items,
}: {
  items: { question: string; answer: string }[]
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mt-6 divide-y divide-neutral-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index
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
                <p className="mt-3 text-sm text-neutral-500">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ContactPage() {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      })
      const data = (await response.json()) as { ok: boolean; error?: string }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setStatus({ type: "success", message: "Message sent successfully." })
      setFormValues(initialFormValues)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send message."
      setStatus({ type: "error", message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-white">
      <section
        className="relative min-h-[58vh] w-full overflow-hidden bg-black"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(26,6,14,0.98) 0%, rgba(10,16,38,0.95) 48%, rgba(4,5,8,1) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-20 text-center text-white sm:py-24 lg:py-28">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Get in touch with us for more information
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            If you need help or have a question, we&#39;re here for you
          </p>
        </div>
      </section>

      <section className="relative -mt-24 pb-20 sm:-mt-28 lg:-mt-32">
        <Card className="mx-auto w-[92%] max-w-6xl rounded-3xl border border-neutral-200 bg-white shadow-xl">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900">
                    Say hello!
                  </h2>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your name here..."
                          className="pr-10"
                          value={formValues.name}
                          onChange={handleChange}
                        />
                        <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          placeholder="Enter your email here..."
                          className="pr-10"
                          value={formValues.email}
                          onChange={handleChange}
                        />
                        <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number here..."
                        className="pr-10"
                        value={formValues.phone}
                        onChange={handleChange}
                      />
                      <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your message"
                      className="min-h-[140px] resize-none"
                      value={formValues.message}
                      onChange={handleChange}
                    />
                  </div>

                  {status ? (
                    <p
                      className={
                        status.type === "success"
                          ? "text-sm font-medium text-green-600"
                          : "text-sm font-medium text-red-600"
                      }
                      role="status"
                    >
                      {status.message}
                    </p>
                  ) : null}

                  <Button
                    className="h-12 w-full rounded-lg bg-neutral-900 text-white hover:bg-neutral-900/90"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? "Sending..." : "Send Your Message"}
                  </Button>
                </form>
              </div>

              <div className="space-y-6 lg:col-span-5">
                <Card className="rounded-2xl border border-neutral-200 shadow-none">
                  <CardContent className="p-6 text-center sm:p-8">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Company Email/Phone
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-neutral-500">
                      <p>johndoe@gmail.com</p>
                      <p>+148 589 2001 2466</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-neutral-200 shadow-none">
                  <CardContent className="p-6 text-center sm:p-8">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Visit Our HQ
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-neutral-500">
                      <p>Office 149,</p>
                      <p>450 South Brand Brooklyn</p>
                      <p>San Diego County,</p>
                      <p>CA 91905, USA</p>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-center text-sm text-neutral-500">
                  Opening Hours 8AM - 5PM Everyday
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white pb-12 sm:pb-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-neutral-900">FAQs</h2>
          <FaqList items={faqItems} />
        </div>
      </section>

      <section className="bg-white pb-20 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-neutral-900">
            Common Questions
          </h2>
          <FaqList items={commonQuestions} />
        </div>
      </section>
    </main>
  )
}
