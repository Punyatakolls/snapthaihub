import path from "path";

// Base directory for the SQLite database and uploaded images.
// Locally this defaults to ./data (gitignored). In production set DATA_DIR
// to a persistent disk mount (e.g. Render's /var/data) so orders and
// uploaded photos survive restarts and redeploys.
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
