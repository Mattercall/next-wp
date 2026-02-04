import { NextResponse } from "next/server";
import { getPaymentGateways } from "@/lib/woocommerce";

export async function GET() {
  try {
    const gateways = await getPaymentGateways();
    const enabled = gateways
      .filter((gateway) => gateway.enabled)
      .map((gateway) => ({
        id: gateway.id,
        title: gateway.title || gateway.method_title,
        description: gateway.description || gateway.method_description,
      }));

    return NextResponse.json({ payment_methods: enabled });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load payment methods",
      },
      { status: 500 }
    );
  }
}
