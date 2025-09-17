import {
  sqliteTable,
  AnySQLiteColumn,
  check,
  integer,
  text,
  index,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const userAnimals = sqliteTable("userAnimals", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  imgPath: text().notNull().unique(),
});

export const userColors = sqliteTable("userColors", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  badgePath: text().notNull().unique(),
});

export const answerChoices = sqliteTable(
  "answerChoices",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    key: text().notNull().unique(),
    display: text().notNull(),
    imgPath: text().notNull(),
  },
  (table) => [index("idx_answerChoices_display").on(table.display)]
);

export const riddles = sqliteTable(
  "riddles",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    riddleKey: text().notNull().unique(),
    headline: text().notNull(),
    body: text().notNull(),
    answerDetails: text().notNull(),
    answerImgPath: text().notNull(),
  },
  (table) => [
    check("riddles_check_1", sql`json_valid(body)`),
    check("riddles_check_2", sql`json_type(body) = 'array'`),
    check("riddles_check_3", sql`json_array_length(body) > 0`),
  ]
);

export const riddleAnswerChoices = sqliteTable(
  "riddleAnswerChoices",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    riddleId: integer()
      .notNull()
      .references(() => riddles.id, { onDelete: "cascade" }),
    answerChoiceId: integer()
      .notNull()
      .references(() => answerChoices.id, { onDelete: "restrict" }),
    slotIndex: integer().notNull(),
  },
  (table) => [
    index("idx_rac_choiceId").on(table.answerChoiceId),
    index("idx_rac_riddleId").on(table.riddleId),
    check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
  ]
);

export const users = sqliteTable(
  "users",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    userAnimal: integer()
      .notNull()
      .references(() => userAnimals.id),
    userColor: integer()
      .notNull()
      .references(() => userColors.id),
    createdAt: integer().default(sql`(strftime('%s','now'))`),
    scores: text().default("[]"),
    hasViewedExitPanel: integer().default(0),
  },
  (table) => [
    index("idx_users_createdAt").on(table.createdAt),
    check("users_check_5", sql`hasViewedExitPanel IN (0, 1)`),
    check("users_check_6", sql`json_valid(scores)`),
  ]
);

export const gameStates = sqliteTable(
  "gameStates",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    currentGuesses: text().notNull().default("[]"),
    hintsRemaining: integer().notNull().default(7),
    currentScore: integer().notNull().default(0),
    startingIndex: integer().notNull().default(0),
    riddleQueue: text().notNull(),
    queueCursor: integer().notNull().default(0),
    currentShuffledChoices: text().notNull().default("[]"),
    currentCorrectAnswerIndex: integer().notNull().default(0),
  },
  (table) => [
    index("idx_gameStates_userId").on(table.userId),
    check("gameStates_check_1", sql`json_valid(currentGuesses)`),
    check("gameStates_check_2", sql`json_valid(currentShuffledChoices)`),
  ]
);

export const migrations = sqliteTable("migrations", {
  id: integer().primaryKey({ autoIncrement: true }),
  filename: text().notNull(),
  executedAt: integer("executed_at")
    .default(sql`(strftime('%s','now'))`)
    .notNull(),
});
