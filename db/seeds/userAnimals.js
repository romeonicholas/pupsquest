export function seedUserAnimals(db) {
  const rows = [
    ["Armadillo", "assets/images/userCreation/badge_armadillo.png"],
    ["Fox", "assets/images/userCreation/badge_fox.png"],
    ["Hummingbird", "assets/images/userCreation/badge_hummingbird.png"],
    ["Porcupine", "assets/images/userCreation/badge_porcupine.png"],
    ["Prairie Dog", "assets/images/userCreation/badge_prairie_dog.png"],
  ];

  const tx = db.transaction((items) => {
    const findByName = db.prepare(
      `SELECT id FROM userAnimals WHERE name = ? LIMIT 1`
    );
    const updateById = db.prepare(
      `UPDATE userAnimals SET imgPath = ? WHERE id = ?`
    );
    const insert = db.prepare(
      `INSERT INTO userAnimals (name, imgPath) VALUES (?, ?)`
    );

    for (const [name, imgPath] of items) {
      const existing = findByName.get(name);
      if (existing) {
        updateById.run(imgPath, existing.id);
      } else {
        insert.run(name, imgPath);
      }
    }
  });

  tx(rows);
  console.log(`Seeded ${rows.length} userAnimals.`);
}
