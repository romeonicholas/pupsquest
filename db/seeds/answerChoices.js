export function seedAnswerChoices(db) {
  // sanity check: table has the expected columns
  const cols = db.prepare(`PRAGMA table_info('answerChoices')`).all();
  const hasname = cols.some((c) => c.name === "name");
  const hasImg = cols.some((c) => c.name === "imgPath");
  if (!hasname || !hasImg) {
    throw new Error(`answerChoices must have columns: name, imgPath`);
  }

  const slugs = [
    "armadillo",
    "beaver",
    "bison",
    "black_bear",
    "boar",
    "bobcat",
    "bullfrog",
    "bunting_blue",
    "bunting_green",
    "bunting_red",
    "bunting_yellow",
    "collared_lizard_blue",
    "collared_lizard_green",
    "collared_lizard_red",
    "collared_lizard_orange",
    "coreopsis",
    "false_Dandelion",
    "flying_squirrel",
    "goldfinch",
    "indian_blanket",
    "jackrabbit",
    "kangaroo_rat",
    "pileated_woodpecker",
    "porcupine",
    "prairie_dog",
    "prairie_falcon",
    "purple_coneflower",
    "red_tailed_hawk",
    "ruby_throated_hummingbird",
    "scissor_tailed_flycatcher",
    "swift_fox",
    "four",
    "six",
    "eight",
    "ten",
  ];

  const toTitle = (slug) =>
    slug
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ")
      .trim();

  const rows = slugs.map((slug) => ({
    name: toTitle(slug), // e.g., "Armadillo"
    imgPath: `public/images/riddles/icons/${slug}.png`,
  }));

  const find = db.prepare(
    `SELECT id FROM answerChoices WHERE name = ? LIMIT 1`
  );
  const insert = db.prepare(
    `INSERT INTO answerChoices (name, imgPath) VALUES (?, ?)`
  );
  const update = db.prepare(
    `UPDATE answerChoices SET imgPath = ? WHERE id = ?`
  );

  db.transaction(() => {
    for (const { name, imgPath } of rows) {
      const existing = find.get(name);
      if (existing) {
        update.run(imgPath, existing.id);
      } else {
        insert.run(name, imgPath);
      }
    }
  })();

  console.log(`Seeded ${rows.length} answerChoices.`);
}
