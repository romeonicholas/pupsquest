export function parseId(value: unknown) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return id;
}

export function parseCount(value: unknown) {
  const count = Number(value);
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > Number.MAX_SAFE_INTEGER
  ) {
    return null;
  }
  return count;
}
