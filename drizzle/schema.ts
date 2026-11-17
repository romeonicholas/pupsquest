import { check, index } from "drizzle-orm/sqlite-core";
import {
  pgTable,
  integer,
  text,
  check as pgCheck,
  index as pgIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userAnimals = pgTable("userAnimals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  imgPath: text().notNull().unique(),
});

export const userColors = pgTable("userColors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  hex: text().notNull().unique(),
  badgePath: text().notNull().unique(),
});

export const answerChoices = pgTable(
  "answerChoices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    key: text().notNull().unique(),
    display: text().notNull(),
    imgPath: text().notNull(),
  },
  (table) => [pgIndex("idx_answerChoices_display").on(table.display)],
);

export const riddles = pgTable(
  "riddles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riddleKey: text().notNull().unique(),
    headline: text().notNull(),
    body: text().notNull(),
    answerDetails: text().notNull(),
    answerImgPath: text().notNull(),
  },
  (table) => [
    pgCheck("riddles_check_1", sql`json_valid(body)`),
    pgCheck("riddles_check_2", sql`json_type(body) = 'array'`),
    pgCheck("riddles_check_3", sql`json_array_length(body) > 0`),
  ],
);

export const riddleAnswerChoices = pgTable(
  "riddleAnswerChoices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riddleId: integer()
      .notNull()
      .references(() => riddles.id, { onDelete: "cascade" }),
    answerChoiceId: integer()
      .notNull()
      .references(() => answerChoices.id, { onDelete: "restrict" }),
    slotIndex: integer().notNull(),
  },
  (table) => [
    pgIndex("idx_rac_choiceId").on(table.answerChoiceId),
    pgIndex("idx_rac_riddleId").on(table.riddleId),
    pgCheck("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
  ],
);

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userAnimal: integer()
      .notNull()
      .references(() => userAnimals.id),
    userColor: integer()
      .notNull()
      .references(() => userColors.id),
    createdAt: integer()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    scores: text().default("[]"),
    hasViewedExitPanel: integer().default(0),
    createdLocally: integer().notNull().default(0),
  },
  (table) => [
    pgIndex("idx_users_createdAt").on(table.createdAt),
    pgCheck("users_check_5", sql`hasViewedExitPanel IN (0, 1)`),
    pgCheck("users_check_6", sql`json_valid(scores)`),
    pgCheck("users_check_7", sql`createdLocally IN (0, 1)`),
  ],
);

export const userAnalytics = pgTable(
  "userAnalytics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: integer()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    createdLocally: integer().notNull().default(0),
  },
  (table) => [
    pgIndex("idx_userAnalytics_createdAt").on(table.createdAt),
    pgCheck("userAnalytics_check_1", sql`createdLocally IN (0, 1)`),
  ],
);

export const gameStates = pgTable(
  "gameStates",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
    pgIndex("idx_gameStates_userId").on(table.userId),
    pgCheck("gameStates_check_1", sql`json_valid(currentGuesses)`),
    pgCheck("gameStates_check_2", sql`json_valid(currentShuffledChoices)`),
  ],
);

export const riddleAnalytics = pgTable(
  "riddleAnalytics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riddleId: integer()
      .notNull()
      .references(() => riddles.id, { onDelete: "restrict" }),
    createdAt: integer()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    wasAnswered: integer().notNull().default(0),
    wasAnsweredCorrectly: integer(),
    hintsUsed: integer(),
  },
  (table) => [
    pgIndex("idx_ruo_riddleId").on(table.riddleId),
    pgIndex("idx_ruo_createdAt").on(table.createdAt),
    pgCheck("riddleAnalytics_check_1", sql`wasAnswered IN (0, 1)`),
    pgCheck(
      "riddleAnalytics_check_2",
      sql`wasAnsweredCorrectly IS NULL OR wasAnsweredCorrectly IN (0, 1)`,
    ),
    pgCheck(
      "riddleAnalytics_check_3",
      sql`hintsUsed IS NULL OR hintsUsed >= 0`,
    ),
  ],
);
