import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

const { db } = await import("./db/init.js");

import {
  getRiddleById,
  getAllRiddlesWithChoices,
} from "./db/queries/riddles.js";
import { getAllDataForDashboard } from "./db/queries/all.js";
import {
  getAllColors,
  getAvailableAnimalsForColor,
  createUser,
} from "./db/queries/userCreate.js";
import {
  getAllColorsFromUsers,
  getAllAnimalsFromUsersWithColor,
  getUserByColorAndAnimal,
} from "./db/queries/userLogin.js";
import { removeExpiredUsers } from "./db/scripts/userRemoval.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.get("/new-user", (req, res) => {
  res.render("create_new_user");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/api/colors/from-users", async (req, res) => {
  try {
    const colors = await getAllColorsFromUsers(db);
    res.json(colors);
  } catch (error) {
    console.error("Error fetching user colors:", error);
    res.status(500).json({ error: "Failed to fetch user colors" });
  }
});

app.get("/api/users", (req, res) => {
  const { colorId, animalId } = req.query;

  if (!colorId || !animalId) {
    return res.status(400).json({ error: "Missing colorId or animalId" });
  }

  try {
    const user = getUserByColorAndAnimal(db, colorId, animalId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { colorId, animalId } = req.body;

    if (!colorId || !animalId) {
      return res.status(400).json({ error: "Missing colorId or animalId" });
    }

    const newUser = createUser(db, { colorId, animalId });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.message.includes("already taken")) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/colors", (req, res) => {
  try {
    const colors = getAllColors(db);
    res.json(colors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

app.get("/api/animals/existing", (req, res) => {
  try {
    const colorId = req.query.colorId;
    const animals = getAllAnimalsFromUsersWithColor(db, colorId);
    res.json(animals);
  } catch (error) {
    console.error("Error fetching existing animals:", error);
    res.status(500).json({ error: "Failed to fetch existing animals" });
  }
});

app.get("/api/animals/available", (req, res) => {
  const colorId = req.query.colorId;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  if (!colorId) {
    return res.status(400).json({ error: "Missing colorId" });
  }

  if (limit !== null && (isNaN(limit) || limit <= 0)) {
    return res.status(400).json({ error: "Invalid limit parameter" });
  }

  try {
    const animals = getAvailableAnimalsForColor(db, colorId, limit);
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
  }
});

app.get("/api/animals/available/html", (req, res) => {
  const colorId = req.query.colorId;
  const limit = req.query.limit ? parseInt(req.query.limit) : 8; // Default to 8

  if (!colorId) {
    return res.status(400).send("<p>Error: Missing colorId</p>");
  }

  try {
    const animals = getAvailableAnimalsForColor(db, colorId, limit);
    res.render("partials/animal_options", { animals });
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).send("<p>Error loading animals</p>");
  }
});

app.get("/db", (req, res) => {
  try {
    const data = getAllDataForDashboard(db);
    res.render("dbReview", { data });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.get("/api/riddles/:id", (req, res) => {
  const riddleId = parseInt(req.params.id, 10);
  if (isNaN(riddleId)) {
    return res.status(400).json({ error: "Invalid riddle ID" });
  }
  try {
    const riddle = getRiddleById(db, riddleId);
    if (!riddle) {
      return res.status(404).json({ error: "Riddle not found" });
    }
    res.json(riddle);
  } catch (error) {
    console.error("Error fetching riddle:", error);
    res.status(500).json({ error: "Failed to fetch riddle" });
  }
});

app.get("/riddles", (req, res) => {
  try {
    const data = getAllRiddlesWithChoices(db);
    res.json(data);
  } catch (error) {
    console.error("Error fetching riddles:", error);
    res.status(500).json({ error: "Failed to fetch riddles" });
  }
});

app.get("/", (request, response) => {
  response.render("index");
});

app.use("/assets", express.static(path.join(__dirname, "public")));

app.listen(PORT, HOST, () => {
  console.log(`Started server on ${HOST}:${PORT}`);
});

console.log("Expired users removed:", removeExpiredUsers(db));

setInterval(() => {
  try {
    const n = removeExpiredUsers(db);
    if (n) console.log(`[TTL] Deleted ${n} expired users`);
  } catch (e) {
    console.error("[TTL] cleanup failed:", e.message);
  }
}, 180 * 60 * 1000);

process.on("SIGINT", () => {
  try {
    db.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database:", error.message);
  }
  process.exit(0);
});
