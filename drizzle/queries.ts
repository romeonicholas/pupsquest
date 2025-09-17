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
  choicesToSeed: { key: string; display: string; imgPath: string }[]
) {
  const insertedChoices = await db
    .insert(answerChoices)
    .values(choicesToSeed)
    .onConflictDoNothing()
    .returning({
      id: answerChoices.id,
      key: answerChoices.key,
      display: answerChoices.display,
      imgPath: answerChoices.imgPath,
    });
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
      .returning({ id: riddles.id });

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
