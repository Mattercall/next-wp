import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function storeApiUrl(storeUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1/${path}`, storeUrl).toString();
}

type AnyObj = Record<string, any>;

function normalizeAddress(input: AnyObj) {
  // Accept either snake_case or common camelCase and output Store API snake_case.
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
    billing_address: AnyObj;
    shipping_address: AnyObj;
    payment_method: string;
    customer_note?: string;
    payment_data?: Array<{ key: string; value: any }>;
  };

  const billing_address = normalizeAddress(body.billing_address ?? {});
  const shipping_address = normalizeAddress(body.shipping_address ?? {});

  // Cart-Token (same approach as your cart routes)
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

  // IMPORTANT: Store API checkout does NOT take payment_method_title or shipping_method.
  // Shipping is selected via cart endpoints; payment gateways use payment_data.
  const wooRes = await fetch(storeApiUrl(storeUrl, "checkout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    },
    body: JSON.stringify({
      billing_address,
      shipping_address,
      payment_method: body.payment_method,
      customer_note: body.customer_note ?? "",
      payment_data: body.payment_data ?? [],
    }),
  });

  const data = await wooRes.json().catch(() => null);

  const res = NextResponse.json(
    wooRes.ok ? data : { message: data?.message || "Checkout failed", raw: data },
    { status: wooRes.status }
  );

  // Keep latest token (Woo can rotate it)
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
