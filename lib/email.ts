import { Resend } from "resend";
import type { Order } from "./orders";
import { SITE_URL } from "./site";

const FROM = process.env.EMAIL_FROM || "Snap Thai Hub <onboarding@resend.dev>";
const OWNER = process.env.OWNER_EMAIL;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

// Send an email. Never throws and never blocks the core flow: if there's no
// API key it logs and no-ops (so the app works before email is configured),
// and delivery errors are caught and logged rather than failing the request.
async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(`[email] (no RESEND_API_KEY) skipped "${opts.subject}" → ${opts.to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, ...opts });
  } catch (err) {
    console.error(
      "[email] send failed:",
      err instanceof Error ? err.message : err
    );
  }
}

function money(order: Order): string {
  return order.quote_cents != null
    ? `${(order.quote_cents / 100).toFixed(2)} ${order.currency.toUpperCase()}`
    : "—";
}

function itemsList(order: Order): string {
  return order.items
    .map((it) => {
      const label =
        it.url || it.description || (it.kind === "photo" ? "Uploaded photo" : "Item");
      return `<li style="margin:4px 0">${escapeHtml(label)} &times;${it.quantity}</li>`;
    })
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Branded wrapper. Inline styles only (email clients ignore <style>/external CSS).
function layout(heading: string, bodyHtml: string): string {
  return `
  <div style="background:#fff8f0;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#2d1f16">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:3px solid #1c1410;border-radius:16px;overflow:hidden">
      <div style="background:#1c1410;padding:18px 24px">
        <span style="color:#e8500f;font-weight:800;font-size:20px">SNAP</span><span style="color:#fff8f0;font-weight:800;font-size:20px">THAI</span><span style="color:#ffb30f;font-weight:800;font-size:20px">HUB</span>
      </div>
      <div style="padding:24px">
        <h1 style="margin:0 0 12px;font-size:22px;color:#1c1410">${heading}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;border-top:1px solid #eee;color:#6b5d52;font-size:12px">
        Snap Thai Hub · Anything from Thailand, shipped to your door 🇹🇭
      </div>
    </div>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#e8500f;color:#fff;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:10px;margin:8px 0">${label}</a>`;
}

// Links in emails always point at the public website (SITE_URL), never the
// sending domain. This matters when sending from a subdomain like
// mail.snapthaihub.com — that host doesn't serve the site, but its root
// domain still aligns with the links for deliverability.
function linkBase(fallback: string): string {
  return SITE_URL || fallback;
}

/** Alert to the shop owner when a new order request arrives. */
export async function emailOwnerNewOrder(order: Order, baseUrl: string): Promise<void> {
  if (!OWNER) {
    console.log("[email] OWNER_EMAIL not set — skipping new-order alert");
    return;
  }
  const base = linkBase(baseUrl);
  await send({
    to: OWNER,
    subject: `🛒 New order ${order.code} — ${order.name} (${order.country})`,
    html: layout(
      `New order: ${order.code}`,
      `<p><strong>${escapeHtml(order.name)}</strong> (${escapeHtml(order.email)}) — shipping to ${escapeHtml(order.country)}</p>
       <ul style="padding-left:18px">${itemsList(order)}</ul>
       ${order.notes ? `<p style="color:#6b5d52"><em>Notes: ${escapeHtml(order.notes)}</em></p>` : ""}
       ${button(`${base}/admin`, "Open admin → quote it")}`
    ),
  });
}

/** Confirmation to the customer that we received their request. */
export async function emailCustomerReceived(order: Order, baseUrl: string): Promise<void> {
  const base = linkBase(baseUrl);
  await send({
    to: order.email,
    subject: `We got your request — ${order.code}`,
    html: layout(
      "Request received! 🙏",
      `<p>Thanks, ${escapeHtml(order.name)}! We've received your request and our Bangkok team will send an all-in quote within 24 hours.</p>
       <p>Your order code: <strong style="font-size:18px">${order.code}</strong></p>
       <ul style="padding-left:18px">${itemsList(order)}</ul>
       ${button(`${base}/track?code=${order.code}`, "Track your order")}`
    ),
  });
}

/** Customer notification that their quote is ready to pay. */
export async function emailCustomerQuote(order: Order, baseUrl: string): Promise<void> {
  const base = linkBase(baseUrl);
  await send({
    to: order.email,
    subject: `Your quote is ready — ${order.code} (${money(order)})`,
    html: layout(
      "Your quote is ready 🎉",
      `<p>Good news, ${escapeHtml(order.name)} — we can source your items! Here's your all-in total (products, service & tracked shipping to ${escapeHtml(order.country)}):</p>
       <p style="font-size:28px;font-weight:800;color:#1c1410">${money(order)}</p>
       <p>Approve and pay securely below — no further charges.</p>
       ${button(`${base}/pay/${order.code}`, "Review & pay")}`
    ),
  });
}

/** Customer + owner confirmation that payment succeeded. */
export async function emailPaid(order: Order, baseUrl: string): Promise<void> {
  const base = linkBase(baseUrl);
  await send({
    to: order.email,
    subject: `Payment confirmed — ${order.code}`,
    html: layout(
      "Payment confirmed — kob khun ka! 🙏",
      `<p>Thank you, ${escapeHtml(order.name)}! We've received your payment of <strong>${money(order)}</strong> and our team is shopping for your items right away.</p>
       ${button(`${base}/track?code=${order.code}`, "Track your order")}`
    ),
  });
  if (OWNER) {
    await send({
      to: OWNER,
      subject: `💸 Paid: ${order.code} — ${money(order)}`,
      html: layout(
        `Payment received: ${order.code}`,
        `<p><strong>${escapeHtml(order.name)}</strong> paid ${money(order)}. Time to purchase & ship.</p>
         ${button(`${base}/admin`, "Open admin")}`
      ),
    });
  }
}

/** Customer notification that their order shipped, with tracking. */
export async function emailCustomerShipped(order: Order, baseUrl: string): Promise<void> {
  const base = linkBase(baseUrl);
  const tracking =
    order.tracking_number
      ? `<p>Carrier: <strong>${escapeHtml(order.tracking_carrier ?? "")}</strong><br>Tracking #: <strong>${escapeHtml(order.tracking_number)}</strong></p>`
      : "";
  await send({
    to: order.email,
    subject: `On its way! 📦 ${order.code}`,
    html: layout(
      "Your order is on its way ✈️",
      `<p>Great news, ${escapeHtml(order.name)} — your order has shipped from Bangkok to ${escapeHtml(order.country)}.</p>
       ${tracking}
       ${button(`${base}/track?code=${order.code}`, "Track your order")}`
    ),
  });
}
