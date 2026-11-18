import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../drizzle/db.ts";

const router = Router();

router.get("/healthz", async (req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Can't reach database, health check failed:", error);
    res.status(503).json({ status: "database unreachable" });
  }
});

export default router;
