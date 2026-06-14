import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { DATA_DIR } from "./paths";

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "snapthaihub.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'received',
    quote_cents INTEGER,
    currency TEXT NOT NULL DEFAULT 'usd',
    tracking_carrier TEXT,
    tracking_number TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    kind TEXT NOT NULL CHECK (kind IN ('link', 'photo', 'description')),
    url TEXT,
    image_path TEXT,
    description TEXT DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1
  );
`);

export default db;
