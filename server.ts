import dotenv from "dotenv";
import app from "./app.ts";
import { pool } from "./drizzle/db.ts";
import { deleteExpiredUsers } from "./drizzle/queries.ts";

dotenv.config({ path: ".env", quiet: true });

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function cleanUpExpiredUsers() {
  try {
    const numberOfDeletedUsers = await deleteExpiredUsers();
    if (numberOfDeletedUsers)
      console.log(`Deleted ${numberOfDeletedUsers} expired users`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Expired user deletion failed:", errorMessage);
  }
}

app.listen(PORT, HOST, async () => {
  console.log(`Started server on ${HOST}:${PORT}`);
  await cleanUpExpiredUsers();
  setInterval(cleanUpExpiredUsers, 60 * 60 * 1000);
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("Database connection closed.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  try {
    await pool.end();
    console.log("Database connection closed.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});
