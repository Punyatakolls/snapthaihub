import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode } from "@/lib/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const order = getOrderByCode(code);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  // Public view: omit internal fields, never expose other customers' data
  return NextResponse.json({
    code: order.code,
    status: order.status,
    country: order.country,
    quote_cents: order.quote_cents,
    currency: order.currency,
    tracking_carrier: order.tracking_carrier,
    tracking_number: order.tracking_number,
    created_at: order.created_at,
    updated_at: order.updated_at,
    item_count: order.items.length,
  });
}
