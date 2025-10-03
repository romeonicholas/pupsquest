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
import { eq, and, notInArray, sql, lte, inArray } from "drizzle-orm";

export async function getUserColors() {
  const colors = await db
    .select({
      id: userColors.id,
      name: userColors.name,
      badgePath: userColors.badgePath,
    })
    .from(userColors)
    .orderBy(sql`RANDOM()`)
    .limit(8);

  return colors;
}

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

export async function createUserAndGameState(
  colorId: number,
  animalId: number
) {
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
    user: {
      ...newUser,
      scores: JSON.parse(newUser.scores || "[]"),
    },
    gameState: {
      ...newGameState,
      currentGuesses: JSON.parse(newGameState.currentGuesses || "[]"),
      riddleQueue: JSON.parse(newGameState.riddleQueue || "[]"),
      currentShuffledChoices: JSON.parse(
        newGameState.currentShuffledChoices || "[]"
      ),
    },
  };
}

export async function getUserAndGameState(colorId: number, animalId: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.userColor, colorId), eq(users.userAnimal, animalId)))
    .limit(1);

  if (!user) {
    return null;
  }

  const [gameState] = await db
    .select()
    .from(gameStates)
    .where(eq(gameStates.userId, user.id))
    .limit(1);

  if (!gameState) {
    throw new Error("Game state not found for the user.");
  }

  return {
    user: {
      ...user,
      scores: JSON.parse(user.scores || "[]"),
    },
    gameState: {
      ...gameState,
      currentGuesses: JSON.parse(gameState.currentGuesses || "[]"),
      riddleQueue: JSON.parse(gameState.riddleQueue || "[]"),
      currentShuffledChoices: JSON.parse(
        gameState.currentShuffledChoices || "[]"
      ),
    },
  };
}

type UserInsert = typeof users.$inferInsert;
type GameStateInsert = typeof gameStates.$inferInsert;

export async function updateUserAndGameState(
  userId: number,
  userUpdates: Partial<UserInsert>,
  gameStateUpdates: Partial<GameStateInsert>
) {
  const [updatedUser] = await db
    .update(users)
    .set(userUpdates)
    .where(eq(users.id, userId))
    .returning();

  const [updatedGameState] = await db
    .update(gameStates)
    .set(gameStateUpdates)
    .where(eq(gameStates.userId, userId))
    .returning();

  return {
    user: updatedUser,
    gameState: updatedGameState,
  };
}

export async function deleteExpiredUsers() {
  const expirationThreshold = Date.now() - 24 * 60 * 60 * 1000;

  const usersToDelete = await db
    .select({ id: users.id })
    .from(users)
    .where(lte(users.createdAt, expirationThreshold));

  if (usersToDelete.length > 0) {
    await db.delete(users).where(
      inArray(
        users.id,
        usersToDelete.map((u) => u.id)
      )
    );
  }

  return usersToDelete.length;
}

export async function getAverageScore() {
  const [result] = await db
    .select({
      averageScore: sql<number>`AVG(
        CASE 
          WHEN json_array_length(${users.scores}) = 0 THEN NULL
          ELSE (SELECT AVG(CAST(value AS INTEGER)) FROM json_each(${users.scores}))
        END
      )`,
    })
    .from(users)
    .where(sql`json_array_length(${users.scores}) > 0`);

  return {
    averageScore: result.averageScore || 0,
  };
}

export async function getAvailableAnimalsForColor(colorId: number) {
  const takenAnimalIdsSubquery = db
    .select({ animalId: users.userAnimal })
    .from(users)
    .where(eq(users.userColor, colorId));

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

export async function getAllAnimalsFromUsersWithColor(colorId: number) {
  const animals = await db
    .select({
      id: userAnimals.id,
      name: userAnimals.name,
      imgPath: userAnimals.imgPath,
    })
    .from(userAnimals)
    .innerJoin(users, eq(users.userAnimal, userAnimals.id))
    .where(eq(users.userColor, colorId))
    .groupBy(userAnimals.id);

  return animals;
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

export async function getRiddle(riddleId: number) {
  const [riddle] = await db
    .select()
    .from(riddles)
    .where(eq(riddles.id, riddleId))
    .limit(1);

  if (!riddle) return null;

  const answerChoicesForRiddle = await db
    .select({
      id: answerChoices.id,
      display: answerChoices.display,
      imgPath: answerChoices.imgPath,
      slotIndex: riddleAnswerChoices.slotIndex,
    })
    .from(answerChoices)
    .innerJoin(
      riddleAnswerChoices,
      eq(answerChoices.id, riddleAnswerChoices.answerChoiceId)
    )
    .where(eq(riddleAnswerChoices.riddleId, riddle.id))
    .orderBy(riddleAnswerChoices.slotIndex);

  return {
    id: riddle.id,
    riddleKey: riddle.riddleKey,
    headline: riddle.headline,
    body: JSON.parse(riddle.body),
    answerDetails: riddle.answerDetails,
    answerImgPath: riddle.answerImgPath,
    answerChoices: answerChoicesForRiddle.map((choice) => ({
      id: choice.id,
      display: choice.display,
      imgPath: choice.imgPath,
      slotIndex: choice.slotIndex,
      isCorrect: choice.slotIndex === 0,
    })),
  };
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
