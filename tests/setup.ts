import { execSync } from "child_process";
import { Client } from "pg";

const testDatabaseUrl =
  "postgres://pupsquest:pupsquest@localhost:5432/pupsquest_test";

export default async function setup() {
  const admin = new Client({
    connectionString: "postgres://pupsquest:pupsquest@localhost:5432/postgres",
  });
  await admin.connect();
  await admin.query("DROP DATABASE IF EXISTS pupsquest_test WITH (FORCE)");
  await admin.query("CREATE DATABASE pupsquest_test");
  await admin.end();

  const env = { ...process.env, DATABASE_URL: testDatabaseUrl };
  execSync("npm run db:migrate", { env, stdio: "inherit" });
  execSync("npm run seed", { env, stdio: "inherit" });
}
