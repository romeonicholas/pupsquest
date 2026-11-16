import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import riddlesRouter from "./routes/riddles.ts";
import colorsRouter from "./routes/colors.ts";
import analyticsRouter from "./routes/analytics.ts";
import usersRouter from "./routes/users.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(analyticsRouter);

app.use(colorsRouter);

app.use(riddlesRouter);

app.use(usersRouter);

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
