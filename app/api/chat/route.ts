import { NextResponse } from "next/server";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type ChatPayload = {
  title?: string;
  content?: string;
  sender?: {
    first_name?: string;
    email?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatPayload;

    const title = body.title?.trim();
    const content = body.content?.trim();
    const firstName = body.sender?.first_name?.trim() ?? "";
    const email = body.sender?.email?.trim();

    if (!title) {
      return NextResponse.json(
        { error: "Ticket title is required." },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Ticket content is required." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid customer email is required." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.CHAT_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("CHAT_WEBHOOK_URL is not configured");
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
        title,
        content,
        sender: {
          first_name: firstName,
          email,
        },
      }),
    });

    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text().catch(() => "");
      console.error("Chat webhook request failed", {
        status: webhookResponse.status,
        responseText,
      });

      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chat API request failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
