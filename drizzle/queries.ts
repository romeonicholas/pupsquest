import { db } from "./db";
import {
  userAnimals,
  userColors,
  users,
  gameStates,
  answerChoices,
  riddleAnswerChoices,
  riddles,
} from "./schema";
import { eq, asc } from "drizzle-orm";

export async function addUserAnimals(
  animals: { name: string; imgPath: string }[]
) {
  const insertedAnimals = await db
    .insert(userAnimals)
    .values(animals)
    .onConflictDoNothing()
    .returning({
      id: userAnimals.id,
      name: userAnimals.name,
      imgPath: userAnimals.imgPath,
    });
  return insertedAnimals;
}

export async function addUserColors(
  colors: { name: string; badgePath: string }[]
) {
  const insertedColors = await db
    .insert(userColors)
    .values(colors)
    .onConflictDoNothing()
    .returning({
      id: userColors.id,
      name: userColors.name,
      badgePath: userColors.badgePath,
    });
  return insertedColors;
}

export async function addAnswerChoices(
  choices: { key: string; display: string; imgPath: string }[]
) {
  const insertedChoices = await db
    .insert(answerChoices)
    .values(choices)
    .onConflictDoNothing()
    .returning({
      id: answerChoices.id,
      key: answerChoices.key,
      display: answerChoices.display,
      imgPath: answerChoices.imgPath,
    });
  return insertedChoices;
}

export async function getAllUserAnimals() {
  return db
    .select({
      id: userAnimals.id,
      name: userAnimals.name,
      imgPath: userAnimals.imgPath,
    })
    .from(userAnimals)
    .orderBy(asc(userAnimals.name));
}
