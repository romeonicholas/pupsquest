import { Router } from "express";
import { getRiddle } from "../drizzle/queries.ts";
import { parseId } from "./parse-input.ts";

const router = Router();

router.get("/api/riddles/:id", async (req, res) => {
  try {
    const riddleId = parseId(req.params.id);

    if (riddleId == null) {
      return res.status(400).json({ error: "Invalid riddle ID" });
    }

    const riddle = await getRiddle(riddleId);

    if (!riddle) {
      return res.status(404).json({ error: "Riddle not found" });
    }

    res.json(riddle);
  } catch (error) {
    console.error("Error fetching riddle:", error);
    res.status(500).json({ error: "Failed to fetch riddle" });
  }
});

export default router;
