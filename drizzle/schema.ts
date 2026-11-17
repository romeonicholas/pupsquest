import {
  pgTable,
  integer,
  text,
  check,
  index,
  boolean,
  timestamp,
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
  (table) => [index("idx_answerChoices_display").on(table.display)],
);

export const riddles = pgTable("riddles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  riddleKey: text().notNull().unique(),
  headline: text().notNull(),
  body: text().notNull(),
  answerDetails: text().notNull(),
  answerImgPath: text().notNull(),
});

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
    index("idx_rac_choiceId").on(table.answerChoiceId),
    index("idx_rac_riddleId").on(table.riddleId),
    check(
      "riddleAnswerChoices_check_4",
      sql`${table.slotIndex} BETWEEN 0 AND 3`,
    ),
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
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    scores: integer().array().notNull().default([]),
    hasViewedExitPanel: boolean().notNull().default(false),
    createdLocally: boolean().notNull().default(false),
  },
  (table) => [index("idx_users_createdAt").on(table.createdAt)],
);

export const userAnalytics = pgTable(
  "userAnalytics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdLocally: boolean().notNull().default(false),
  },
  (table) => [index("idx_userAnalytics_createdAt").on(table.createdAt)],
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
  (table) => [index("idx_gameStates_userId").on(table.userId)],
);

export const riddleAnalytics = pgTable(
  "riddleAnalytics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riddleId: integer()
      .notNull()
      .references(() => riddles.id, { onDelete: "restrict" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    wasAnswered: boolean().notNull().default(false),
    wasAnsweredCorrectly: boolean(),
    hintsUsed: integer(),
  },
  (table) => [
    index("idx_ruo_riddleId").on(table.riddleId),
    index("idx_ruo_createdAt").on(table.createdAt),
    check(
      "riddleAnalytics_check_3",
      sql`${table.hintsUsed} IS NULL OR ${table.hintsUsed} >= 0`,
    ),
  ],
);
