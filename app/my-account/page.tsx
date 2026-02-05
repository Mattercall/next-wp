"use client";

import { useState } from "react";
import Link from "next/link";

const accountSections = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview of your recent activity and account updates.",
  },
  {
    id: "orders",
    label: "Orders",
    description: "Track, pay for, and review your recent purchases.",
  },
  {
    id: "addresses",
    label: "Addresses",
    description: "Manage your billing and shipping addresses.",
  },
  {
    id: "details",
    label: "Account details",
    description: "Update your password and contact preferences.",
  },
];

export default function MyAccountPage() {
  const [activeSection, setActiveSection] = useState(accountSections[0].id);
  const [message, setMessage] = useState<string | null>(null);

  const activeCopy =
    accountSections.find((section) => section.id === activeSection) ??
    accountSections[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            WooCommerce Account
          </p>
          <h1 className="mt-2 text-3xl font-semibold">My account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your orders, addresses, and account details.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <aside className="rounded-3xl border border-muted/60 bg-muted/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigation
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {accountSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {section.label}
                </button>
              ))}
              <Link
                href="/shop"
                className="rounded-2xl border border-muted/60 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Continue shopping
              </Link>
            </div>
          </aside>

          <section className="space-y-6 rounded-3xl border border-muted/60 bg-background p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{activeCopy.label}</h2>
              <p className="text-sm text-muted-foreground">
                {activeCopy.description}
              </p>
            </div>

            <div className="rounded-2xl border border-muted/60 bg-muted/10 p-5 text-sm">
              <p className="font-semibold">Not signed in yet</p>
              <p className="mt-2 text-muted-foreground">
                Use the login form below to access your WooCommerce customer
                dashboard. Once signed in, your order history and saved addresses
                will appear here.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <form
                className="space-y-4 rounded-2xl border border-muted/60 bg-background p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setMessage(
                    "Login submitted. Connect your WooCommerce auth provider to enable sign-in."
                  );
                }}
              >
                <h3 className="text-base font-semibold">Login</h3>
                <label className="flex flex-col gap-1 text-sm">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Password
                  <input
                    type="password"
                    name="password"
                    required
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Sign in
                </button>
              </form>

              <form
                className="space-y-4 rounded-2xl border border-muted/60 bg-background p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  setMessage(
                    "Registration submitted. Wire up WooCommerce customer creation to enable sign-up."
                  );
                }}
              >
                <h3 className="text-base font-semibold">Register</h3>
                <label className="flex flex-col gap-1 text-sm">
                  Email
                  <input
                    type="email"
                    name="register_email"
                    required
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Password
                  <input
                    type="password"
                    name="register_password"
                    required
                    className="rounded-md border border-input bg-background px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Create account
                </button>
              </form>
            </div>

            {message ? (
              <p className="rounded-2xl border border-muted/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                {message}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
