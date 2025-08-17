import { db } from "../init.js";

export function getAllDataForDashboard(db) {
  const rows = db
    .prepare(
      `
    SELECT
      r.id, r.riddleKey, r.headline, r.body, r.answerDetails, r.answerImgPath,
      rac.slotIndex,
      ac.id   AS answerChoiceId,
      ac.name AS answerName,
      ac.imgPath AS answerChoiceImgPath
    FROM riddles r
    LEFT JOIN riddleAnswerChoices rac ON rac.riddleId = r.id
    LEFT JOIN answerChoices ac        ON ac.id = rac.answerChoiceId
    ORDER BY r.id ASC, rac.slotIndex ASC
  `
    )
    .all();

  const riddlesMap = new Map();
  for (const row of rows) {
    if (!riddlesMap.has(row.id)) {
      riddlesMap.set(row.id, {
        id: row.id,
        riddleKey: row.riddleKey,
        headline: row.headline,
        bodyLines: Array.isArray(row.body)
          ? row.body
          : JSON.parse(row.body || "[]"),
        answerDetails: row.answerDetails,
        answerImgPath: row.answerImgPath,
        choices: [],
      });
    }
    if (row.answerChoiceId != null) {
      riddlesMap.get(row.id).choices.push({
        id: row.answerChoiceId,
        name: row.answerName,
        imgPath: row.answerChoiceImgPath,
        slotIndex: row.slotIndex,
        isCorrect: row.slotIndex === 0,
      });
    }
  }
  const riddles = Array.from(riddlesMap.values());

  const answerChoices = db
    .prepare(
      `
    SELECT id, name, imgPath
    FROM answerChoices
    ORDER BY name
  `
    )
    .all();

  const userAnimals = db
    .prepare(
      `
    SELECT id, name, imgPath
    FROM userAnimals
    ORDER BY name
  `
    )
    .all();

  const userColors = db
    .prepare(
      `
    SELECT id, name, hex, badgePath
    FROM userColors
    ORDER BY name
  `
    )
    .all();

  const userRows = db
    .prepare(
      `
    SELECT
      u.id,
      ua.id   AS animalId,
      ua.name AS animalName,
      ua.imgPath AS animalImgPath,
      uc.id   AS colorId,
      uc.name AS colorName,
      uc.hex,
      uc.badgePath,
      u.gameState
    FROM users u
    JOIN userAnimals ua ON ua.id = u.userAnimal
    JOIN userColors  uc ON uc.id = u.userColor
    ORDER BY u.id
  `
    )
    .all();

  const users = userRows.map((r) => ({
    id: r.id,
    animal: { id: r.animalId, name: r.animalName, imgPath: r.animalImgPath },
    color: {
      id: r.colorId,
      name: r.colorName,
      hex: r.hex,
      badgePath: r.badgePath,
    },
    gameState: (() => {
      try {
        return JSON.parse(r.gameState || "{}");
      } catch {
        return {};
      }
    })(),
  }));

  return { riddles, answerChoices, userAnimals, userColors, users };
}
