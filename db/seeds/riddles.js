export function seedRiddles(db) {
  const findChoiceByName = db.prepare(
    `SELECT id FROM answerChoices WHERE name = ? LIMIT 1`
  );
  const findRiddleByKey = db.prepare(
    `SELECT id FROM riddles WHERE riddleKey = ? LIMIT 1`
  );
  const insertRiddle = db.prepare(`
    INSERT INTO riddles (riddleKey, headline, body, answerDetails, answerImgPath)
    VALUES (?, ?, ?, ?, ?)
  `);
  const updateRiddle = db.prepare(`
    UPDATE riddles SET headline = ?, body = ?, answerDetails = ?, answerImgPath = ? WHERE id = ?
  `);
  const upsertLink = db.prepare(`
    INSERT INTO riddleAnswerChoices (riddleId, answerChoiceId, slotIndex)
    VALUES (?, ?, ?)
    ON CONFLICT(riddleId, slotIndex) DO UPDATE SET answerChoiceId = excluded.answerChoiceId
  `);

  const rows = [
    {
      riddleKey: "indian blanket",
      headline: "Which one am I?",
      bodyLines: [
        "Everyone knows I’m so great:",
        "I’m the official wildflower of our state!",
        "You may find me by a star of blue,",
        "or near the tail of a cat, it’s true.",
        "If you’d like to see me even more,",
        "go ask the rabbit at the front door.",
      ],
      answerDetails:
        "My name comes from a Native American story about a girl lost in the forest who is kept warm by a blanket of red and yellow flowers.",
      answerImgPath:
        "images/riddles/answers/answer_image_temp_indian_blanket.png",
      answerChoiceNames: [
        "Indian Blanket",
        "False Dandelion",
        "Coreopsis",
        "Purple Coneflower",
      ],
    },
  ];

  db.transaction(() => {
    for (const r of rows) {
      const {
        riddleKey,
        headline,
        bodyLines,
        answerDetails,
        answerImgPath,
        answerChoiceNames,
      } = r;

      if (!riddleKey) throw new Error("Each riddle must have a riddleKey");
      if (!Array.isArray(answerChoiceNames) || answerChoiceNames.length !== 4) {
        throw new Error(
          `answerChoiceNames must have exactly 4 items for key "${riddleKey}"`
        );
      }

      const choiceIds = answerChoiceNames.map((t) => {
        const found = findChoiceByName.get(t);
        if (!found)
          throw new Error(
            `answerChoices.name not found: "${t}" (riddleKey=${riddleKey})`
          );
        return found.id;
      });

      const existing = findRiddleByKey.get(riddleKey);
      let riddleId;
      if (existing) {
        updateRiddle.run(
          headline,
          JSON.stringify(bodyLines),
          answerDetails,
          answerImgPath,
          existing.id
        );
        riddleId = existing.id;
      } else {
        const { lastInsertRowid } = insertRiddle.run(
          riddleKey,
          headline,
          JSON.stringify(bodyLines),
          answerDetails,
          answerImgPath
        );
        riddleId = lastInsertRowid;
      }

      choiceIds.forEach((choiceId, slotIndex) =>
        upsertLink.run(riddleId, choiceId, slotIndex)
      );
    }
  })();
}
