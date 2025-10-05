import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { client } from "./drizzle/db.ts";

import {
  get4UserColors,
  getUsedColorIds,
  getAllUserColors,
  getAvailableAnimalsForColor,
  getAllAnimalsFromUsersWithColor,
  getColorsAndAnimalsForUserCreation,
  createUserAndGameState,
  getUserAndGameState,
  updateUserAndGameState,
  deleteExpiredUsers,
  getRiddle,
  getAverageScore,
} from "./drizzle/queries.ts";

dotenv.config({ path: ".env", quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

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
        gameState.currentShuffledChoices || []
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
      processedGameState
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
  return new Promise((resolve, reject) => {
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

    const animalOptionsHtmlByColorId = {};
    for (const combination of combinations) {
      const animalOptionsHtml = await renderPartial(
        res,
        "partials/animal_options",
        {
          animals: combination.animals,
          isRejoin: false,
        }
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

app.get("/api/colors", async (req, res) => {
  try {
    const colors = await getAllUserColors();
    res.json(colors);
  } catch (error) {
    console.error("Error fetching colors: ", error);
    res.status(500).json({ error: "Failed to fetch colors" });
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

app.get("/api/colors/html", async (req, res) => {
  try {
    const colors = await get4UserColors();
    res.render("partials/color_picker", { colors }, (err, html) => {
      if (err) {
        console.error("Error rendering template:", err);
        return res.status(500).json({ error: "Error rendering template" });
      }
      res.json({ html: html, colors: colors });
    });
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).send("<p>Error loading colors</p>");
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

app.get("/api/animals/available-for-color", async (req, res) => {
  const colorId = Number(req.query.colorId);

  if (isNaN(colorId)) {
    return res.status(400).json({ error: "Missing or invalid colorId" });
  }

  try {
    const animals = await getAvailableAnimalsForColor(colorId);
    res.render("partials/animal_options", { animals, isRejoin: false });
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
  }
});

app.get("/api/riddles/:id", async (req, res) => {
  try {
    const riddleId = Number(req.params.id);

    if (isNaN(riddleId)) {
      return res.status(400).json({ error: "Invalid riddle ID" });
    }

    const riddle = await getRiddle(riddleId);

    if (!riddle) {
      return res.status(404).json({ error: "Riddle not found" });
    }

    res.json(riddle);
  } catch (error) {
    console.error("Error fetching riddle:", error);
    res.status(500).json({ error: "Failed to fetch riddle" });
  }
});

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

app.use("/assets", express.static(path.join(__dirname, "public")));

app.listen(PORT, HOST, async () => {
  console.log(`Started server on ${HOST}:${PORT}`);

  try {
    const numberOfDeletedUsers = await deleteExpiredUsers();
    if (numberOfDeletedUsers)
      console.log(`Deleted ${numberOfDeletedUsers} expired users`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Expired user deletion failed:", errorMessage);
  }
});

process.on("SIGINT", async () => {
  try {
    client.close();
    console.log("Database connection closed.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  try {
    client.close();
    console.log("Database connection closed.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});
