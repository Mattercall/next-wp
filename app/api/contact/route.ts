import { NextResponse } from "next/server"

const EMAIL_REGEX = /^\S+@\S+\.\S+$/

type ContactPayload = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export async function POST(request: Request) {
  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    )
  }

  const name = payload?.name?.trim()
  const email = payload?.email?.trim()
  const phone = payload?.phone?.trim()
  const message = payload?.message?.trim()

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400 }
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 }
    )
  }

  const webhookUrl = process.env.CHAT_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Webhook service is not configured." },
      { status: 500 }
    )
  }

  const content = [message, phone ? `\n\nPhone: ${phone}` : null]
    .filter(Boolean)
    .join("")

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Contact form submission from ${name}`,
      content,
      sender: {
        first_name: name,
        email,
      },
    }),
  })

  if (!webhookResponse.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to send your message right now. Please try again.",
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
