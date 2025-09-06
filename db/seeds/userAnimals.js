export function seedUserAnimals(db) {
  const rows = [
    ["Armadillo", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Hummingbird", "assets/images/userCreation/badge_icon_hummingbird.png"],
    ["Porcupine", "assets/images/userCreation/badge_icon_porcupine.png"],
    ["Prairie Dog", "assets/images/userCreation/badge_icon_prairie_dog.png"],
    ["Bullfrog", "assets/images/userCreation/badge_icon_porcupine.png"],
    ["Turtle", "assets/images/userCreation/badge_icon_prairie_dog.png"],
    ["Scorpion", "assets/images/userCreation/badge_icon_hummingbird.png"],
    ["Spider", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Crow", "assets/images/userCreation/badge_icon_prairie_dog.png"],
    ["Eagle", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Woodpecker", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Chicken", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Falcon", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Hawk", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Flycatcher", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Turkey", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Bass", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Mushroom", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Dragonfly", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Grasshopper", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Honey Bee", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Ant", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Butterfly", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Moth", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Beetle", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Bat", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Beaver", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Buffalo", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Bear", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Boar", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Bobcat", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Coyote", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Elk", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Jackrabbit", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Mink", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Opossum", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Ringtail", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Squirrel", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Skunk", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Fox", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Deer", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Snake", "assets/images/userCreation/badge_icon_armadillo.png"],
    ["Lizard", "assets/images/userCreation/badge_icon_armadillo.png"],
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
