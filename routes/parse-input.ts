const PG_MAX_INTEGER = 2147483647; // Postgres has lower max than JS

export function parseId(value: unknown) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > PG_MAX_INTEGER) {
    return null;
  }
  return id;
}

export function parseCount(value: unknown) {
  const count = Number(value);
  if (!Number.isInteger(count) || count < 0 || count > PG_MAX_INTEGER) {
    return null;
  }
  return count;
}
