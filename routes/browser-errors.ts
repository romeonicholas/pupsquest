import { Router } from "express";
import { logger } from "../logger.ts";

const router = Router();

const MAX_LENGTH = 2000;

router.post("/api/browser-errors", (req, res) => {
  const message = req.body?.message;

  if (!message) {
    return res.status(400).json({ error: "Missing error message" });
  }

  logger.error(
    {
      browserError: {
        message: message.slice(0, MAX_LENGTH),
        source: req.body.source.slice(0, MAX_LENGTH),
        device: req.body.device.slice(0, MAX_LENGTH),
      },
    },
    "Browser error",
  );

  res.status(204).end();
});

export default router;
