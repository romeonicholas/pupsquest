import { Router, type Response } from "express";
import {
  updateUserAndGameState,
  getUserAndGameState,
  createUserAndGameState,
  getColorsAndAnimalsForUserCreation,
  getAllAnimalsFromUsersWithColor,
} from "../drizzle/queries.ts";

const router = Router();

router.post("/api/signout", async (req, res) => {
  try {
    const { userId, scores, hasViewedExitPanel, gameState } = req.body;

    if (!userId || isNaN(userId)) {
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

    res.json({ message: "User and game state updated successfully: ", result });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Failed to update user and game state" });
  }
});

router.get("/api/users", async (req, res) => {
  const colorId = Number(req.query.colorId);
  const animalId = Number(req.query.animalId);

  if (isNaN(Number(colorId)) || isNaN(Number(animalId))) {
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
    console.error("Error fetching user: ", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/api/users", async (req, res) => {
  try {
    const colorId = Number(req.body.colorId);
    const animalId = Number(req.body.animalId);
    const isVisitor = req.body.isVisitor;

    if (isNaN(colorId) || isNaN(animalId)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid colorId or animalId" });
    }

    const newUser = await createUserAndGameState(colorId, animalId, isVisitor);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user: ", error);

    res.status(500).json({ error: "Failed to create user" });
  }
});

function renderPartial(res: Response, template: string, data: any) {
  return new Promise<string>((resolve, reject) => {
    res.render(template, data, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
}

router.get("/api/users/create-html", async (req, res) => {
  try {
    const combinations = await getColorsAndAnimalsForUserCreation();

    const colors = combinations.map((combination) => combination.color);
    const colorPickerHtml = await renderPartial(res, "partials/color_picker", {
      colors,
    });

    const animalOptionsHtmlByColorId: Record<number, string> = {};
    for (const combination of combinations) {
      const animalOptionsHtml = await renderPartial(
        res,
        "partials/animal_options",
        {
          animals: combination.animals,
          isRejoin: false,
        },
      );
      animalOptionsHtmlByColorId[combination.color.id] = animalOptionsHtml;
    }

    res.json({
      colorPickerHtml: colorPickerHtml,
      animalOptionsByColorId: animalOptionsHtmlByColorId,
    });
  } catch (error) {
    console.error("Error generating user creation HTML: ", error);
    res.status(500).json({ error: "Failed to generate user creation HTML" });
  }
});

router.get("/api/animals/existing/html", async (req, res) => {
  const colorId = Number(req.query.colorId);

  if (!colorId) {
    return res.status(400).send("<p>Error: Missing colorId</p>");
  }

  try {
    const animals = await getAllAnimalsFromUsersWithColor(colorId);
    res.render("partials/animal_options", { animals, isRejoin: true });
  } catch (error) {
    console.error("Error fetching animals: ", error);
    res.status(500).send("<p>Error loading animals</p>");
  }
});

export default router;
