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

  const { key, quantity } = (await request.json()) as { key?: string; quantity?: number };

  if (!key) {
    return NextResponse.json({ message: "Missing cart item key" }, { status: 400 });
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 0) {
    return NextResponse.json({ message: "Invalid quantity" }, { status: 400 });
  }

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

  const wooRes = await fetch(storeApiUrl(storeUrl, "cart/update-item"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    },
    body: JSON.stringify({ key, quantity: qty }),
  });

  const data = await wooRes.json().catch(() => null);

  const res = NextResponse.json(
    wooRes.ok ? data : { message: data?.message || "Failed to update item" },
    { status: wooRes.status }
  );

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
