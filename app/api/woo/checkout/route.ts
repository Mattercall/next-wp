import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function storeApiUrl(storeUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1/${path}`, storeUrl).toString();
}

type AnyObj = Record<string, any>;

const requiredBillingFields = [
  "first_name",
  "last_name",
  "address_1",
  "city",
  "state",
  "postcode",
  "country",
  "email",
];

const requiredShippingFields = [
  "first_name",
  "last_name",
  "address_1",
  "city",
  "state",
  "postcode",
  "country",
];

function normalizeAddress(input: AnyObj, includeContact = false) {
  // Accept either snake_case or common camelCase and output Store API snake_case.
  const normalized = {
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
  if (!includeContact) {
    normalized.email = "";
    normalized.phone = "";
  }
  return normalized;
}

function missingFields(address: AnyObj, requiredFields: string[]) {
  return requiredFields.filter((field) => {
    const value = address[field];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

function maskEmail(email: string) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  return `${user.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 2) return "***";
  return `***${digits.slice(-2)}`;
}

function sanitizeAddressForLog(address: AnyObj) {
  return {
    ...address,
    email: maskEmail(address.email),
    phone: maskPhone(address.phone),
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

  const billing_address = normalizeAddress(body.billing_address ?? {}, true);
  const shipping_address = normalizeAddress(body.shipping_address ?? {});
  const payment_method = String(body.payment_method ?? "").trim();

  const missingBilling = missingFields(billing_address, requiredBillingFields);
  const missingShipping = missingFields(shipping_address, requiredShippingFields);

  if (!payment_method) {
    return NextResponse.json(
      { message: "Please select a payment method before checking out." },
      { status: 400 }
    );
  }

  if (missingBilling.length || missingShipping.length) {
    const missing = Array.from(new Set([...missingBilling, ...missingShipping]));
    return NextResponse.json(
      {
        message: `Please complete the required address fields: ${missing
          .map((field) => field.replace(/_/g, " "))
          .join(", ")}.`,
        missing_fields: missing,
      },
      { status: 400 }
    );
  }

  console.info("Woo checkout payload", {
    payment_method,
    billing_address: sanitizeAddressForLog(billing_address),
    shipping_address: sanitizeAddressForLog(shipping_address),
    payment_data_keys: body.payment_data?.map((entry) => entry.key) ?? [],
  });

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
      payment_method,
      customer_note: body.customer_note ?? "",
      payment_data: body.payment_data ?? [],
    }),
  });

  const data = await wooRes.json().catch(() => null);
  console.info("Woo checkout response", {
    ok: wooRes.ok,
    status: wooRes.status,
    order_id: data?.order_id ?? data?.order_key ?? null,
    message: data?.message ?? null,
    code: data?.code ?? null,
  });

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
