export function up(db) {
  const cols = db
    .prepare(`PRAGMA table_info('users')`)
    .all()
    .map((c) => c.name);

  if (!cols.includes("createdAt")) {
    db.exec(`ALTER TABLE users ADD COLUMN createdAt INTEGER;`);

    db.exec(
      `UPDATE users SET createdAt = strftime('%s','now') WHERE createdAt IS NULL;`
    );
  }

  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_users_createdAt ON users(createdAt);`
  );
}
