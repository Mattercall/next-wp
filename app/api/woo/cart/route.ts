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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartKey = searchParams.get("cartKey");

  const response = await fetch(buildStoreUrl("cart", cartKey), {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to fetch cart" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: response.status });
}
