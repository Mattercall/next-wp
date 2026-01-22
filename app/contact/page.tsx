import Image from "next/image"
import {
  Dribbble,
  Github,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const services = [
  { id: "website-design", label: "Website Design" },
  { id: "ux-design", label: "UX Design" },
  { id: "content-creation", label: "Content Creation" },
  { id: "strategy-consulting", label: "Strategy & Consulting" },
]

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Dribbble", icon: Dribbble, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
]

const clientLogos = [
  "Studio North",
  "Orbit Labs",
  "Northwind",
  "Pixelwave",
  "Lineage",
]

export default function ContactPage() {
  return (
    <div className="bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground"
            >
              Get in Touch
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect With Me 👋
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:pt-2">
            Whether you're looking for more information, have a suggestion, or
            need help with something, we're here for you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <Card className="border-border/60">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name here..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email here..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="Enter the amount"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  className="min-h-[140px]"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Services</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <Checkbox id={service.id} />
                      <Label htmlFor={service.id} className="text-sm">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
              <div className="relative w-full overflow-hidden rounded-[32px]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/contact-portrait.svg"
                    alt="Portrait of John Doe"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <Badge className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Available for Hire
                </Badge>
              </div>
              <div className="space-y-3 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 text-base">
                  <span className="font-semibold text-foreground">John Doe</span>
                  <span className="text-muted-foreground">• UI/UX Designer</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {socialLinks.map(({ label, icon: Icon, href }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      asChild
                    >
                      <a href={href} aria-label={label}>
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
                {clientLogos.map((logo) => (
                  <span key={logo}>{logo}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
