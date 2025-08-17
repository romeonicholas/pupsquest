import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import { db } from "./db/init.js";
import { runAllSeeds } from "./db/seeds/index.js";
import { getAllDataForDashboard } from "./db/queries/all.js";

dotenv.config();

console.log("Database status before seeds:", !db.open ? "closed" : "open");
runAllSeeds(db);
console.log("Database status after seeds:", !db.open ? "closed" : "open");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.get("/db", (req, res) => {
  try {
    const data = getAllDataForDashboard(db);
    res.render("dbReview", { data });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.get("/", (request, response) => {
  response.render("index");
});

app.use("/assets", express.static(path.join(__dirname, "public")));

app.listen(PORT, HOST, () => {
  console.log(`👋 Started server on ${HOST}:${PORT}`);
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
