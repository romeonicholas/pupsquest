import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, "../db/database.db");
const MIGRATIONS_DIR = path.resolve(__dirname, "../db/migrations");

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    appliedAt INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`);

function getApplied() {
  return new Set(
    db
      .prepare(`SELECT filename FROM schema_migrations ORDER BY id`)
      .all()
      .map((r) => r.filename)
  );
}

async function run() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d+.*\.js$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const applied = getApplied();
  let ran = 0;

  for (const file of files) {
    if (applied.has(file)) continue;

    const full = path.join(MIGRATIONS_DIR, file);
    const mod = await import(pathToFileURL(full));
  }

  function pathToFileURL(p) {
    const u = new URL("file://");
    u.pathname = path.resolve(p).replace(/\\/g, "/");
    return u.href;
  }

  for (const file of files) {
    if (applied.has(file)) continue;
    const mod = await import(pathToFileURL(path.join(MIGRATIONS_DIR, file)));
    if (typeof mod.up !== "function")
      throw new Error(`${file} must export 'up(db)'`);

    db.transaction(() => {
      mod.up(db);
      db.prepare(`INSERT INTO schema_migrations (filename) VALUES (?)`).run(
        file
      );
    })();

    ran++;
  }

  db.close();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
