import app from "./app.ts";
import { config } from "./config.ts";
import { pool } from "./drizzle/db.ts";
import { deleteExpiredUsers } from "./drizzle/queries.ts";
import { logger } from "./logger.ts";

async function cleanUpExpiredUsers() {
  try {
    const numberOfDeletedUsers = await deleteExpiredUsers();
    if (numberOfDeletedUsers) {
      logger.info(
        { deletedUsers: numberOfDeletedUsers },
        "Deleted expired users",
      );
    }
  } catch (error) {
    logger.error({ err: error }, "Expired user deletion failed");
  }
}

app.listen(config.port, config.host, async () => {
  logger.info(
    { mode: config.mode, host: config.host, port: config.port },
    "Server started",
  );

  await cleanUpExpiredUsers();
  setInterval(cleanUpExpiredUsers, 60 * 60 * 1000);
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error({ err: error }, "Error closing database");
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  try {
    await pool.end();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error({ err: error }, "Error closing database");
  }
  process.exit(0);
});
