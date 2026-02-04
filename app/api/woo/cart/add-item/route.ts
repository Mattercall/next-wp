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
  const { id, quantity = 1, variationId, cartKey } = body as {
    id: number;
    quantity?: number;
    variationId?: number;
    cartKey?: string;
  };
  const nonce = request.headers.get("x-wc-store-api-nonce") ?? undefined;

  const response = await fetch(buildStoreUrl("cart/add-item", cartKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(nonce ? { "X-WC-Store-API-Nonce": nonce } : {}),
    },
    body: JSON.stringify({
      id,
      quantity,
      variation_id: variationId,
    }),
  });

  const data = await response.json();
  const responseNonce = response.headers.get("x-wc-store-api-nonce") ?? undefined;

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to add item" },
      { status: response.status }
    );
  }

  return NextResponse.json(
    {
      ...data,
      nonce: responseNonce,
    },
    { status: response.status }
  );
}
