"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Pin,
  Twitter,
  Youtube,
} from "lucide-react";

import { Container, Section } from "@/components/craft";

const footerColumns = [
  {
    title: "Contact",
    links: [{ label: "Contact Us", href: "/contact" }],
  },
  {
    title: "Company Info",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Blog", href: "/posts" },
    ],
  },
  {
    title: "Purchase Info",
    links: [
      { label: "Payment Methods", href: "/payment-methods" },
      { label: "Refunds & Returns Policy", href: "/refunds-returns" },
      { label: "Shipping & Delivery", href: "/shipping-delivery" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Tracking", href: "/tracking" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com", Icon: Instagram },
  { label: "Twitter/X", href: "https://x.com", Icon: Twitter },
  { label: "Pinterest", href: "https://www.pinterest.com", Icon: Pin },
  { label: "YouTube", href: "https://www.youtube.com", Icon: Youtube },
];

const paymentLogos = [
  { src: "/footer/payment-mastercard.svg", alt: "Mastercard" },
  { src: "/footer/payment-visa.svg", alt: "Visa" },
  { src: "/footer/payment-paypal.svg", alt: "PayPal" },
  { src: "/footer/payment-amex.svg", alt: "American Express" },
  { src: "/footer/payment-maestro.svg", alt: "Maestro" },
  { src: "/footer/payment-discover.svg", alt: "Discover" },
];

const trustBadges = [
  { src: "/footer/badge-secured.svg", alt: "Secured badge" },
  { src: "/footer/badge-ssl.svg", alt: "SSL Secure badge" },
];

export function Footer() {
  const baseId = useId();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Contact: false,
    "Company Info": false,
    "Purchase Info": false,
    "Customer Service": false,
    "Follow Us": true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <footer className="text-secondary dark:text-muted-foreground">
      <Section className="bg-secondary-foreground text-secondary dark:bg-muted dark:text-muted-foreground">
        <Container className="not-prose space-y-12">
          <div className="hidden md:grid grid-cols-5 gap-10">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-foreground">
                  {column.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-secondary/70 transition hover:text-secondary hover:underline underline-offset-4 dark:text-muted-foreground dark:hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-foreground">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-background/10 text-secondary transition hover:bg-background/20 hover:text-secondary dark:bg-foreground/10 dark:text-foreground dark:hover:bg-foreground/20"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-0 border-y border-secondary/30 dark:border-border/50">
            {footerColumns.map((column, index) => {
              const sectionId = `${baseId}-${column.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`;
              const buttonId = `${sectionId}-button`;
              const contentId = `${sectionId}-content`;
              const isOpen = openSections[column.title] ?? false;

              return (
                <div
                  key={column.title}
                  className="border-b border-secondary/30 dark:border-border/50 last:border-b-0"
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleSection(column.title)}
                    className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wide text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-foreground dark:text-foreground dark:focus-visible:ring-offset-muted"
                  >
                    <span>{column.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen ? (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="pb-4 text-sm"
                    >
                      <ul className="space-y-2">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-secondary/70 transition hover:text-secondary hover:underline underline-offset-4 dark:text-muted-foreground dark:hover:text-foreground"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="border-t border-secondary/30 py-4 dark:border-border/50">
              <button
                type="button"
                aria-expanded={openSections["Follow Us"] ?? false}
                onClick={() => toggleSection("Follow Us")}
                className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-wide text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-foreground dark:text-foreground dark:focus-visible:ring-offset-muted"
              >
                <span>Follow Us</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections["Follow Us"] ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openSections["Follow Us"] ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-background/10 text-secondary transition hover:bg-background/20 hover:text-secondary dark:bg-foreground/10 dark:text-foreground dark:hover:bg-foreground/20"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-secondary/30 pt-8 dark:border-border/50">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-secondary/70 dark:text-muted-foreground">
                  Payment Methods:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {paymentLogos.map((logo) => (
                    <Image
                      key={logo.alt}
                      src={logo.src}
                      alt={logo.alt}
                      width={56}
                      height={32}
                      className="h-6 w-auto"
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-secondary/70 dark:text-muted-foreground">
                  Buy With Confidence:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {trustBadges.map((badge) => (
                    <Image
                      key={badge.alt}
                      src={badge.src}
                      alt={badge.alt}
                      width={86}
                      height={32}
                      className="h-8 w-auto"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <div className="bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
        <Container className="not-prose py-6 text-center text-sm">
          <p className="mb-1">Copyright 2026. All Rights Reserved</p>
          <Link
            href="https://woo-newdavinci.alidropship.com"
            className="hover:underline underline-offset-4"
          >
            woo-newdavinci.alidropship.com
          </Link>
        </Container>
      </div>
    </footer>
  );
}
