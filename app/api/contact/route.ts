import { NextResponse } from "next/server"

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"

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
  } catch (error) {
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

  const apiKey = process.env.BREVO_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  const fromName = process.env.CONTACT_FROM_NAME || "Website"

  if (!apiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      { ok: false, error: "Email service is not configured." },
      { status: 500 }
    )
  }

  const textContent = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n")

  const htmlContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br />")}</p>
  `

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: [{ email: toEmail }],
      replyTo: { email, name },
      subject: `New contact form submission from ${name}`,
      textContent,
      htmlContent,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json(
      {
        ok: false,
        error: errorText || "Failed to send message.",
      },
      { status: response.status >= 400 && response.status < 500 ? response.status : 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
