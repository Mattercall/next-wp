import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function storeApiUrl(storeUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1/${path}`, storeUrl).toString();
}

type AnyObj = Record<string, any>;

function toAddress(input: AnyObj) {
  // Accept snake_case or common camelCase keys and output snake_case.
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

export async function POST(request: Request) {
  const storeUrl = process.env.WC_STORE_URL;
  if (!storeUrl) {
    return NextResponse.json({ message: "WC_STORE_URL is not set" }, { status: 500 });
  }

  const body = (await request.json()) as {
    // you can make these optional in your frontend now
    billing_address?: AnyObj;
    shipping_address?: AnyObj;
    payment_method: string;
    customer_note?: string;
    payment_data?: Array<{ key: string; value: any }>;
  };

  // Build billing
  const billing = toAddress(body.billing_address ?? {});

  // For digital: copy billing -> shipping unless you explicitly pass shipping
  const shipping = toAddress(body.shipping_address ?? billing);

  // Cart token forwarding (needed for checkout endpoints too)
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

  // IMPORTANT: Store API checkout uses payment_method + payment_data
  const wooRes = await fetch(storeApiUrl(storeUrl, "checkout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    },
    body: JSON.stringify({
      billing_address: billing,
      shipping_address: shipping,
      payment_method: body.payment_method,
      payment_data: body.payment_data ?? [],
      customer_note: body.customer_note ?? "",
    }),
  });

  const data = await wooRes.json().catch(() => null);

  // Return raw error details to help you see which subfields are required
  const res = NextResponse.json(
    wooRes.ok ? data : { message: data?.message || "Checkout failed", raw: data },
    { status: wooRes.status }
  );

  // Keep latest Cart-Token
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
