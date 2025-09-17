import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

import { users } from "./db/schema.js";

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  const allUsers = await db.select().from(users);
  console.log("All users:", allUsers);
}

main().catch(console.error);
