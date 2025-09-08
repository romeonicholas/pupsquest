import { openAndMigrate } from "../db/init.js";
import { runAllSeeds } from "../db/seeds/index.js";

const db = await openAndMigrate("./database.db");
await runAllSeeds(db);
