import { openAndMigrate } from "../db/init.js";
import { runAllSeeds } from "../db/seeds/index.js";

const db = openAndMigrate("./database.db");
runAllSeeds(db);
console.log("All seeds completed.");
