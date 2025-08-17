import Database from "better-sqlite3";

export function openAndMigrate(path = "./database.db") {
  const db = new Database(path);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS userAnimals (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL,
      imgPath  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS userColors (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT NOT NULL,
        hex       TEXT NOT NULL,
        badgePath TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS answerChoices (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      imgPath TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS riddles (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      headline             TEXT NOT NULL,
      body                 TEXT NOT NULL,
      correctAnswerIndex   INTEGER NOT NULL CHECK (correctAnswerIndex BETWEEN 0 AND 3),
      answerDetails        TEXT NOT NULL,
      answerImgPath        TEXT NOT NULL,
      CHECK (json_valid(body)),
      CHECK (json_type(body) = 'array'),
      CHECK (json_array_length(body) = 3),
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
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      userAnimal INTEGER NOT NULL,
      userColor  INTEGER NOT NULL,
      gameState  TEXT NOT NULL DEFAULT '{"currentRiddleId":0,"currentGuesses":[],"hintsRemaining":7}',
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

  return db;
}
