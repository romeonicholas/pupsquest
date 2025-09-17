import { relations } from "drizzle-orm/relations";
import {
  answerChoices,
  riddleAnswerChoices,
  riddles,
  userColors,
  users,
  userAnimals,
  gameStates,
} from "./schema";

export const riddleAnswerChoicesRelations = relations(
  riddleAnswerChoices,
  ({ one }) => ({
    answerChoice: one(answerChoices, {
      fields: [riddleAnswerChoices.answerChoiceId],
      references: [answerChoices.id],
    }),
    riddle: one(riddles, {
      fields: [riddleAnswerChoices.riddleId],
      references: [riddles.id],
    }),
  })
);

export const answerChoicesRelations = relations(answerChoices, ({ many }) => ({
  riddleAnswerChoices: many(riddleAnswerChoices),
}));

export const riddlesRelations = relations(riddles, ({ many }) => ({
  riddleAnswerChoices: many(riddleAnswerChoices),
}));

export const usersRelations = relations(users, ({ one }) => ({
  userColor: one(userColors, {
    fields: [users.userColor],
    references: [userColors.id],
  }),
  userAnimal: one(userAnimals, {
    fields: [users.userAnimal],
    references: [userAnimals.id],
  }),
  gameState: one(gameStates, {
    fields: [users.id],
    references: [gameStates.userId],
  }),
}));

export const gameStatesRelations = relations(gameStates, ({ one }) => ({
  user: one(users, {
    fields: [gameStates.userId],
    references: [users.id],
  }),
}));

export const userColorsRelations = relations(userColors, ({ many }) => ({
  users: many(users),
}));

export const userAnimalsRelations = relations(userAnimals, ({ many }) => ({
  users: many(users),
}));
