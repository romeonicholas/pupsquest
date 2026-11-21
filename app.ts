import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.ts";
import { pinoHttp } from "pino-http";
import { logger } from "./logger.ts";

import healthRouter from "./routes/health.ts";
import riddlesRouter from "./routes/riddles.ts";
import colorsRouter from "./routes/colors.ts";
import analyticsRouter from "./routes/analytics.ts";
import usersRouter from "./routes/users.ts";
import browserErrorsRouter from "./routes/browser-errors.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (config.mode === "online") {
  app.set("trust proxy", 1);
}

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === "/healthz" },
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRouter);
app.use(browserErrorsRouter);
app.use(analyticsRouter);
app.use(colorsRouter);
app.use(riddlesRouter);
app.use(usersRouter);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

function renderGame(req: Request, res: Response, isKiosk: boolean) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isKiosk) {
    logger.info({ ipAddress: req.ip }, "Kiosk connected to server");
  }

  res.render("index", { isKiosk, isMuseum: config.mode === "museum", date });
}

app.get("/", (req, res) => renderGame(req, res, false));
if (config.mode === "museum") {
  app.get("/kiosk", (req, res) => renderGame(req, res, true));
}

export default app;
