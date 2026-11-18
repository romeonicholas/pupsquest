import app from "./app.ts";
import { config } from "./config.ts";
import { pool } from "./drizzle/db.ts";
import { deleteExpiredUsers } from "./drizzle/queries.ts";

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

app.listen(config.port, config.host, async () => {
  console.log(
    `Server starting in ${config.mode} mode (${config.host}:${config.port})`,
  );
  await cleanUpExpiredUsers();
  setInterval(cleanUpExpiredUsers, 60 * 60 * 1000);
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error closing database:", errorMessage);
  }
  process.exit(0);
});
