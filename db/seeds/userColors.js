export function seedUserColors(db) {
  const rows = [
    ["Red", "#FF0000", "assets/images/userCreation/badge_red.png"],
    ["Yellow", "#DEB10E", "assets/images/userCreation/badge_yellow.png"],
    ["Green", "#99B328", "assets/images/userCreation/badge_green.png"],
    ["Blue", "#66A6E2", "assets/images/userCreation/badge_blue.png"],
  ];

  const tx = db.transaction((items) => {
    const findByName = db.prepare(
      `SELECT id FROM userColors WHERE name = ? LIMIT 1`
    );
    const updateById = db.prepare(
      `UPDATE userColors SET hex = ?, badgePath = ? WHERE id = ?`
    );
    const insert = db.prepare(
      `INSERT INTO userColors (name, hex, badgePath) VALUES (?, ?, ?)`
    );

    for (const [name, hex, badgePath] of items) {
      const existing = findByName.get(name);
      if (existing) {
        updateById.run(hex, badgePath, existing.id);
      } else {
        insert.run(name, hex, badgePath);
      }
    }
  });

  tx(rows);
}
