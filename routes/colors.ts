import { Router } from "express";
import { getUsedColorIds } from "../drizzle/queries.ts";
import { logger } from "../logger.ts";

const router = Router();

router.get("/api/colors/used", async (req, res) => {
  try {
    const colors = await getUsedColorIds();
    res.json(colors);
  } catch (error) {
    logger.error({ err: error }, "Error fetching used colors");
    res.status(500).json({ error: "Failed to fetch used colors" });
  }
});

export default router;
