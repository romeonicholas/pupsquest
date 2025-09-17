import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.DB_FILE_NAME;

if (!dbUrl) {
  throw new Error("DB_FILE_NAME is not set");
}

const client = createClient({ url: dbUrl });

export const db = drizzle(client, { schema });
