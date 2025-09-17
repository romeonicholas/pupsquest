import { sqliteTable, AnySQLiteColumn, check, integer, text, index, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const userAnimals = sqliteTable("userAnimals", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	imgPath: text().notNull(),
},
(table) => [
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const userColors = sqliteTable("userColors", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	hex: text().notNull(),
	badgePath: text().notNull(),
},
(table) => [
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const answerChoices = sqliteTable("answerChoices", {
	id: integer().primaryKey({ autoIncrement: true }),
	key: text().notNull(),
	display: text().notNull(),
	imgPath: text().notNull(),
},
(table) => [
	index("idx_answerChoices_display").on(table.display),
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const riddles = sqliteTable("riddles", {
	id: integer().primaryKey({ autoIncrement: true }),
	riddleKey: text().notNull(),
	headline: text().notNull(),
	body: text().notNull(),
	answerDetails: text().notNull(),
	answerImgPath: text().notNull(),
},
(table) => [
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const riddleAnswerChoices = sqliteTable("riddleAnswerChoices", {
	id: integer().primaryKey({ autoIncrement: true }),
	riddleId: integer().notNull().references(() => riddles.id, { onDelete: "cascade" } ),
	answerChoiceId: integer().notNull().references(() => answerChoices.id, { onDelete: "restrict" } ),
	slotIndex: integer().notNull(),
},
(table) => [
	index("idx_rac_choiceId").on(table.answerChoiceId),
	index("idx_rac_riddleId").on(table.riddleId),
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }),
	userAnimal: integer().notNull().references(() => userAnimals.id),
	userColor: integer().notNull().references(() => userColors.id),
	gameState: text().default("{\"currentRiddleId\":0,\"currentGuesses\":[],\"hintsRemaining\":7,\"currentScore\":0,\"startingIndex\":0,\"currentShuffledChoices\":[],\"currentCorrectAnswerIndex\":0}").notNull(),
	createdAt: integer(),
	scores: text().default("[]"),
	hasViewedExitPanel: integer().default(0),
},
(table) => [
	index("idx_users_createdAt").on(table.createdAt),
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

export const migrations = sqliteTable("migrations", {
	id: integer().primaryKey({ autoIncrement: true }),
	filename: text().notNull(),
	executedAt: integer("executed_at").default(sql`(strftime('%s','now'))`).notNull(),
},
(table) => [
	check("riddles_check_1", sql`json_valid(body`),
	check("riddles_check_2", sql`json_type(body`),
	check("riddles_check_3", sql`json_array_length(body`),
	check("riddleAnswerChoices_check_4", sql`slotIndex BETWEEN 0 AND 3`),
	check("users_check_5", sql`hasViewedExitPanel IN (0, 1`),
	check("users_check_6", sql`json_valid(gameState`),
]);

