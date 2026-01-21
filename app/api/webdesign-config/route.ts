import { NextResponse } from "next/server";

export async function GET() {
  const webhookUrl = process.env.WEBDESIGN_FORM_WEBHOOK?.trim();
  const checkoutUrl = process.env.WEBDESIGN_STRIPE_CHECKOUT_URL?.trim();
  const enabled = Boolean(webhookUrl && checkoutUrl);

  return NextResponse.json({ enabled });
}
