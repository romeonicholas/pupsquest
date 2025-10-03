import { addAnswerChoices, addRiddles } from "../queries.ts";

export async function seedAnswerChoices() {
  const answerChoicesToSeed = [
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
      key: "eastern_red_cedar",
      display: "Eastern Red Cedar",
      imgPath: "/assets/images/riddles/icons/eastern_red_cedar.png",
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
      display: "Oldwife Moths",
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
    {
      key: "two",
      display: "Two",
      imgPath: "/assets/images/riddles/icons/two.png",
    },
    {
      key: "three",
      display: "Three",
      imgPath: "/assets/images/riddles/icons/three.png",
    },
    {
      key: "five",
      display: "Five",
      imgPath: "/assets/images/riddles/icons/five.png",
    },
  ];

  await addAnswerChoices(answerChoicesToSeed);
}

export async function seedRiddles() {
  const riddlesToSeed = [
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
        "Indian Blankets are also called firewheel flowers. They provide nectar for butterflies and bees, and their seeds are eaten by birds.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_indian_blanket.png",
      answerChoiceKeys: [
        "indian_blanket",
        "false_dandelion",
        "coreopsis",
        "purple_coneflower",
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
      answerChoiceKeys: ["armadillo", "porcupine", "swift_fox", "prairie_dog"],
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
        "Many people say the male painted bunting is the most beautiful bird in North America. Their colors only show up in their second year.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_painted_bunting.png",
      answerChoiceKeys: [
        "bunting_blue",
        "bunting_red",
        "bunting_green",
        "bunting_yellow",
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
        "Scissor-tailed flycatchers have special meanings for certain tribes, their feathers are sometimes worn in regalia to honor their significance.",
      answerImgPath: "images/riddles/answers/answer_image_temp_swallowtail.png",
      answerChoiceKeys: [
        "scissor_tailed_flycatcher",
        "red_tailed_hawk",
        "hummingbird",
        "prairie_falcon",
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
      answerChoiceKeys: [
        "collared_lizard_blue",
        "collared_lizard_red",
        "collared_lizard_orange",
        "collared_lizard_green",
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
      answerChoiceKeys: [
        "kangaroo_rat",
        "collared_lizard",
        "flying_squirrel",
        "goldfinch",
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
        "Jackrabbits can leap distances of up to 20 feet and run as fast as 40 miles per hour to escape predators.",
      answerImgPath: "images/riddles/answers/answer_image_temp_jackrabbit.png",
      answerChoiceKeys: [
        "jackrabbit",
        "bobcat",
        "black_bear",
        "pileated_woodpecker",
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
        "The Bullfrog is the largest frog in North America and can weigh as much as a football. They’re loud, too, and can be heard up to a half-mile away.",
      answerImgPath: "images/riddles/answers/answer_image_temp_bullfrog.png",
      answerChoiceKeys: ["bullfrog", "mountain_boomer", "bison", "goldfinch"],
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
        "They’re called Giant Walking Sticks for a reason: these are the longest insects in North America, growing up to 7 inches in length.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_giant_walking_stick.png",
      answerChoiceKeys: ["six", "four", "eight", "ten"],
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
      answerChoiceKeys: ["beaver", "black_bear", "bobcat", "boar"],
    },
    {
      riddleKey: "Monarch Butterfly",
      headline: "What plant am I on?",
      bodyLines: [
        "You know me, the Monarch Butterfly,",
        "but can you say on which plant I rely?",
        "Its flower blooms in the forest shade,",
        "and this is where all my eggs are laid!",
        "If you still can’t find me, don’t despair.",
        "The solution is easy: go ask the bear!",
      ],
      answerDetails:
        "Without milkweed plants, Monarch Butterflies would quickly die out. It’s the only plant where they can lay their eggs and their caterpillars can feed.",
      answerImgPath: "images/riddles/answers/monarch_butterfly.png",
      answerChoiceKeys: [
        "purple_milkweed",
        "indian_pink",
        "cattails",
        "arkansas_bluestar",
      ],
    },
    {
      riddleKey: "Leafcutter Ants",
      headline: "Who are we?",
      bodyLines: [
        "Answer me this, if you already know:",
        "What tiny critters help a fungus grow?",
        "Start at the river, then head to the right,",
        "past the milkweed, now we’re in sight!",
        "Below a blackbird with red on his wing,",
        "you’ll find us just doing our thing.",
      ],
      answerDetails:
        "Leafcutter Ants don’t eat the leaves they cut. They bring them back to their colony to ’feed’ a fungus—then they eat the fungus!",
      answerImgPath: "images/riddles/answers/leafcutter_ants.png",
      answerChoiceKeys: [
        "leafcutter_ants",
        "honey_bee",
        "oldwife_underwing_moths",
        "grasshoppers",
      ],
    },
    {
      riddleKey: "Bald Cypress",
      headline: "Which one am I?",
      bodyLines: [
        "Here’s a tip to help solve this quest:",
        "I dunk my trunk more than the rest.",
        "The river keeps my roots from drying,",
        "so look for me where fish are flying.",
        "One more hint for where to walk:",
        "right now I see a Red-Tailed Hawk.",
      ],
      answerDetails:
        "Most trees with needles will keep them all year. This one is named the Bald Cypress because every Fall it drops all its needles.",
      answerImgPath: "images/riddles/answers/bald_cypress.png",
      answerChoiceKeys: [
        "bald_cypress",
        "blackjack_oak",
        "eastern_redbud",
        "eastern_red_cedar",
      ],
    },
    {
      riddleKey: "Arkansas Bluestar",
      headline: "How many petals have I?",
      bodyLines: [
        "Blue is the color of the flowers I wear,",
        "How many petals per flower are there?",
        "Find me by the critters nearest me:",
        "bunting, squirrel, and honey bee.",
        "Too small you say? Then this will do:",
        "Look for the elk, he’s bigger than you!",
      ],
      answerDetails:
        "Despite its name, the Arkansas Bluestar is also native to Oklahoma. It grows in the Ouachita mountain range, which crosses both states.",
      answerImgPath: "images/riddles/answers/arkansas_bluestar.png",
      answerChoiceKeys: ["five", "six", "four", "three"],
    },
    {
      riddleKey: "Rose Rock",
      headline: "Who’s crawling on me?",
      bodyLines: [
        "I’m a Rose Rock, and rocks can’t see,",
        "So may I ask: who’s crawling on me?",
        "I’m hard to find, my numbers are few,",
        "But if milkweed’s near, then so are you.",
        "Here’s the last hint I’ll give you today:",
        "There’s a big black beast not far away!",
      ],
      answerDetails:
        "The Rose Rock is no rock—it’s a mineral! Outside of small amounts in Kansas, Morocco, and Australia, Rose Rocks are only found in Oklahoma.",
      answerImgPath: "images/riddles/answers/rose_rock.png",
      answerChoiceKeys: [
        "leafcutter_ants",
        "desert_scorpion",
        "giant_walking_stick",
        "stag_beetle",
      ],
    },
    {
      riddleKey: "Timber Rattlesnake",
      headline: "What’s on my skin?",
      bodyLines: [
        "My name is a clue.",
        "Find my home and solve the riddle too!",
        "I’ll tell you plainly where I’m at:",
        "deep in the woods, near a spotted cat.",
        "One more thing that may help to know:",
        "I’m next to a cave where climbers go.",
      ],
      answerDetails:
        "Timber Rattlesnakes are shy and prefer to avoid humans. They use their rattles as a defensive warning, not an aggressive signal to strike.",
      answerImgPath: "images/riddles/answers/timber_rattlesnake.png",
      answerChoiceKeys: ["bands", "diamonds", "spots", "stripe"],
    },
    {
      riddleKey: "Stag Beetle",
      headline: "Which one am I?",
      bodyLines: [
        "Smaller than a frog, bigger than a bee,",
        "my happy place is a broken down tree.",
        "Tried the forest? If not, you should.",
        "I’m easy to spot on a fallen wood.",
        "Start at the bobcat and go to the right.",
        "Come when it’s dark: I’m out at night!",
      ],
      answerDetails:
        "An adult Stag Beetle never eats, it only drinks—mostly tree sap and juice from rotting fruits. Those big claw things are just for fighting.",
      answerImgPath: "images/riddles/answers/stag_beetle.png",
      answerChoiceKeys: [
        "stag_beetle",
        "desert_scorpion",
        "kangaroo_rat",
        "horned_toad",
      ],
    },
    {
      riddleKey: "Blue Dasher Dragonfly",
      headline: "How many are we?",
      bodyLines: [
        "Dragonflies were given many hues,",
        "We’re the ones that got the blues!",
        "We’re hard to find, always flyin’ around.",
        "Today we’re near a tree that’s downed.",
        "In the forest, see the white-tailed deer?",
        "We’re in the flowers that are very near.",
      ],
      answerDetails:
        "Modern dragonfly wings are less than five inches, but a fossil of an ancient ancestor of dragonflies has been found with a wingspan longer than two feet.",
      answerImgPath: "images/riddles/answers/blue_dasher_dragonfly.png",
      answerChoiceKeys: ["two", "three", "four", "five"],
    },
    {
      riddleKey: "Goldfinch",
      headline: "Which one am I?",
      bodyLines: [
        "The tail of cat should make me wary,",
        "But the ones near me aren’t so scary.",
        "I’m out by the water, enjoying the day.",
        "I see a skunk, he’d better not spray!",
        "Look for the elk and keep going right,",
        "after a while you’ll see me—I’m bright!",
      ],
      answerDetails:
        "Other birds eats insects regularly, but the Goldfinch diet is very vegetarian—mostly they just eat seeds.",
      answerImgPath: "images/riddles/answers/goldfinch.png",
      answerChoiceKeys: ["goldfinch", "cardinal", "blue_jay", "crow"],
    },
    {
      riddleKey: "Respect",
      headline: "What’s the ’T’ made of?",
      bodyLines: [
        '"Respect" is written somewhere to see.',
        "If you find it, tell me: what’s the 'T'?",
        "Those prairie dogs, they dig so well,",
        "but did they really learn how to spell?",
        "In the central grove, see a place to sit?",
        '"The word "Respect" is written on it!',
      ],
      answerDetails:
        "Prairie dogs can’t spell, but their squeaky sounds are a complex language—they can even describe to each other what a predator looks like!",
      answerImgPath: "images/riddles/answers/respect.png",
      answerChoiceKeys: ["mushroom", "sticks", "feathers", "leaves"],
    },
  ];

  await addRiddles(riddlesToSeed);
}
