import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./db.ts";

await migrate(db, { migrationsFolder: "./drizzle/migrations" });
await pool.end();
