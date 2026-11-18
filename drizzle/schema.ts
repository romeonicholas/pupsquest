import {
  pgTable,
  integer,
  text,
  check,
  index,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

type ShuffledChoice = {
  id: number;
  display: string;
  imgPath: string;
  slotIndex: number;
  isCorrect: boolean;
};

export const userAnimals = pgTable("user_animals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  imgPath: text().notNull().unique("user_animals_img_path_unique"),
});

export const userColors = pgTable("user_colors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  hex: text().notNull().unique(),
});

export const answerChoices = pgTable(
  "answer_choices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    key: text().notNull().unique(),
    display: text().notNull(),
    imgPath: text().notNull(),
  },
  (table) => [index("idx_answer_choices_display").on(table.display)],
);

export const riddles = pgTable(
  "riddles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riddleKey: text().notNull().unique("riddles_riddle_key_unique"),
    headline: text().notNull(),
    body: text().array().notNull(),
    answerDetails: text().notNull(),
    answerImgPath: text().notNull(),
  },
  (table) => [
    check("riddles_body_not_empty", sql`cardinality(${table.body}) > 0`),
  ],
);

export const riddleAnswerChoices = pgTable(
  "riddle_answer_choices",
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
    index("idx_rac_choice_id").on(table.answerChoiceId),
    index("idx_rac_riddle_id").on(table.riddleId),
    check(
      "riddle_answer_choices_slot_index_check",
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
    createdOnKiosk: boolean().notNull().default(false),
  },
  (table) => [
    index("idx_users_created_at").on(table.createdAt),
    uniqueIndex("users_color_animal_unique").on(
      table.userColor,
      table.userAnimal,
    ),
  ],
);

export const userAnalytics = pgTable(
  "user_analytics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdOnKiosk: boolean().notNull().default(false),
  },
  (table) => [index("idx_user_analytics_created_at").on(table.createdAt)],
);

export const gameStates = pgTable(
  "game_states",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique("game_states_user_id_unique"),
    currentGuesses: integer().array().notNull().default([]),
    hintsRemaining: integer().notNull().default(7),
    currentScore: integer().notNull().default(0),
    startingIndex: integer().notNull().default(0),
    riddleQueue: integer().array().notNull(),
    queueCursor: integer().notNull().default(0),
    currentShuffledChoices: jsonb()
      .$type<ShuffledChoice[]>()
      .notNull()
      .default([]),
    currentCorrectAnswerIndex: integer().notNull().default(0),
  },
  (table) => [index("idx_game_states_user_id").on(table.userId)],
);

export const riddleAnalytics = pgTable(
  "riddle_analytics",
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
    index("idx_ruo_riddle_id").on(table.riddleId),
    index("idx_ruo_created_at").on(table.createdAt),
    check(
      "riddle_analytics_check_hints_used_check",
      sql`${table.hintsUsed} IS NULL OR ${table.hintsUsed} >= 0`,
    ),
  ],
);
