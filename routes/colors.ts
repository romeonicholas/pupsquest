import { Router } from "express";
import { getUsedColorIds } from "../drizzle/queries.ts";

const router = Router();

router.get("/api/colors/used", async (req, res) => {
  try {
    const colors = await getUsedColorIds();
    res.json(colors);
  } catch (error) {
    console.error("Error fetching used colors: ", error);
    res.status(500).json({ error: "Failed to fetch used colors" });
  }
});

export default router;
