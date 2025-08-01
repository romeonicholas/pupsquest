import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
