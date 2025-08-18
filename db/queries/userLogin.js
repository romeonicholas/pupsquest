export function getAllColorsFromUsers(db) {
  return db
    .prepare(
      `
    SELECT DISTINCT uc.id, uc.name, uc.hex, uc.badgePath
    FROM userColors uc
    INNER JOIN users u ON u.userColor = uc.id
    ORDER BY uc.name
  `
    )
    .all();
}

export function getAllAnimalsFromUsersWithColor(db, colorId) {
  return db
    .prepare(
      `
    SELECT DISTINCT ua.id, ua.name, ua.imgPath
    FROM userAnimals ua
    INNER JOIN users u ON u.userAnimal = ua.id
    WHERE u.userColor = ?
    ORDER BY ua.name
  `
    )
    .all(colorId);
}

export function getUserByColorAndAnimal(db, colorId, animalId) {
  return db
    .prepare(
      `
    SELECT *
    FROM users
    WHERE userColor = ? AND userAnimal = ?
  `
    )
    .get(colorId, animalId);
}
