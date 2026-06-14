import crypto from "crypto";
import db from "./db";

export const STATUSES = [
  "received",
  "quoted",
  "paid",
  "purchasing",
  "shipped",
  "delivered",
] as const;

export type OrderStatus = (typeof STATUSES)[number];

export interface OrderItemInput {
  kind: "link" | "photo" | "description";
  url?: string;
  imagePath?: string;
  description?: string;
  quantity?: number;
}

export interface OrderItem {
  id: number;
  kind: "link" | "photo" | "description";
  url: string | null;
  image_path: string | null;
  description: string;
  quantity: number;
}

export interface Order {
  id: number;
  code: string;
  name: string;
  email: string;
  country: string;
  notes: string;
  status: OrderStatus;
  quote_cents: number | null;
  currency: string;
  tracking_carrier: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

function generateCode(): string {
  // Unambiguous alphabet: no 0/O, 1/I/L
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[crypto.randomInt(alphabet.length)];
  }
  return `SNTH-${suffix}`;
}

export function createOrder(input: {
  name: string;
  email: string;
  country: string;
  notes?: string;
  items: OrderItemInput[];
}): Order {
  let code = generateCode();
  while (db.prepare("SELECT 1 FROM orders WHERE code = ?").get(code)) {
    code = generateCode();
  }

  const insertOrder = db.prepare(
    `INSERT INTO orders (code, name, email, country, notes) VALUES (?, ?, ?, ?, ?)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, kind, url, image_path, description, quantity)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const created = db.transaction(() => {
    const res = insertOrder.run(
      code,
      input.name,
      input.email,
      input.country,
      input.notes ?? ""
    );
    for (const item of input.items) {
      insertItem.run(
        res.lastInsertRowid,
        item.kind,
        item.url ?? null,
        item.imagePath ?? null,
        item.description ?? "",
        Math.max(1, Math.min(99, item.quantity ?? 1))
      );
    }
    return res.lastInsertRowid as number;
  })();

  return getOrderById(created)!;
}

function attachItems(order: Omit<Order, "items">): Order {
  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(order.id) as OrderItem[];
  return { ...order, items };
}

export function getOrderById(id: number): Order | null {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | Omit<Order, "items">
    | undefined;
  return row ? attachItems(row) : null;
}

export function getOrderByCode(code: string): Order | null {
  const row = db
    .prepare("SELECT * FROM orders WHERE code = ? COLLATE NOCASE")
    .get(code.trim()) as Omit<Order, "items"> | undefined;
  return row ? attachItems(row) : null;
}

export function listOrders(): Order[] {
  const rows = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as Omit<Order, "items">[];
  return rows.map(attachItems);
}

export function setQuote(code: string, quoteCents: number): Order | null {
  db.prepare(
    `UPDATE orders SET quote_cents = ?, status = 'quoted', updated_at = datetime('now')
     WHERE code = ? AND status IN ('received', 'quoted')`
  ).run(quoteCents, code);
  return getOrderByCode(code);
}

export function setStatus(
  code: string,
  status: OrderStatus,
  tracking?: { carrier?: string; number?: string }
): Order | null {
  db.prepare(
    `UPDATE orders SET status = ?,
       tracking_carrier = COALESCE(?, tracking_carrier),
       tracking_number = COALESCE(?, tracking_number),
       updated_at = datetime('now')
     WHERE code = ?`
  ).run(status, tracking?.carrier ?? null, tracking?.number ?? null, code);
  return getOrderByCode(code);
}

export function markPaid(code: string): Order | null {
  return setStatus(code, "paid");
}
