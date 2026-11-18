import { addUserAnimals, addUserColors } from "../queries.ts";

export async function seedAnimals() {
  const animalsToSeed = [
    {
      name: "Armadillo",
      imgPath: "/images/userCreation/badges/badge_icon_armadillo.png",
    },
    {
      name: "Hummingbird",
      imgPath: "/images/userCreation/badges/badge_icon_hummingbird.png",
    },
    {
      name: "Porcupine",
      imgPath: "/images/userCreation/badges/badge_icon_porcupine.png",
    },
    {
      name: "Prairie Dog",
      imgPath: "/images/userCreation/badges/badge_icon_prairie_dog.png",
    },
    {
      name: "Bullfrog",
      imgPath: "/images/userCreation/badges/badge_icon_bullfrog.png",
    },
    {
      name: "Turtle",
      imgPath: "/images/userCreation/badges/badge_icon_turtle.png",
    },
    {
      name: "Scorpion",
      imgPath: "/images/userCreation/badges/badge_icon_scorpion.png",
    },
    {
      name: "Spider",
      imgPath: "/images/userCreation/badges/badge_icon_spider.png",
    },
    {
      name: "Crow",
      imgPath: "/images/userCreation/badges/badge_icon_crow.png",
    },
    {
      name: "Eagle",
      imgPath: "/images/userCreation/badges/badge_icon_eagle.png",
    },
    {
      name: "Woodpecker",
      imgPath: "/images/userCreation/badges/badge_icon_woodpecker.png",
    },
    {
      name: "Chicken",
      imgPath: "/images/userCreation/badges/badge_icon_chicken.png",
    },
    {
      name: "Falcon",
      imgPath: "/images/userCreation/badges/badge_icon_falcon.png",
    },
    {
      name: "Hawk",
      imgPath: "/images/userCreation/badges/badge_icon_hawk.png",
    },
    {
      name: "Flycatcher",
      imgPath: "/images/userCreation/badges/badge_icon_flycatcher.png",
    },
    {
      name: "Turkey",
      imgPath: "/images/userCreation/badges/badge_icon_turkey.png",
    },
    {
      name: "Bass",
      imgPath: "/images/userCreation/badges/badge_icon_bass.png",
    },
    {
      name: "Mushroom",
      imgPath: "/images/userCreation/badges/badge_icon_mushroom.png",
    },
    {
      name: "Dragonfly",
      imgPath: "/images/userCreation/badges/badge_icon_dragonfly.png",
    },
    {
      name: "Grasshopper",
      imgPath: "/images/userCreation/badges/badge_icon_grasshopper.png",
    },
    {
      name: "Honey Bee",
      imgPath: "/images/userCreation/badges/badge_icon_honey_bee.png",
    },
    {
      name: "Ant",
      imgPath: "/images/userCreation/badges/badge_icon_ant.png",
    },
    {
      name: "Butterfly",
      imgPath: "/images/userCreation/badges/badge_icon_butterfly.png",
    },
    {
      name: "Moth",
      imgPath: "/images/userCreation/badges/badge_icon_moth.png",
    },
    {
      name: "Beetle",
      imgPath: "/images/userCreation/badges/badge_icon_beetle.png",
    },
    {
      name: "Bat",
      imgPath: "/images/userCreation/badges/badge_icon_bat.png",
    },
    {
      name: "Beaver",
      imgPath: "/images/userCreation/badges/badge_icon_beaver.png",
    },
    {
      name: "Buffalo",
      imgPath: "/images/userCreation/badges/badge_icon_buffalo.png",
    },
    {
      name: "Bear",
      imgPath: "/images/userCreation/badges/badge_icon_bear.png",
    },
    {
      name: "Boar",
      imgPath: "/images/userCreation/badges/badge_icon_boar.png",
    },
    {
      name: "Bobcat",
      imgPath: "/images/userCreation/badges/badge_icon_bobcat.png",
    },
    {
      name: "Coyote",
      imgPath: "/images/userCreation/badges/badge_icon_coyote.png",
    },
    {
      name: "Elk",
      imgPath: "/images/userCreation/badges/badge_icon_elk.png",
    },
    {
      name: "Jackrabbit",
      imgPath: "/images/userCreation/badges/badge_icon_jackrabbit.png",
    },
    {
      name: "Opossum",
      imgPath: "/images/userCreation/badges/badge_icon_opossum.png",
    },
    {
      name: "Ringtail",
      imgPath: "/images/userCreation/badges/badge_icon_ringtail.png",
    },
    {
      name: "Squirrel",
      imgPath: "/images/userCreation/badges/badge_icon_squirrel.png",
    },
    {
      name: "Skunk",
      imgPath: "/images/userCreation/badges/badge_icon_skunk.png",
    },
    {
      name: "Fox",
      imgPath: "/images/userCreation/badges/badge_icon_fox.png",
    },
    {
      name: "Deer",
      imgPath: "/images/userCreation/badges/badge_icon_deer.png",
    },
    {
      name: "Snake",
      imgPath: "/images/userCreation/badges/badge_icon_snake.png",
    },
    {
      name: "Lizard",
      imgPath: "/images/userCreation/badges/badge_icon_lizard.png",
    },
  ];

  return addUserAnimals(animalsToSeed);
}

export async function seedColors() {
  const colorsToSeed = [
    {
      name: "Red",
      hex: "#D95A4C",
    },
    {
      name: "Yellow",
      hex: "#EBBD4F",
    },
    {
      name: "Green",
      hex: "#8AA653",
    },
    {
      name: "Blue",
      hex: "#59A4B2",
    },
    {
      name: "Purple",
      hex: "#A67B9A",
    },
    {
      name: "Orange",
      hex: "#EA8E48",
    },
    {
      name: "Brown",
      hex: "#99785B",
    },
    {
      name: "Silver",
      hex: "#B0B3AA",
    },
  ];

  return addUserColors(colorsToSeed);
}
