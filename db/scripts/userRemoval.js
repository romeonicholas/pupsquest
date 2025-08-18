export function removeExpiredUsers(db) {
  const stmt = db.prepare(`
    DELETE FROM users
    WHERE createdAt < strftime('%s','now','-72 hours')
  `);
  const info = stmt.run();
  return info.changes;
}
