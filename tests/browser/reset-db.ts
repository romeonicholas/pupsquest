import { execSync } from "child_process";
import { Client } from "pg";

const admin = new Client({
  connectionString: "postgres://pupsquest:pupsquest@localhost:5432/postgres",
});
await admin.connect();
await admin.query("DROP DATABASE IF EXISTS pupsquest_browser WITH (FORCE)");
await admin.query("CREATE DATABASE pupsquest_browser");
await admin.end();

execSync("npx drizzle-kit push", { stdio: "inherit" });
execSync("npm run seed", { stdio: "inherit" });
