import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import { openAndMigrate } from "./db/init.js";
import { seedUserColors } from "./db/seeds/userColors.js";
import { seedUserAnimals } from "./db/seeds/userAnimals.js";
import { seedUsers } from "./db/seeds/users.js";

dotenv.config();

export const db = openAndMigrate("./db/database.db");
seedUserColors(db);
seedUserAnimals(db);
seedUsers(db);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.use(express.json({ limit: "10mb" }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("index");
});

app.listen(PORT, HOST, () => {
  console.log(`👋 Started server on ${HOST}:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});
