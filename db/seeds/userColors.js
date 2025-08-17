export function seedUserColors(db) {
  const rows = [
    ["orange", "#DE880E", "public/images/userCreation/badge_orange.png"],
    ["yellow", "#DEB10E", "public/images/userCreation/badge_yellow.png"],
    ["green", "#99B328", "public/images/userCreation/badge_green.png"],
    ["blue", "#66A6E2", "public/images/userCreation/badge_blue.png"],
    ["purple", "#AD69C4", "public/images/userCreation/badge_purple.png"],
    ["pink", "#FF8CCB", "public/images/userCreation/badge_pink.png"],
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
