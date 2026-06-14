import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { listOrders, setQuote, setStatus, STATUSES, OrderStatus } from "@/lib/orders";

function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const given = req.headers.get("x-admin-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: listOrders() });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    code?: string;
    quote_cents?: number;
    status?: string;
    tracking_carrier?: string;
    tracking_number?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.code) {
    return NextResponse.json({ error: "Order code required" }, { status: 400 });
  }

  let order = null;
  if (typeof body.quote_cents === "number" && body.quote_cents > 0) {
    order = setQuote(body.code, Math.round(body.quote_cents));
  }
  if (body.status) {
    if (!STATUSES.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    order = setStatus(body.code, body.status as OrderStatus, {
      carrier: body.tracking_carrier,
      number: body.tracking_number,
    });
  }

  if (!order) {
    return NextResponse.json(
      { error: "Order not found or nothing to update" },
      { status: 404 }
    );
  }
  return NextResponse.json({ order });
}
