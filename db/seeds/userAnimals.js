export function seedUserAnimals(db) {
  const rows = [
    ["Armadillo", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Hummingbird", "assets/images/userCreation/badge_icon_hummingbird.png"],
    ["Porcupine", "assets/images/userCreation/badge_icon_porcupine.png"],
    ["Prairie Dog", "assets/images/userCreation/badge_icon_prairie_dog.png"],

    // Placeholder animals with same image for now
    ["Raccoon", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Red Fox", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Skunk", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Squirrel", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Woodpecker", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Blue Jay", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Bobcat", "assets/images/userCreation/badge_icon_armadillo.png"],
    [
      "Cottontail Rabbit",
      "assets/images/userCreation/badge_icon_armadillo.png",
    ],
    ["Deer", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Great Horned Owl", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Mourning Dove", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Red-tailed Hawk", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Turkey", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Weasel", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Wild Turkey", "assets/images/userCreation/badge_icon_armadillo.png"],
    [
      "Woodland Jumping Mouse",
      "assets/images/userCreation/badge_icon_armadillo.png",
    ],
    ["Coyote", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Eastern Chipmunk", "assets/images/userCreation/badge_icon_armadillo.png"],
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
}
