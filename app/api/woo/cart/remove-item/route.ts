import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function storeApiUrl(storeUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1/${path}`, storeUrl).toString();
}

export async function POST(request: Request) {
  const storeUrl = process.env.WC_STORE_URL;
  if (!storeUrl) {
    return NextResponse.json({ message: "WC_STORE_URL is not set" }, { status: 500 });
  }

  const body = (await request.json()) as { key?: string };

  // Woo "remove-item" expects the cart item key
  const key = body.key;
  if (!key) {
    return NextResponse.json({ message: "Missing cart item key" }, { status: 400 });
  }

  const cookieStore = await cookies();

  let cartToken =
    request.headers.get("cart-token") ||
    cookieStore.get("wc_cart_token")?.value ||
    null;

  // If we don't have a token yet, fetch one
  if (!cartToken) {
    const cartRes = await fetch(storeApiUrl(storeUrl, "cart"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    cartToken = cartRes.headers.get("Cart-Token");
  }

  const wooRes = await fetch(storeApiUrl(storeUrl, "cart/remove-item"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    },
    body: JSON.stringify({ key }),
  });

  const data = await wooRes.json().catch(() => null);

  const res = NextResponse.json(
    wooRes.ok ? data : { message: data?.message || "Failed to remove item" },
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
