import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("index");
});

<<<<<<< HEAD
app.listen(PORT, "10.62.0.77", () => {
=======
app.listen(PORT, "0.0.0.0", () => {
>>>>>>> 595585f8130b7dd6a7c14247628ea2d005253390
  console.log(`👋 Started server on port ${PORT}`);
});
