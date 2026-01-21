import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

type StripeEventData = Stripe.Event["data"]["object"];

async function markPaymentSuccessful(event: Stripe.Event) {
  const payload = event.data.object as StripeEventData;
  console.log("Stripe payment succeeded", {
    eventType: event.type,
    objectId: payload.id,
    amount:
      "amount_total" in payload
        ? payload.amount_total
        : "amount" in payload
        ? payload.amount
        : undefined,
    customer:
      "customer" in payload && typeof payload.customer === "string"
        ? payload.customer
        : undefined,
  });

  // TODO: Replace this with your own DB update or business logic.
  return;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature header." },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded":
    case "charge.succeeded":
      await markPaymentSuccessful(event);
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
