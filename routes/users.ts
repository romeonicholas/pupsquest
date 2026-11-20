import { Router } from "express";
import {
  updateUserAndGameState,
  getUserAndGameState,
  createUserAndGameState,
  getColorsAndAnimalsForUserCreation,
  getAllAnimalsFromUsersWithColor,
} from "../drizzle/queries.ts";
import { parseId } from "./parse-input.ts";
import { logger } from "../logger.ts";

const router = Router();

router.post("/api/signout", async (req, res) => {
  try {
    const { scores, hasViewedExitPanel, gameState } = req.body;
    const userId = parseId(req.body.userId);

    if (userId == null) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const processedGameState = {
      startingIndex: gameState.startingIndex,
      queueCursor: gameState.queueCursor,
      currentGuesses: gameState.currentGuesses || [],
      riddleQueue: gameState.riddleQueue || [],
      currentShuffledChoices: gameState.currentShuffledChoices || [],
      currentCorrectAnswerIndex: gameState.currentCorrectAnswerIndex ?? 0,
      hintsRemaining: gameState.hintsRemaining ?? 7,
      currentScore: gameState.currentScore ?? 0,
    };

    const result = await updateUserAndGameState(
      userId,
      {
        scores: scores || [],
        hasViewedExitPanel: Boolean(hasViewedExitPanel),
      },
      processedGameState,
    );

    if (!result.user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User and game state updated successfully: ", result });
  } catch (error) {
    logger.error({ err: error }, "Error updating user");
    res.status(500).json({ error: "Failed to update user and game state" });
  }
});

router.get("/api/users", async (req, res) => {
  const colorId = parseId(req.query.colorId);
  const animalId = parseId(req.query.animalId);

  if (colorId == null || animalId == null) {
    return res
      .status(400)
      .json({ error: "Missing or invalid colorId or animalId" });
  }

  try {
    const user = await getUserAndGameState(colorId, animalId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error({ err: error }, "Error fetching user");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/api/users", async (req, res) => {
  try {
    const colorId = parseId(req.body.colorId);
    const animalId = parseId(req.body.animalId);
    const isKiosk = Boolean(req.body.isKiosk);

    if (colorId == null || animalId == null) {
      return res
        .status(400)
        .json({ error: "Missing or invalid colorId or animalId" });
    }

    const newUser = await createUserAndGameState(colorId, animalId, isKiosk);

    if (!newUser) {
      return res
        .status(409)
        .json({ error: "This color and animal combination is already taken" });
    }

    res.status(201).json(newUser);
  } catch (error) {
    logger.error({ err: error }, "Error creating user");
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/api/users/creation-options", async (req, res) => {
  try {
    const options = await getColorsAndAnimalsForUserCreation();
    res.json(options);
  } catch (error) {
    logger.error({ err: error }, "Error fetching user creation options");
    res.status(500).json({ error: "Failed to fetch user creation options" });
  }
});

router.get("/api/users/rejoin-options", async (req, res) => {
  const colorId = parseId(req.query.colorId);

  if (colorId == null) {
    return res.status(400).json({ error: "Missing or invalid colorId" });
  }

  try {
    const animals = await getAllAnimalsFromUsersWithColor(colorId);
    res.json(animals);
  } catch (error) {
    logger.error({ err: error }, "Error fetching rejoin options");
    res.status(500).json({ error: "Failed to fetch rejoin options" });
  }
});

export default router;
