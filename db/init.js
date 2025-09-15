import Database from "better-sqlite3";
import { runAllMigrations } from "./migrations/index.js";
import { runAllSeeds } from "./seeds/index.js";

export async function openAndMigrate(path = "./database.db") {
  try {
    const db = new Database(path);

    db.pragma("foreign_keys = ON");
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");

    db.exec(`
      CREATE TABLE IF NOT EXISTS userAnimals (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name     TEXT NOT NULL UNIQUE,
        imgPath  TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS userColors (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          name      TEXT NOT NULL UNIQUE,
          hex       TEXT NOT NULL,
          badgePath TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS answerChoices (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        key      TEXT    NOT NULL UNIQUE,
        display  TEXT    NOT NULL,
        imgPath  TEXT    NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_answerChoices_display ON answerChoices(display);

      CREATE TABLE IF NOT EXISTS riddles (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        riddleKey            TEXT NOT NULL UNIQUE,
        headline             TEXT NOT NULL,
        body                 TEXT NOT NULL,
        answerDetails        TEXT NOT NULL,
        answerImgPath        TEXT NOT NULL,
        CHECK (json_valid(body)),
        CHECK (json_type(body) = 'array'),
        CHECK (json_array_length(body) = 6),
        CHECK (
          json_type(body, '$[0]') = 'text'
          AND json_type(body, '$[1]') = 'text'
          AND json_type(body, '$[2]') = 'text'
          AND json_type(body, '$[3]') = 'text'
          AND json_type(body, '$[4]') = 'text'
          AND json_type(body, '$[5]') = 'text'
        )
      );

      CREATE TABLE IF NOT EXISTS riddleAnswerChoices (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        riddleId        INTEGER NOT NULL,
        answerChoiceId  INTEGER NOT NULL,
        slotIndex       INTEGER NOT NULL CHECK (slotIndex BETWEEN 0 AND 3),
        UNIQUE (riddleId, slotIndex),
        UNIQUE (riddleId, answerChoiceId),
        FOREIGN KEY (riddleId)       REFERENCES riddles(id)        ON DELETE CASCADE,
        FOREIGN KEY (answerChoiceId) REFERENCES answerChoices(id)  ON DELETE RESTRICT
      );
      CREATE INDEX IF NOT EXISTS idx_rac_riddleId ON riddleAnswerChoices(riddleId);
      CREATE INDEX IF NOT EXISTS idx_rac_choiceId ON riddleAnswerChoices(answerChoiceId);

      CREATE TRIGGER IF NOT EXISTS trg_rac_limit4
      BEFORE INSERT ON riddleAnswerChoices
      WHEN (
        SELECT COUNT(*) FROM riddleAnswerChoices WHERE riddleId = NEW.riddleId
      ) >= 4
      BEGIN
        SELECT RAISE(ABORT, 'This riddle already has 4 answer choices');
      END;

      CREATE TABLE IF NOT EXISTS users (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        userAnimal        INTEGER NOT NULL,
        userColor         INTEGER NOT NULL,
        gameState         TEXT NOT NULL DEFAULT '{"currentRiddleId":0,"currentGuesses":[],"hintsRemaining":7,"currentScore":0,"startingIndex":0,"currentShuffledChoices":[],"currentCorrectAnswerIndex":0}',
        createdAt         INTEGER,
        scores            TEXT DEFAULT '[]',
        hasViewedExitPanel INTEGER DEFAULT 0 CHECK (hasViewedExitPanel IN (0, 1)),
        UNIQUE (userAnimal, userColor),
        FOREIGN KEY (userAnimal) REFERENCES userAnimals(id),
        FOREIGN KEY (userColor)  REFERENCES userColors(id),
        CHECK (json_valid(gameState)),
        CHECK (
          json_extract(gameState, '$.hintsRemaining') IS NOT NULL
          AND json_extract(gameState, '$.hintsRemaining') BETWEEN 0 AND 7
        )
      );
    `);

    await runAllMigrations(db);
    await runAllSeeds(db);

    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export const db = await openAndMigrate(
  process.env.DATABASE_URL || "./db/database.db"
);
