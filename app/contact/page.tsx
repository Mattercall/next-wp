"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useState } from "react"
import { Mail, Phone, User } from "lucide-react"

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
        className="relative min-h-[70vh] w-full overflow-hidden bg-slate-900"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), linear-gradient(120deg, rgba(15,23,42,0.92), rgba(71,85,105,0.6)), radial-gradient(circle at top right, rgba(148,163,184,0.5), transparent 55%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute left-6 top-6 z-10 flex items-center gap-3 text-sm font-medium text-white sm:left-8 sm:top-8">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/80">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span>shadcn/studio</span>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center px-4 pt-24 text-center text-white sm:pt-28 lg:pt-32">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Get in touch with us for more information
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            If you need help or have a question, we&#39;re here for you
          </p>
        </div>
      </section>

      <section className="relative -mt-20 pb-20 sm:-mt-24 lg:-mt-28">
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
    </main>
  )
}
