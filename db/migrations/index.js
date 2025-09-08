export async function runAllMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      executed_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
  `);

  const executedMigrations = db
    .prepare(`SELECT filename FROM migrations`)
    .all();

  try {
    if (
      !executedMigrations.some(
        (m) => m.filename === "001_add_users_createdAt.js"
      )
    ) {
      const migration001 = await import("./001_add_users_createdAt.js");
      migration001.up(db);
      db.prepare(`INSERT INTO migrations (filename) VALUES (?)`).run(
        "001_add_users_createdAt.js"
      );
    }

    if (
      !executedMigrations.some((m) => m.filename === "002_add_user_scores.js")
    ) {
      const migration002 = await import("./002_add_user_scores.js");
      migration002.up(db);
      db.prepare(`INSERT INTO migrations (filename) VALUES (?)`).run(
        "002_add_user_scores.js"
      );
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
