export function seedUserColors(db) {
  const rows = [
    ["Orange", "#DE880E", "assets/images/userCreation/badge_orange.png"],
    ["Yellow", "#DEB10E", "assets/images/userCreation/badge_yellow.png"],
    ["Green", "#99B328", "assets/images/userCreation/badge_green.png"],
    ["Blue", "#66A6E2", "assets/images/userCreation/badge_blue.png"],
    ["Purple", "#AD69C4", "assets/images/userCreation/badge_purple.png"],
    ["Pink", "#FF8CCB", "assets/images/userCreation/badge_pink.png"],
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
  console.log(`Seeded ${rows.length} userColors.`);
}
