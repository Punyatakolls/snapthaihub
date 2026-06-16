import { NextRequest, NextResponse } from "next/server";
import { createOrder, OrderItemInput } from "@/lib/orders";
import { emailCustomerReceived, emailOwnerNewOrder } from "@/lib/email";

const MAX_ITEMS = 20;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, country, notes, items } = (body ?? {}) as {
    name?: string;
    email?: string;
    country?: string;
    notes?: string;
    items?: OrderItemInput[];
  };

  if (!name?.trim() || !email?.trim() || !country?.trim()) {
    return NextResponse.json(
      { error: "Name, email and country are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Add at least one item to your request." },
      { status: 400 }
    );
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_ITEMS} items per request.` },
      { status: 400 }
    );
  }
  for (const item of items) {
    if (!["link", "photo", "description"].includes(item.kind)) {
      return NextResponse.json({ error: "Invalid item type." }, { status: 400 });
    }
    const hasContent =
      (item.kind === "link" && item.url?.trim()) ||
      (item.kind === "photo" && item.imagePath?.trim()) ||
      (item.kind === "description" && item.description?.trim());
    if (!hasContent) {
      return NextResponse.json(
        { error: "Every item needs a link, photo, or description." },
        { status: 400 }
      );
    }
  }

  const order = createOrder({
    name: name.trim(),
    email: email.trim(),
    country: country.trim(),
    notes: notes?.trim(),
    items,
  });

  const baseUrl = `https://${req.headers.get("host") || req.nextUrl.host}`;
  await emailCustomerReceived(order, baseUrl);
  await emailOwnerNewOrder(order, baseUrl);

  return NextResponse.json({ code: order.code }, { status: 201 });
}
