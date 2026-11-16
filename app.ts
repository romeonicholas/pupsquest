import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  getUsedColorIds,
  getAllAnimalsFromUsersWithColor,
  getColorsAndAnimalsForUserCreation,
  createUserAndGameState,
  getUserAndGameState,
  updateUserAndGameState,
  getAverageScore,
  addRiddleAnalytics,
} from "./drizzle/queries.ts";

import riddlesRouter from "./routes/riddles.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/signout", async (req, res) => {
  try {
    const { userId, scores, hasViewedExitPanel, gameState } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const processedGameState = {
      ...gameState,
      currentGuesses: JSON.stringify(gameState.currentGuesses || []),
      riddleQueue: JSON.stringify(gameState.riddleQueue || []),
      currentShuffledChoices: JSON.stringify(
        gameState.currentShuffledChoices || [],
      ),
      currentCorrectAnswerIndex: gameState.currentCorrectAnswerIndex ?? 0,
      hintsRemaining: gameState.hintsRemaining ?? 7,
      currentScore: gameState.currentScore ?? 0,
    };

    const result = await updateUserAndGameState(
      userId,
      {
        scores: JSON.stringify(scores || []),
        hasViewedExitPanel: hasViewedExitPanel ? 1 : 0,
      },
      processedGameState,
    );

    res.json({ message: "User and game state updated successfully: ", result });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Failed to update user and game state" });
  }
});

app.get("/api/users", async (req, res) => {
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

app.get("/api/stats/average-score", async (req, res) => {
  try {
    const data = await getAverageScore();
    res.json(data);
  } catch (error) {
    console.error("Error calculating average scores: ", error);
    res.status(500).json({ error: "Failed to calculate average scores" });
  }
});

app.post("/api/users", async (req, res) => {
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

function renderPartial(res: express.Response, template: string, data: any) {
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

app.get("/api/users/create-html", async (req, res) => {
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

app.get("/api/colors/used", async (req, res) => {
  try {
    const colors = await getUsedColorIds();
    res.json(colors);
  } catch (error) {
    console.error("Error fetching used colors: ", error);
    res.status(500).json({ error: "Failed to fetch used colors" });
  }
});

app.get("/api/animals/existing/html", async (req, res) => {
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

app.use(riddlesRouter);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  const isVisitor = req.query.device === "visitor";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!isVisitor) {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ipAddress = req.ip;
    console.log(`${date} ${time}: ${ipAddress} connected`);
  }

  res.render("index", { isVisitor, date });
});

export default app;
