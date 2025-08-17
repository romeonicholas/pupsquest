export function seedRiddles(db) {
  const findChoiceByName = db.prepare(
    `SELECT id FROM answerChoices WHERE name = ? LIMIT 1`
  );
  const findRiddleByKey = db.prepare(
    `SELECT id FROM riddles WHERE riddleKey = ? LIMIT 1`
  );
  const insertRiddle = db.prepare(`
    INSERT INTO riddles (riddleKey, headline, body, answerDetails, answerImgPath)
    VALUES (?, ?, ?, ?, ?)
  `);
  const updateRiddle = db.prepare(`
    UPDATE riddles SET headline = ?, body = ?, answerDetails = ?, answerImgPath = ? WHERE id = ?
  `);
  const clearLinks = db.prepare(`
  DELETE FROM riddleAnswerChoices WHERE riddleId = ?
  `);
  const insertLink = db.prepare(`
  INSERT INTO riddleAnswerChoices (riddleId, answerChoiceId, slotIndex)
  VALUES (?, ?, ?)
  `);

  const rows = [
    {
      riddleKey: "Indian Blanket",
      headline: "Which one am I?",
      bodyLines: [
        "Everyone knows I’m so great:",
        "I’m the official wildflower of our state!",
        "You may find me by a star of blue,",
        "or near the tail of a cat, it’s true.",
        "If you’d like to see me even more,",
        "go ask the rabbit at the front door.",
      ],
      answerDetails:
        "My name comes from a Native American story about a girl lost in the forest who is kept warm by a blanket of red and yellow flowers.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_indian_blanket.png",
      answerChoiceNames: [
        "Indian Blanket",
        "False Dandelion",
        "Coreopsis",
        "Purple Coneflower",
      ],
    },
    {
      riddleKey: "Armadillo",
      headline: "Which one am I?",
      bodyLines: [
        "You’ll find me in the brush to the East,",
        "hunting for a termite feast.",
        "Other critters you’ll see nearby,",
        "have quills and feathers—but not I.",
        "Look for me on the big red ledge,",
        "I’m a little too close to the edge!",
      ],
      answerDetails:
        'In Cherokee, I’m called <span class="cherokee">ᎤᏯᏍᎦᎳ</span> (uyasgatli). I’m known as a symbol of strong protection and healthy personal boundaries.',
      answerImgPath: "images/riddles/answers/answer_image_temp_armadillo.png",
      answerChoiceNames: ["Armadillo", "Porcupine", "Swift Fox", "Prairie Dog"],
    },
    {
      riddleKey: "Painted Bunting Head",
      headline: "What color is my head?",
      bodyLines: [
        "Painted Bunting is my name,",
        "My many colors are my fame!",
        "My body has four different hues:",
        "yellow, red, green, and blue.",
        "Usually I try to hide from y’all",
        "but today I’m out near the waterfall!",
      ],
      answerDetails:
        "A traditional story explains that when the Great Spirit was giving birds their colors, the Painted Bunting was the last in line—so it just got leftovers.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_painted_bunting.png",
      answerChoiceNames: [
        "Bunting Blue",
        "Bunting Red",
        "Bunting Green",
        "Bunting Yellow",
      ],
    },
    {
      riddleKey: "Scissor-tailed Flycatcher",
      headline: "Which one am I?",
      bodyLines: [
        "What, haven’t you heard?",
        "I’m the Oklahoma state bird.",
        "You can find me flying high,",
        "above the herd, up in the sky.",
        "I see a snake below me here,",
        "And also, I see … a little blue deer?",
      ],
      answerDetails:
        "Scissor-tailed flycatchers have special meanings for many tribes, and their feathers are often worn in the regalia of male Comanche dancers.",
      answerImgPath: "images/riddles/answers/answer_image_temp_swallowtail.png",
      answerChoiceNames: [
        "Scissor-tailed Flycatcher",
        "Red-tailed Hawk",
        "Hummingbird",
        "Prairie Falcon",
      ],
    },
    {
      riddleKey: "Collared Lizard Tail",
      headline: "What color is my tail?",
      bodyLines: [
        "I’m not your pet but I do have a collar,",
        "You call me Boomer, but I don’t holler.",
        "There are no other lizards you’ll see,",
        "as bright and colorful as me!",
        "I’m out on a rock soaking up sun.",
        "Uh-oh, there’s a snake—I’d better run!",
      ],
      answerDetails:
        "People may have named this lizard “Mountain Boomer” by mistake—the noises they heard echoing in the hills were more likely from Barking Frogs.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_collared_lizard.png",
      answerChoiceNames: [
        "Collared Lizard Blue",
        "Collared Lizard Red",
        "Collared Lizard Orange",
        "Collared Lizard Green",
      ],
    },
    {
      riddleKey: "Kangaroo Rat",
      headline: "Which one am I?",
      bodyLines: [
        "Seeds are my favorite fodder,",
        "and strangely, I never drink water!",
        "I’m small and hiding, for safety’s sake,",
        "behind a plant called Rattlesnake.",
        "I live in the desert, not in the bogs,",
        "Look for me among the prairie dogs!",
      ],
      answerDetails:
        "A kangaroo rat’s strong hind legs allow it to jump nine feet in one bound to escape fast and sneaky animals. Its long tail acts like a rudder for steering.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_kangaroo_rat.png",
      answerChoiceNames: [
        "Kangaroo Rat",
        "Collared Lizard",
        "Flying Squirrel",
        "Goldfinch",
      ],
    },
    {
      riddleKey: "Jackrabbit",
      headline: "Which one am I?",
      bodyLines: [
        "Wait until dark to see me alight:",
        "of these four, only I love the night.",
        "The open field is where I’m at ease.",
        "The other three seem to like the trees.",
        "I’m all out of hints, except for this one:",
        "Coyote’s quite near me—should I run?",
      ],
      answerDetails:
        'The English name "Jackrabbit" is shortened from "Jackass Rabbit"—so named because its ears look like those of a donkey!',
      answerImgPath: "images/riddles/answers/answer_image_temp_jackrabbit.png",
      answerChoiceNames: [
        "Jackrabbit",
        "Bobcat",
        "Black Bear",
        "Pileated Woodpecker",
      ],
    },
    {
      riddleKey: "Bullfrog",
      headline: "Which one am I?",
      bodyLines: [
        "We’re so loud you can’t ignore us,",
        "and in a group we’re called a “chorus.”",
        "After dark is when you’ll hear my song,",
        "so look at night, you can’t go wrong.",
        "I’m out in the open, just for a minute,",
        "go see the waterfall, I’m nearly in it!",
      ],
      answerDetails:
        "The Bullfrog is the largest frog in North America and can weigh as much as a football. They're loud, too, and can be heard up to a half-mile away.",
      answerImgPath: "images/riddles/answers/answer_image_temp_bullfrog.png",
      answerChoiceNames: [
        "Bullfrog",
        '"Mountain Boomer"',
        "Bison",
        "Goldfinch",
      ],
    },
    {
      riddleKey: "Four",
      headline: "How many legs do I have?",
      bodyLines: [
        "I’m a “Giant,” or so they say,",
        "yet I’m tricky to see, especially by day.",
        "I may be “Walking,” but only at dark,",
        "By day I’m asleep, hidden on bark.",
        "I’m on a tree, but who knows where?",
        "Look by the mink, not by the bear.",
      ],
      answerDetails:
        "They're called Giant Walking Sticks for a reason: these are the longest insects in North America, growing up to 7 inches in length.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_giant_walking_stick.png",
      answerChoiceNames: ["Four", "Six", "Eight", "Ten"],
    },
    {
      riddleKey: "Beaver",
      headline: "Which one am I?",
      bodyLines: [
        "I don’t eat meat like these other guys,",
        "but I have big teeth, do you know why?",
        "I’m not in the woods but I am by a tree,",
        "Is it confusing? Come find me and see.",
        "I’m not in the prairie or the desert heat.",
        "I’m over by the cattails I so love to eat.",
      ],
      answerDetails:
        "In addition to making dams, beavers build their own lodges. To keep other animals out, the only entrances are underwater tunnels.",
      answerImgPath: "images/riddles/answers/answer_image_temp_beaver.png",
      answerChoiceNames: ["Beaver", "Black Bear", "Bobcat", "Boar"],
    },
  ];

  db.transaction(() => {
    for (const r of rows) {
      const {
        riddleKey,
        headline,
        bodyLines,
        answerDetails,
        answerImgPath,
        answerChoiceNames,
      } = r;

      if (!riddleKey) throw new Error("Each riddle must have a riddleKey");
      if (!Array.isArray(answerChoiceNames) || answerChoiceNames.length !== 4) {
        throw new Error(
          `answerChoiceNames must have exactly 4 items for key "${riddleKey}"`
        );
      }

      const choiceIds = answerChoiceNames.map((t) => {
        const found = findChoiceByName.get(t);
        if (!found)
          throw new Error(
            `answerChoices.name not found: "${t}" (riddleKey=${riddleKey})`
          );
        return found.id;
      });

      const existing = findRiddleByKey.get(riddleKey);
      let riddleId;
      if (existing) {
        updateRiddle.run(
          headline,
          JSON.stringify(bodyLines),
          answerDetails,
          answerImgPath,
          existing.id
        );
        riddleId = existing.id;
      } else {
        const { lastInsertRowid } = insertRiddle.run(
          riddleKey,
          headline,
          JSON.stringify(bodyLines),
          answerDetails,
          answerImgPath
        );
        riddleId = lastInsertRowid;
      }

      clearLinks.run(riddleId);

      choiceIds.forEach((choiceId, slotIndex) =>
        insertLink.run(riddleId, choiceId, slotIndex)
      );
    }
  })();
}
