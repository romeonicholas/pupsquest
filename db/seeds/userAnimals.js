export function seedUserAnimals(db) {
  const rows = [
    ["Armadillo", "assets/images/userCreation/badges/badge_icon_armadillo.png"],
    [
      "Hummingbird",
      "assets/images/userCreation/badges/badge_icon_hummingbird.png",
    ],
    ["Porcupine", "assets/images/userCreation/badges/badge_icon_porcupine.png"],
    [
      "Prairie Dog",
      "assets/images/userCreation/badges/badge_icon_prairie_dog.png",
    ],
    ["Bullfrog", "assets/images/userCreation/badges/badge_icon_bullfrog.png"],
    ["Turtle", "assets/images/userCreation/badges/badge_icon_turtle.png"],
    ["Scorpion", "assets/images/userCreation/badges/badge_icon_scorpion.png"],
    ["Spider", "assets/images/userCreation/badges/badge_icon_spider.png"],
    ["Crow", "assets/images/userCreation/badges/badge_icon_crow.png"],
    ["Eagle", "assets/images/userCreation/badges/badge_icon_eagle.png"],
    [
      "Woodpecker",
      "assets/images/userCreation/badges/badge_icon_woodpecker.png",
    ],
    ["Chicken", "assets/images/userCreation/badges/badge_icon_chicken.png"],
    ["Falcon", "assets/images/userCreation/badges/badge_icon_falcon.png"],
    ["Hawk", "assets/images/userCreation/badges/badge_icon_hawk.png"],
    [
      "Flycatcher",
      "assets/images/userCreation/badges/badge_icon_flycatcher.png",
    ],
    ["Turkey", "assets/images/userCreation/badges/badge_icon_turkey.png"],
    ["Bass", "assets/images/userCreation/badges/badge_icon_bass.png"],
    ["Mushroom", "assets/images/userCreation/badges/badge_icon_mushroom.png"],
    ["Dragonfly", "assets/images/userCreation/badges/badge_icon_dragonfly.png"],
    [
      "Grasshopper",
      "assets/images/userCreation/badges/badge_icon_grasshopper.png",
    ],
    ["Honey Bee", "assets/images/userCreation/badges/badge_icon_honey_bee.png"],
    ["Ant", "assets/images/userCreation/badges/badge_icon_ant.png"],
    ["Butterfly", "assets/images/userCreation/badges/badge_icon_butterfly.png"],
    ["Moth", "assets/images/userCreation/badges/badge_icon_moth.png"],
    ["Beetle", "assets/images/userCreation/badges/badge_icon_beetle.png"],
    ["Bat", "assets/images/userCreation/badges/badge_icon_bat.png"],
    ["Beaver", "assets/images/userCreation/badges/badge_icon_beaver.png"],
    ["Buffalo", "assets/images/userCreation/badges/badge_icon_buffalo.png"],
    ["Bear", "assets/images/userCreation/badges/badge_icon_bear.png"],
    ["Boar", "assets/images/userCreation/badges/badge_icon_boar.png"],
    ["Bobcat", "assets/images/userCreation/badges/badge_icon_bobcat.png"],
    ["Coyote", "assets/images/userCreation/badges/badge_icon_coyote.png"],
    ["Elk", "assets/images/userCreation/badges/badge_icon_elk.png"],
    [
      "Jackrabbit",
      "assets/images/userCreation/badges/badge_icon_jackrabbit.png",
    ],
    ["Opossum", "assets/images/userCreation/badges/badge_icon_opossum.png"],
    ["Ringtail", "assets/images/userCreation/badges/badge_icon_ringtail.png"],
    ["Squirrel", "assets/images/userCreation/badges/badge_icon_squirrel.png"],
    ["Skunk", "assets/images/userCreation/badges/badge_icon_skunk.png"],
    ["Fox", "assets/images/userCreation/badges/badge_icon_fox.png"],
    ["Deer", "assets/images/userCreation/badges/badge_icon_deer.png"],
    ["Snake", "assets/images/userCreation/badges/badge_icon_snake.png"],
    ["Lizard", "assets/images/userCreation/badges/badge_icon_lizard.png"],
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
