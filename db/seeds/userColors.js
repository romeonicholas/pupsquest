export function seedUserColors(db) {
  const rows = [
    ["Red", "#D95A4C", "assets/images/users/badges/red.png"],
    ["Yellow", "#EBBD4F", "assets/images/users/badges/yellow.png"],
    ["Green", "#8AA653", "assets/images/users/badges/green.png"],
    ["Blue", "#59A4B2", "assets/images/users/badges/blue.png"],
    ["Silver", "#B0B3AA", "assets/images/users/badges/silver.png"],
    ["Purple", "#A67B9A", "assets/images/users/badges/purple.png"],
    ["Orange", "#EA8E48", "assets/images/users/badges/orange.png"],
    ["Brown", "#99785B", "assets/images/users/badges/brown.png"],
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
