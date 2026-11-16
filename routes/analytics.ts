import { Router } from "express";
import { getAverageScore, addRiddleAnalytics } from "../drizzle/queries.ts";

const router = Router();

router.get("/api/stats/average-score", async (req, res) => {
  try {
    const data = await getAverageScore();
    res.json(data);
  } catch (error) {
    console.error("Error calculating average scores: ", error);
    res.status(500).json({ error: "Failed to calculate average scores" });
  }
});

router.post("/api/analytics/riddle", async (req, res) => {
  const riddleId = Number(req.body.riddleId);
  const hintsUsed = Number(req.body.hintsUsed);
  const wasAnsweredCorrectly = Boolean(req.body.wasAnsweredCorrectly);

  if (isNaN(riddleId) || isNaN(hintsUsed)) {
    return res.status(400).json({ error: "Invalid riddle analytics data" });
  }

  try {
    await addRiddleAnalytics(riddleId, wasAnsweredCorrectly, hintsUsed);
    res.status(201).end();
  } catch (error) {
    console.error("Error saving riddle analytics:", error);
    res.status(500).json({ error: "Failed to save riddle analytics" });
  }
});

export default router;
