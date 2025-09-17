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
import { eq, and, notInArray, sql } from "drizzle-orm";

export async function addUserAnimals(
  animals: { name: string; imgPath: string }[]
) {
  const insertedAnimals = await db
    .insert(userAnimals)
    .values(animals)
    .onConflictDoNothing()
    .returning();
  return insertedAnimals;
}

export async function createUser(colorId: number, animalId: number) {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.userColor, colorId), eq(users.userAnimal, animalId)))
    .limit(1);

  if (existingUser) {
    throw new Error("This color and animal combination is already taken.");
  }

  const [newUser] = await db
    .insert(users)
    .values({
      userColor: colorId,
      userAnimal: animalId,
    })
    .returning();

  const riddleIds = await db
    .select({ id: riddles.id })
    .from(riddles)
    .orderBy(sql`RANDOM()`);

  const queue = riddleIds.map((r) => r.id);

  const [newGameState] = await db
    .insert(gameStates)
    .values({
      userId: newUser.id,
      riddleQueue: JSON.stringify(queue),
    })
    .returning();

  return {
    user: newUser,
    gameState: {
      ...newGameState,
      currentGuesses: JSON.parse(newGameState.currentGuesses),
      riddleQueue: JSON.parse(newGameState.riddleQueue), // Parse back to array
      currentShuffledChoices: JSON.parse(newGameState.currentShuffledChoices),
    },
  };
}

export async function getAvailableAnimalsForColor(colorId: number) {
  const takenAnimalIdsSubquery = db
    .select({ animalId: users.userAnimal })
    .from(users)
    .where(eq(users.userAnimal, colorId));

  const availableAnimals = await db
    .select({
      id: userAnimals.id,
      name: userAnimals.name,
      imgPath: userAnimals.imgPath,
    })
    .from(userAnimals)
    .where(notInArray(userAnimals.id, takenAnimalIdsSubquery))
    .orderBy(sql`RANDOM()`)
    .limit(8);

  return availableAnimals;
}

export async function addUserColors(
  colors: { name: string; badgePath: string }[]
) {
  const insertedColors = await db
    .insert(userColors)
    .values(colors)
    .onConflictDoNothing()
    .returning();
  return insertedColors;
}

export async function addAnswerChoices(
  choicesToSeed: { key: string; display: string; imgPath: string }[]
) {
  const insertedChoices = await db
    .insert(answerChoices)
    .values(choicesToSeed)
    .onConflictDoNothing()
    .returning();
  return insertedChoices;
}

export async function addRiddles(
  riddlesToSeed: {
    riddleKey: string;
    headline: string;
    bodyLines: string[];
    answerDetails: string;
    answerImgPath: string;
    answerChoiceKeys: string[];
  }[]
) {
  const allAnswerChoices = await db
    .select({
      id: answerChoices.id,
      key: answerChoices.key,
    })
    .from(answerChoices);

  const answerChoiceMap = new Map();
  allAnswerChoices.forEach((ac) => answerChoiceMap.set(ac.key, ac.id));

  for (const riddleData of riddlesToSeed) {
    const [newRiddle] = await db
      .insert(riddles)
      .values({
        riddleKey: riddleData.riddleKey,
        headline: riddleData.headline,
        body: JSON.stringify(riddleData.bodyLines),
        answerDetails: riddleData.answerDetails,
        answerImgPath: riddleData.answerImgPath,
      })
      .returning();

    const newRiddleId = newRiddle.id;

    const choiceIds = riddleData.answerChoiceKeys.map((key) =>
      answerChoiceMap.get(key)
    );

    const riddleAnswerChoiceEntries = choiceIds.map((choiceId, index) => ({
      riddleId: newRiddleId,
      answerChoiceId: choiceId,
      slotIndex: index,
    }));

    await db.insert(riddleAnswerChoices).values(riddleAnswerChoiceEntries);
  }
}
