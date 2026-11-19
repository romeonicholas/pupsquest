import { Router } from "express";
import { getAverageScore, addRiddleAnalytics } from "../drizzle/queries.ts";
import { parseId, parseCount } from "./parse-input.ts";
import { logger } from "../logger.ts";

const router = Router();

router.get("/api/stats/average-score", async (req, res) => {
  try {
    const data = await getAverageScore();
    res.json(data);
  } catch (error) {
    logger.error({ err: error }, "Error calculating average scores");
    res.status(500).json({ error: "Failed to calculate average scores" });
  }
});

router.post("/api/analytics/riddle", async (req, res) => {
  const riddleId = parseId(req.body.riddleId);
  const hintsUsed = parseCount(req.body.hintsUsed);
  const wasAnsweredCorrectly = Boolean(req.body.wasAnsweredCorrectly);

  if (riddleId == null || hintsUsed == null) {
    return res.status(400).json({ error: "Invalid riddle analytics data" });
  }

  try {
    await addRiddleAnalytics(riddleId, wasAnsweredCorrectly, hintsUsed);
    res.status(201).end();
  } catch (error) {
    logger.error({ err: error }, "Error saving riddle analytics");
    res.status(500).json({ error: "Failed to save riddle analytics" });
  }
});

export default router;
