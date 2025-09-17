import { addUserAnimals, addUserColors } from "../queries.ts";

export async function seedAnimals() {
  const animals = [
    {
      name: "Armadillo",
      imgPath: "assets/images/userCreation/badges/badge_icon_armadillo.png",
    },
    {
      name: "Hummingbird",
      imgPath: "assets/images/userCreation/badges/badge_icon_hummingbird.png",
    },
    {
      name: "Porcupine",
      imgPath: "assets/images/userCreation/badges/badge_icon_porcupine.png",
    },
    {
      name: "Prairie Dog",
      imgPath: "assets/images/userCreation/badges/badge_icon_prairie_dog.png",
    },
    {
      name: "Bullfrog",
      imgPath: "assets/images/userCreation/badges/badge_icon_bullfrog.png",
    },
    {
      name: "Turtle",
      imgPath: "assets/images/userCreation/badges/badge_icon_turtle.png",
    },
    {
      name: "Scorpion",
      imgPath: "assets/images/userCreation/badges/badge_icon_scorpion.png",
    },
    {
      name: "Spider",
      imgPath: "assets/images/userCreation/badges/badge_icon_spider.png",
    },
    {
      name: "Crow",
      imgPath: "assets/images/userCreation/badges/badge_icon_crow.png",
    },
    {
      name: "Eagle",
      imgPath: "assets/images/userCreation/badges/badge_icon_eagle.png",
    },
    {
      name: "Woodpecker",
      imgPath: "assets/images/userCreation/badges/badge_icon_woodpecker.png",
    },
    {
      name: "Chicken",
      imgPath: "assets/images/userCreation/badges/badge_icon_chicken.png",
    },
    {
      name: "Falcon",
      imgPath: "assets/images/userCreation/badges/badge_icon_falcon.png",
    },
    {
      name: "Hawk",
      imgPath: "assets/images/userCreation/badges/badge_icon_hawk.png",
    },
    {
      name: "Flycatcher",
      imgPath: "assets/images/userCreation/badges/badge_icon_flycatcher.png",
    },
    {
      name: "Turkey",
      imgPath: "assets/images/userCreation/badges/badge_icon_turkey.png",
    },
    {
      name: "Bass",
      imgPath: "assets/images/userCreation/badges/badge_icon_bass.png",
    },
    {
      name: "Mushroom",
      imgPath: "assets/images/userCreation/badges/badge_icon_mushroom.png",
    },
    {
      name: "Dragonfly",
      imgPath: "assets/images/userCreation/badges/badge_icon_dragonfly.png",
    },
    {
      name: "Grasshopper",
      imgPath: "assets/images/userCreation/badges/badge_icon_grasshopper.png",
    },
    {
      name: "Honey Bee",
      imgPath: "assets/images/userCreation/badges/badge_icon_honey_bee.png",
    },
    {
      name: "Ant",
      imgPath: "assets/images/userCreation/badges/badge_icon_ant.png",
    },
    {
      name: "Butterfly",
      imgPath: "assets/images/userCreation/badges/badge_icon_butterfly.png",
    },
    {
      name: "Moth",
      imgPath: "assets/images/userCreation/badges/badge_icon_moth.png",
    },
    {
      name: "Beetle",
      imgPath: "assets/images/userCreation/badges/badge_icon_beetle.png",
    },
    {
      name: "Bat",
      imgPath: "assets/images/userCreation/badges/badge_icon_bat.png",
    },
    {
      name: "Beaver",
      imgPath: "assets/images/userCreation/badges/badge_icon_beaver.png",
    },
    {
      name: "Buffalo",
      imgPath: "assets/images/userCreation/badges/badge_icon_buffalo.png",
    },
    {
      name: "Bear",
      imgPath: "assets/images/userCreation/badges/badge_icon_bear.png",
    },
    {
      name: "Boar",
      imgPath: "assets/images/userCreation/badges/badge_icon_boar.png",
    },
    {
      name: "Bobcat",
      imgPath: "assets/images/userCreation/badges/badge_icon_bobcat.png",
    },
    {
      name: "Coyote",
      imgPath: "assets/images/userCreation/badges/badge_icon_coyote.png",
    },
    {
      name: "Elk",
      imgPath: "assets/images/userCreation/badges/badge_icon_elk.png",
    },
    {
      name: "Jackrabbit",
      imgPath: "assets/images/userCreation/badges/badge_icon_jackrabbit.png",
    },
    {
      name: "Opossum",
      imgPath: "assets/images/userCreation/badges/badge_icon_opossum.png",
    },
    {
      name: "Ringtail",
      imgPath: "assets/images/userCreation/badges/badge_icon_ringtail.png",
    },
    {
      name: "Squirrel",
      imgPath: "assets/images/userCreation/badges/badge_icon_squirrel.png",
    },
    {
      name: "Skunk",
      imgPath: "assets/images/userCreation/badges/badge_icon_skunk.png",
    },
    {
      name: "Fox",
      imgPath: "assets/images/userCreation/badges/badge_icon_fox.png",
    },
    {
      name: "Deer",
      imgPath: "assets/images/userCreation/badges/badge_icon_deer.png",
    },
    {
      name: "Snake",
      imgPath: "assets/images/userCreation/badges/badge_icon_snake.png",
    },
    {
      name: "Lizard",
      imgPath: "assets/images/userCreation/badges/badge_icon_lizard.png",
    },
  ];

  return addUserAnimals(animals);
}

export async function seedColors() {
  const colors = [
    { name: "Red", badgePath: "assets/images/userCreation/badge_red.png" },
    {
      name: "Yellow",
      badgePath: "assets/images/userCreation/badge_yellow.png",
    },
    { name: "Green", badgePath: "assets/images/userCreation/badge_green.png" },
    { name: "Blue", badgePath: "assets/images/userCreation/badge_blue.png" },
  ];

  return addUserColors(colors);
}
