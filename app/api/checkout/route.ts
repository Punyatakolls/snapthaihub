import { NextRequest, NextResponse } from "next/server";
import { getOrderByCode, markPaid } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const order = body.code ? getOrderByCode(body.code) : null;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "quoted" || !order.quote_cents) {
    return NextResponse.json(
      { error: "This order is not ready for payment." },
      { status: 409 }
    );
  }

  // Base for Stripe success/cancel redirects: the host the customer is
  // actually browsing, forced to https. This always resolves (they're on
  // it right now), so redirects never break — no dependency on a separately
  // configured APP_URL, which is easy to mistype.
  const requestHost = req.headers.get("host") || req.nextUrl.host;
  const origin = `https://${requestHost}`;
  const stripe = getStripe();

  if (!stripe) {
    // Demo mode: no Stripe keys configured yet. Simulate a successful
    // payment so the full flow can be exercised end-to-end.
    markPaid(order.code);
    return NextResponse.json({
      url: `${origin}/pay/${order.code}?demo_paid=1`,
      demo: true,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.email,
      line_items: [
        {
          price_data: {
            currency: order.currency,
            product_data: {
              name: `Snap Thai Hub order ${order.code}`,
              description: `${order.items.length} item(s) sourced in Thailand, shipped to ${order.country}`,
            },
            unit_amount: order.quote_cents,
          },
          quantity: 1,
        },
      ],
      metadata: { order_code: order.code },
      success_url: `${origin}/pay/${order.code}?paid=1`,
      cancel_url: `${origin}/pay/${order.code}?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start checkout.";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
