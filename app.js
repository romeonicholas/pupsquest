import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import { db } from "./db/init.js";
import { runAllSeeds } from "./db/seeds/index.js";
import { getAllRiddlesWithChoices } from "./db/queries/riddles.js";
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

dotenv.config({ path: ".env", quiet: true });

runAllSeeds(db);

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
  res.render("createNewUser");
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

app.post("/api/users", (req, res) => {
  const { colorId, animalId } = req.body;
  if (!colorId || !animalId) {
    return res.status(400).json({ error: "Missing colorId or animalId" });
  }

  try {
    createUser(db, { colorId, animalId });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
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
  if (!colorId) {
    return res.status(400).json({ error: "Missing colorId" });
  }

  try {
    const animals = getAvailableAnimalsForColor(db, colorId);
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
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

process.on("SIGINT", () => {
  try {
    db.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database:", error.message);
  }
  process.exit(0);
});
