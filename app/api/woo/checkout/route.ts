import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function storeApiUrl(storeUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1/${path}`, storeUrl).toString();
}

type AnyObj = Record<string, any>;

function asObject(value: unknown): AnyObj {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as AnyObj;
  if (typeof value === "string") {
    // Sometimes clients send JSON strings by mistake
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as AnyObj;
    } catch {}
  }
  return {};
}

function normalizeAddress(input: AnyObj) {
  // Accept snake_case or common camelCase keys
  return {
    first_name: input.first_name ?? input.firstName ?? "",
    last_name: input.last_name ?? input.lastName ?? "",
    company: input.company ?? "",
    address_1: input.address_1 ?? input.address1 ?? "",
    address_2: input.address_2 ?? input.address2 ?? "",
    city: input.city ?? "",
    state: input.state ?? "",
    postcode: input.postcode ?? input.postalCode ?? input.zip ?? "",
    country: input.country ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
  };
}

function stripContactFieldsForShipping(billing: ReturnType<typeof normalizeAddress>) {
  // shipping_address in Woo docs doesn't include email/phone in examples
  const { email, phone, ...shipping } = billing;
  return shipping;
}

export async function POST(request: Request) {
  const storeUrl = process.env.WC_STORE_URL;
  if (!storeUrl) {
    return NextResponse.json({ message: "WC_STORE_URL is not set" }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as AnyObj;

  const payment_method = body.payment_method;
  if (!payment_method || typeof payment_method !== "string") {
    return NextResponse.json({ message: "Missing payment_method" }, { status: 400 });
  }

  // Read Cart-Token from header/cookie; if missing, fetch one from GET /cart
  const cookieStore = await cookies();
  let cartToken =
    request.headers.get("cart-token") ||
    cookieStore.get("wc_cart_token")?.value ||
    null;

  if (!cartToken) {
    const cartRes = await fetch(storeApiUrl(storeUrl, "cart"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    cartToken = cartRes.headers.get("Cart-Token");
  }

  // Build billing/shipping objects, even if user didn’t provide them (digital-only UI)
  const billingInput = asObject(body.billing_address ?? body.billingAddress);
  const billing = normalizeAddress(billingInput);

  // If you only collect email for digital: ensure at least billing.email is present
  // (Woo/payment gateways may still require other fields depending on your store settings)
  if (!billing.email && typeof body.email === "string") billing.email = body.email;

  const shippingInput = asObject(body.shipping_address ?? body.shippingAddress);
  const shipping =
    Object.keys(shippingInput).length > 0
      ? normalizeAddress(shippingInput)
      : stripContactFieldsForShipping(billing); // copy billing -> shipping

  const wooRes = await fetch(storeApiUrl(storeUrl, "checkout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    },
    body: JSON.stringify({
      billing_address: billing,
      shipping_address: shipping,
      customer_note: typeof body.customer_note === "string" ? body.customer_note : "",
      payment_method,
      payment_data: Array.isArray(body.payment_data) ? body.payment_data : [],
    }),
  });

  const data = await wooRes.json().catch(() => null);

  const res = NextResponse.json(
    wooRes.ok ? data : { message: data?.message || "Checkout failed", raw: data },
    { status: wooRes.status }
  );

  // Persist/refresh Cart-Token
  const newCartToken = wooRes.headers.get("Cart-Token") || cartToken;
  if (newCartToken) {
    res.cookies.set("wc_cart_token", newCartToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    res.headers.set("Cart-Token", newCartToken);
  }

  return res;
}
