import { NextResponse } from "next/server";

const storeUrl = process.env.WC_STORE_URL;

if (!storeUrl) {
  throw new Error("WC_STORE_URL is not set");
}

function buildStoreUrl(path: string, cartKey?: string | null) {
  const url = new URL(`/wp-json/wc/store/v1/${path}`, storeUrl);
  if (cartKey) {
    url.searchParams.set("cart_key", cartKey);
  }
  return url.toString();
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cartKey } = body as { cartKey?: string };

  const response = await fetch(buildStoreUrl("cart/clear", cartKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to clear cart" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: response.status });
}
