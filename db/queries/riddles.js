import { db } from "../init.js";

export function getAllRiddlesWithChoices() {
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
        name: row.answerName,
        imgPath: row.answerChoiceImgPath,
        slotIndex: row.slotIndex,
        isCorrect: row.slotIndex === 0, // slot 0 = correct
      });
    }
  }
  return Array.from(byId.values());
}
