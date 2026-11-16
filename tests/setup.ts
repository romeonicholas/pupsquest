import { rmSync } from "fs";
import { execSync } from "child_process";

export default function setup() {
  const env = { ...process.env, DB_FILE_NAME: "file:test.db" };

  rmSync("test.db", { force: true });
  execSync("npx drizzle-kit push", { env, stdio: "inherit" });
  execSync("npm run seed", { env, stdio: "inherit" });
}
