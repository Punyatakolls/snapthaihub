import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { DATA_DIR } from "./paths";

let _db: Database.Database | null = null;

// Lazily open the database on first use. This must NOT run at module-load
// time: during `next build` the route modules are evaluated to collect page
// data, and on hosts like Render the persistent disk (DATA_DIR) is only
// mounted at runtime — touching it at build time fails with ENOENT.
export function getDb(): Database.Database {
  if (_db) return _db;

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

  _db = db;
  return _db;
}
