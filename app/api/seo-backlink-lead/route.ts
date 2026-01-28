import { NextResponse } from "next/server";
import { getServiceEnvConfig } from "@/lib/service-env";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { webhookUrl, checkoutUrl } = getServiceEnvConfig("seo-backlink");

    if (!webhookUrl || !checkoutUrl) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: "service/seo-backlink",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { error: "Failed to submit your request." },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("seo backlink lead capture failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
