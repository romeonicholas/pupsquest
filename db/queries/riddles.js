import { db } from "../init.js";

export function getRiddleById(db, riddleId) {
  if (riddleId == null || riddleId === undefined) {
    console.error("getRiddleById: riddleId is null or undefined");
    return null;
  }

  const id = typeof riddleId === "string" ? parseInt(riddleId, 10) : riddleId;

  if (isNaN(id)) {
    console.error("getRiddleById: riddleId is not a valid number:", riddleId);
    return null;
  }

  const row = db
    .prepare(
      `
    SELECT
      r.id, r.riddleKey, r.headline, r.body, r.answerDetails, r.answerImgPath,
      rac.slotIndex,
      ac.id as answerChoiceId,
      ac.display as answerChoiceDisplay,
      ac.imgPath as answerChoiceImgPath
    FROM riddles r
    LEFT JOIN riddleAnswerChoices rac ON rac.riddleId = r.id
    LEFT JOIN answerChoices ac        ON ac.id = rac.answerChoiceId
    WHERE r.id = ?
    ORDER BY rac.slotIndex ASC
  `
    )
    .all(id);

  if (row.length === 0) {
    return null;
  }

  const riddle = {
    id: row[0].id,
    riddleKey: row[0].riddleKey,
    headline: row[0].headline,
    body: Array.isArray(row[0].body)
      ? row[0].body
      : JSON.parse(row[0].body || "[]"),
    answerDetails: row[0].answerDetails,
    answerImgPath: row[0].answerImgPath,
    answerChoices: [],
  };

  for (const r of row) {
    if (r.answerChoiceId != null) {
      riddle.answerChoices.push({
        id: r.answerChoiceId,
        display: r.answerChoiceDisplay,
        imgPath: r.answerChoiceImgPath,
        slotIndex: r.slotIndex,
        isCorrect: r.slotIndex === 0,
      });
    }
  }

  return riddle;
}

export function getAllRiddlesWithChoices() {
  const rows = db
    .prepare(
      `
    SELECT
      r.id, r.riddleKey, r.headline, r.body, r.answerDetails, r.answerImgPath,
      rac.slotIndex,
      ac.id as answerChoiceId,
      ac.display as answerChoiceDisplay,
      ac.imgPath as answerChoiceImgPath
    FROM riddles r
    LEFT JOIN riddleAnswerChoices rac ON rac.riddleId = r.id
    LEFT JOIN answerChoices ac        ON ac.id = rac.answerChoiceId
    ORDER BY r.id ASC, rac.slotIndex ASC
  `
    )
    .all();

  const byId = new Map();
  for (const row of rows) {
    if (!byId.has(row.id)) {
      byId.set(row.id, {
        id: row.id,
        riddleKey: row.riddleKey,
        headline: row.headline,
        body: Array.isArray(row.body) ? row.body : JSON.parse(row.body || "[]"),
        answerDetails: row.answerDetails,
        answerImgPath: row.answerImgPath,
        answerChoices: [],
      });
    }
    if (row.answerChoiceId != null) {
      byId.get(row.id).answerChoices.push({
        id: row.answerChoiceId,
        key: row.answerKey,
        display: row.answerChoiceDisplay,
        imgPath: row.answerChoiceImgPath,
        slotIndex: row.slotIndex,
        isCorrect: row.slotIndex === 0, // slot 0 = correct
      });
    }
  }
  return Array.from(byId.values());
}
