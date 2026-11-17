import {
  sqliteTable,
  check,
  integer,
  text,
  index,
} from "drizzle-orm/sqlite-core";
import {
  pgTable,
  integer as pgInteger,
  text as pgText,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userAnimals = pgTable("userAnimals", {
  id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
  name: pgText().notNull().unique(),
  imgPath: pgText().notNull().unique(),
});

export const userColors = pgTable("userColors", {
  id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
  name: pgText().notNull().unique(),
  hex: pgText().notNull().unique(),
  badgePath: pgText().notNull().unique(),
});

export const answerChoices = pgTable(
  "answerChoices",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    key: pgText().notNull().unique(),
    display: pgText().notNull(),
    imgPath: pgText().notNull(),
  },
  (table) => [index("idx_answerChoices_display").on(table.display)],
);

export const riddles = pgTable(
  "riddles",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    riddleKey: pgText().notNull().unique(),
    headline: pgText().notNull(),
    body: pgText().notNull(),
    answerDetails: pgText().notNull(),
    answerImgPath: pgText().notNull(),
  },
  (table) => [
    check("riddles_check_1", sql`json_valid(body)`),
    check("riddles_check_2", sql`json_type(body) = 'array'`),
    check("riddles_check_3", sql`json_array_length(body) > 0`),
  ],
);

export const riddleAnswerChoices = pgTable(
  "riddleAnswerChoices",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    riddleId: pgInteger()
      .notNull()
      .references(() => riddles.id, { onDelete: "cascade" }),
    answerChoiceId: pgInteger()
      .notNull()
      .references(() => answerChoices.id, { onDelete: "restrict" }),
    slotIndex: pgInteger().notNull(),
  },
  (table) => [
    index("idx_rac_choiceId").on(table.answerChoiceId),
    index("idx_rac_riddleId").on(table.riddleId),
    check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
  ],
);

export const users = pgTable(
  "users",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    userAnimal: pgInteger()
      .notNull()
      .references(() => userAnimals.id),
    userColor: pgInteger()
      .notNull()
      .references(() => userColors.id),
    createdAt: pgInteger()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    scores: pgText().default("[]"),
    hasViewedExitPanel: pgInteger().default(0),
    createdLocally: pgInteger().notNull().default(0),
  },
  (table) => [
    index("idx_users_createdAt").on(table.createdAt),
    check("users_check_5", sql`hasViewedExitPanel IN (0, 1)`),
    check("users_check_6", sql`json_valid(scores)`),
    check("users_check_7", sql`createdLocally IN (0, 1)`),
  ],
);

export const userAnalytics = pgTable(
  "userAnalytics",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: pgInteger()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    createdLocally: pgInteger().notNull().default(0),
  },
  (table) => [
    index("idx_userAnalytics_createdAt").on(table.createdAt),
    check("userAnalytics_check_1", sql`createdLocally IN (0, 1)`),
  ],
);

export const gameStates = pgTable(
  "gameStates",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    userId: pgInteger()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    currentGuesses: pgText().notNull().default("[]"),
    hintsRemaining: pgInteger().notNull().default(7),
    currentScore: pgInteger().notNull().default(0),
    startingIndex: pgInteger().notNull().default(0),
    riddleQueue: pgText().notNull(),
    queueCursor: pgInteger().notNull().default(0),
    currentShuffledChoices: pgText().notNull().default("[]"),
    currentCorrectAnswerIndex: pgInteger().notNull().default(0),
  },
  (table) => [
    index("idx_gameStates_userId").on(table.userId),
    check("gameStates_check_1", sql`json_valid(currentGuesses)`),
    check("gameStates_check_2", sql`json_valid(currentShuffledChoices)`),
  ],
);

export const riddleAnalytics = pgTable(
  "riddleAnalytics",
  {
    id: pgInteger().primaryKey().generatedAlwaysAsIdentity(),
    riddleId: pgInteger()
      .notNull()
      .references(() => riddles.id, { onDelete: "restrict" }),
    createdAt: pgInteger()
      .notNull()
      .default(sql`(strftime('%s','now'))`),
    wasAnswered: pgInteger().notNull().default(0),
    wasAnsweredCorrectly: pgInteger(),
    hintsUsed: pgInteger(),
  },
  (table) => [
    index("idx_ruo_riddleId").on(table.riddleId),
    index("idx_ruo_createdAt").on(table.createdAt),
    check("riddleAnalytics_check_1", sql`wasAnswered IN (0, 1)`),
    check(
      "riddleAnalytics_check_2",
      sql`wasAnsweredCorrectly IS NULL OR wasAnsweredCorrectly IN (0, 1)`,
    ),
    check("riddleAnalytics_check_3", sql`hintsUsed IS NULL OR hintsUsed >= 0`),
  ],
);
