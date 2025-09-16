export function seedAnswerChoices(db) {
  const rows = [
    {
      key: "armadillo",
      display: "Armadillo",
      imgPath: "/assets/images/riddles/icons/armadillo.png",
    },
    {
      key: "beaver",
      display: "Beaver",
      imgPath: "/assets/images/riddles/icons/beaver.png",
    },
    {
      key: "bison",
      display: "Bison",
      imgPath: "/assets/images/riddles/icons/bison.png",
    },
    {
      key: "black_bear",
      display: "Black Bear",
      imgPath: "/assets/images/riddles/icons/black_bear.png",
    },
    {
      key: "boar",
      display: "Boar",
      imgPath: "/assets/images/riddles/icons/boar.png",
    },
    {
      key: "bobcat",
      display: "Bobcat",
      imgPath: "/assets/images/riddles/icons/bobcat.png",
    },
    {
      key: "bullfrog",
      display: "Bullfrog",
      imgPath: "/assets/images/riddles/icons/bullfrog.png",
    },
    {
      key: "bunting_blue",
      display: "Blue",
      imgPath: "/assets/images/riddles/icons/bunting_blue.png",
    },
    {
      key: "bunting_green",
      display: "Green",
      imgPath: "/assets/images/riddles/icons/bunting_green.png",
    },
    {
      key: "bunting_red",
      display: "Red",
      imgPath: "/assets/images/riddles/icons/bunting_red.png",
    },
    {
      key: "bunting_yellow",
      display: "Yellow",
      imgPath: "/assets/images/riddles/icons/bunting_yellow.png",
    },
    {
      key: "collared_lizard",
      display: "Collared Lizard",
      imgPath: "/assets/images/riddles/icons/collared_lizard.png",
    },
    {
      key: "collared_lizard_blue",
      display: "Blue",
      imgPath: "/assets/images/riddles/icons/collared_lizard_blue.png",
    },
    {
      key: "collared_lizard_green",
      display: "Green",
      imgPath: "/assets/images/riddles/icons/collared_lizard_green.png",
    },
    {
      key: "collared_lizard_red",
      display: "Red",
      imgPath: "/assets/images/riddles/icons/collared_lizard_red.png",
    },
    {
      key: "collared_lizard_orange",
      display: "Orange",
      imgPath: "/assets/images/riddles/icons/collared_lizard_orange.png",
    },
    {
      key: "coreopsis",
      display: "Coreopsis",
      imgPath: "/assets/images/riddles/icons/coreopsis.png",
    },
    {
      key: "false_dandelion",
      display: "False Dandelion",
      imgPath: "/assets/images/riddles/icons/false_dandelion.png",
    },
    {
      key: "flying_squirrel",
      display: "Flying Squirrel",
      imgPath: "/assets/images/riddles/icons/flying_squirrel.png",
    },
    {
      key: "goldfinch",
      display: "Goldfinch",
      imgPath: "/assets/images/riddles/icons/goldfinch.png",
    },
    {
      key: "indian_blanket",
      display: "Indian Blanket",
      imgPath: "/assets/images/riddles/icons/indian_blanket.png",
    },
    {
      key: "jackrabbit",
      display: "Jackrabbit",
      imgPath: "/assets/images/riddles/icons/jackrabbit.png",
    },
    {
      key: "kangaroo_rat",
      display: "Kangaroo Rat",
      imgPath: "/assets/images/riddles/icons/kangaroo_rat.png",
    },
    {
      key: "pileated_woodpecker",
      display: "Pileated Woodpecker",
      imgPath: "/assets/images/riddles/icons/pileated_woodpecker.png",
    },
    {
      key: "porcupine",
      display: "Porcupine",
      imgPath: "/assets/images/riddles/icons/porcupine.png",
    },
    {
      key: "prairie_dog",
      display: "Prairie Dog",
      imgPath: "/assets/images/riddles/icons/prairie_dog.png",
    },
    {
      key: "prairie_falcon",
      display: "Prairie Falcon",
      imgPath: "/assets/images/riddles/icons/prairie_falcon.png",
    },
    {
      key: "purple_coneflower",
      display: "Purple Coneflower",
      imgPath: "/assets/images/riddles/icons/purple_coneflower.png",
    },
    {
      key: "red_tailed_hawk",
      display: "Red-tailed Hawk",
      imgPath: "/assets/images/riddles/icons/red-tailed_hawk.png",
    },
    {
      key: "hummingbird",
      display: "Humming-bird",
      imgPath: "/assets/images/riddles/icons/hummingbird.png",
    },
    {
      key: "scissor_tailed_flycatcher",
      display: "Scissor-tailed Flycatcher",
      imgPath: "/assets/images/riddles/icons/scissor-tailed_flycatcher.png",
    },
    {
      key: "swift_fox",
      display: "Swift Fox",
      imgPath: "/assets/images/riddles/icons/swift_fox.png",
    },
    {
      key: "four",
      display: "Four",
      imgPath: "/assets/images/riddles/icons/four.png",
    },
    {
      key: "six",
      display: "Six",
      imgPath: "/assets/images/riddles/icons/six.png",
    },
    {
      key: "eight",
      display: "Eight",
      imgPath: "/assets/images/riddles/icons/eight.png",
    },
    {
      key: "ten",
      display: "Ten",
      imgPath: "/assets/images/riddles/icons/ten.png",
    },
    {
      key: "mountain_boomer",
      display: '"Mountain Boomer"',
      imgPath: "/assets/images/riddles/icons/collared_lizard.png",
    },
    {
      key: "arkansas_bluestar",
      display: "Arkansas Bluestar",
      imgPath: "/assets/images/riddles/icons/arkansas_bluestar.png",
    },
    {
      key: "bald_cypress",
      display: "Bald Cypress",
      imgPath: "/assets/images/riddles/icons/bald_cypress.png",
    },
    {
      key: "bands",
      display: "Bands",
      imgPath: "/assets/images/riddles/icons/bands.png",
    },
    {
      key: "blackjack_oak",
      display: "Blackjack Oak",
      imgPath: "/assets/images/riddles/icons/blackjack_oak.png",
    },
    {
      key: "blue_jay",
      display: "Blue Jay",
      imgPath: "/assets/images/riddles/icons/blue_jay.png",
    },
    {
      key: "cardinal",
      display: "Cardinal",
      imgPath: "/assets/images/riddles/icons/cardinal.png",
    },
    {
      key: "cattails",
      display: "Cattails",
      imgPath: "/assets/images/riddles/icons/cattails.png",
    },
    {
      key: "crow",
      display: "Crow",
      imgPath: "/assets/images/riddles/icons/crow.png",
    },
    {
      key: "desert_scorpion",
      display: "Desert Scorpion",
      imgPath: "/assets/images/riddles/icons/desert_scorpion.png",
    },
    {
      key: "diamonds",
      display: "Diamonds",
      imgPath: "/assets/images/riddles/icons/diamonds.png",
    },
    {
      key: "eastern_red_cypress",
      display: "Eastern Red Cypress",
      imgPath: "/assets/images/riddles/icons/eastern_red_cypress.png",
    },
    {
      key: "eastern_redbud",
      display: "Eastern Redbud",
      imgPath: "/assets/images/riddles/icons/eastern_redbud.png",
    },
    {
      key: "feathers",
      display: "Feathers",
      imgPath: "/assets/images/riddles/icons/feathers.png",
    },
    {
      key: "giant_walking_stick",
      display: "Giant Walking Stick",
      imgPath: "/assets/images/riddles/icons/giant_walking_stick.png",
    },
    {
      key: "grasshoppers",
      display: "Grasshoppers",
      imgPath: "/assets/images/riddles/icons/grasshoppers.png",
    },
    {
      key: "honey_bee",
      display: "Honey Bee",
      imgPath: "/assets/images/riddles/icons/honey_bee.png",
    },
    {
      key: "horned_toad",
      display: "Horned Toad",
      imgPath: "/assets/images/riddles/icons/horned_toad.png",
    },
    {
      key: "indian_pink",
      display: "Indian Pink",
      imgPath: "/assets/images/riddles/icons/indian_pink.png",
    },
    {
      key: "leafcutter_ants",
      display: "Leafcutter Ants",
      imgPath: "/assets/images/riddles/icons/leafcutter_ants.png",
    },
    {
      key: "leaves",
      display: "Leaves",
      imgPath: "/assets/images/riddles/icons/leaves.png",
    },
    {
      key: "mushroom",
      display: "Mushroom",
      imgPath: "/assets/images/riddles/icons/mushroom.png",
    },
    {
      key: "oldwife_underwing_moths",
      display: "Oldwife Underwing Moths",
      imgPath: "/assets/images/riddles/icons/oldwife_underwing_moths.png",
    },
    {
      key: "purple_milkweed",
      display: "Purple Milkweed",
      imgPath: "/assets/images/riddles/icons/purple_milkweed.png",
    },
    {
      key: "spots",
      display: "Spots",
      imgPath: "/assets/images/riddles/icons/spots.png",
    },
    {
      key: "stag_beetle",
      display: "Stag Beetle",
      imgPath: "/assets/images/riddles/icons/stag_beetle.png",
    },
    {
      key: "sticks",
      display: "Sticks",
      imgPath: "/assets/images/riddles/icons/sticks.png",
    },
    {
      key: "stripe",
      display: "Stripe",
      imgPath: "/assets/images/riddles/icons/stripe.png",
    },
  ];

  const upsert = db.prepare(`
      INSERT INTO answerChoices (key, display, imgPath)
      VALUES (@key, @display, @imgPath)
      ON CONFLICT(key) DO UPDATE SET
        display = excluded.display,
        imgPath = excluded.imgPath
    `);

  db.transaction(() => rows.forEach((r) => upsert.run(r)))();
}
