import { rmSync } from "fs";
import { execSync } from "child_process";

rmSync("browser.db", { force: true });
execSync("npx drizzle-kit push", { stdio: "inherit" });
execSync("npm run seed", { stdio: "inherit" });
