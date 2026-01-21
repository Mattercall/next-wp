import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import {
  CheckCircle2,
  CircleAlert,
  LifeBuoy,
  Mail,
  PackageCheck,
  ReceiptText,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import CopyReferenceButton from "./copy-reference-button";

type SearchParams = Record<string, string | string[] | undefined>;

type InfoRowProps = {
  label: string;
  value: string;
};

type StepProps = {
  title: string;
  description: string;
};

const getParam = (searchParams: SearchParams, key: string) => {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const formatReference = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.length <= 32) {
    return trimmed;
  }
  return `${trimmed.slice(0, 10)}…${trimmed.slice(-8)}`;
};

const formatCurrency = (
  amount: number | null | undefined,
  currency: string | null | undefined
) => {
  if (amount === null || amount === undefined || !currency) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

const formatPaymentStatus = (status: string | null | undefined) => {
  if (!status) {
    return "Unpaid";
  }

  return status.replace(/_/g, " ");
};

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-medium text-foreground">{value}</dd>
  </div>
);

const Step = ({ title, description }: StepProps) => (
  <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
  </div>
);

export const metadata: Metadata = {
  title: "Order confirmed",
  description:
    "Review your order confirmation details, next steps, and support options.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const sessionId = getParam(searchParams, "session_id");

  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;
  let errorMessage: string | null = null;

  if (sessionId) {
    if (!process.env.STRIPE_SECRET_KEY) {
      errorMessage =
        "We are missing payment configuration. Please contact support for help.";
    } else {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2024-06-20",
        });

        session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["customer_details", "payment_intent"],
        });

        lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
          limit: 20,
          expand: ["data.price.product"],
        });
      } catch (error) {
        errorMessage =
          "We ran into an issue loading your order details. Please refresh or contact support.";
      }
    }
  }

  const customerName = session?.customer_details?.name ?? "—";
  const customerEmail = session?.customer_details?.email ?? "—";
  const orderReference =
    session?.client_reference_id ?? session?.id ?? sessionId ?? "—";
  const paymentStatus = formatPaymentStatus(session?.payment_status);
  const totalPaid = formatCurrency(session?.amount_total ?? null, session?.currency);

  const items = lineItems?.data ?? [];
  const referenceValue = sessionId ? orderReference : null;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Order confirmed
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Thanks for your purchase
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Your payment has been processed securely. Review the order details and
              next steps below.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/ads">Continue browsing</Link>
            </Button>
          </div>
        </header>

        {!sessionId ? (
          <Alert className="bg-background">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>We need a session ID to show your order.</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                This page expects a Stripe Checkout Session ID. Update your payment
                link success URL to include:
              </p>
              <code className="block rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                https://xyz.com/ads/thank-you-order?session_id=&#123;CHECKOUT_SESSION_ID&#125;
              </code>
              <p>
                Once updated, return here after payment and we will display your
                receipt, line items, and customer details.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive" className="bg-background">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Unable to load order details</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Order details</CardTitle>
                  <CardDescription>
                    Keep this reference for your records or to contact support.
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-900">
                  {paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <dl className="space-y-4">
                <InfoRow
                  label="Order reference"
                  value={formatReference(orderReference)}
                />
                <InfoRow label="Customer" value={customerName} />
                <InfoRow label="Email" value={customerEmail} />
                <InfoRow label="Total paid" value={totalPaid} />
              </dl>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ReceiptText className="h-4 w-4 text-muted-foreground" />
                  Line items
                </div>
                {items.length ? (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const product = item.price?.product;
                      const productName =
                        typeof product === "object" && product?.name
                          ? product.name
                          : item.description ?? "Line item";
                      const lineTotal = formatCurrency(
                        item.amount_total ?? item.amount_subtotal,
                        session?.currency
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {productName}
                            </p>
                            <p className="text-muted-foreground">
                              Qty {item.quantity ?? 1}
                            </p>
                          </div>
                          <div className="font-semibold text-foreground">
                            {lineTotal}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Line items will appear once the session details are available.
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-4">
                <CopyReferenceButton reference={referenceValue} />
                <Button variant="ghost" asChild>
                  <Link href="mailto:support@xyz.com">Contact support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What happens next</CardTitle>
                <CardDescription>
                  Here is what to expect after your order is confirmed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Step
                  title="Confirmation email"
                  description="Your receipt and order summary arrive in minutes."
                />
                <Step
                  title="Account provisioning"
                  description="We review the order and enable access based on your plan."
                />
                <Step
                  title="Launch checklist"
                  description="We send setup materials and a tailored onboarding guide."
                />
                <Step
                  title="Dedicated support"
                  description="Reach out anytime for adjustments, upgrades, or questions."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>
                  We are here to help during business hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    support@xyz.com
                  </div>
                  <p className="mt-2 text-muted-foreground">Mon–Fri, 9:00–18:00 ET</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="mailto:support@xyz.com">Contact support</Link>
                </Button>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <PackageCheck className="h-4 w-4" />
                  Payments processed securely with Stripe.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LifeBuoy className="h-4 w-4" />
              Need help? Our team responds within one business day.
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/">Continue browsing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
