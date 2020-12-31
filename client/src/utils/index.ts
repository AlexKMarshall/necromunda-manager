export function createTempId() {
  const randomNumber = Math.ceil(Math.random() * 1000);
  return `TEMP-${randomNumber}`;
}

export function sortByField<T, K extends keyof T>(fieldName: K) {
  return (a: T, b: T) => (a[fieldName] < b[fieldName] ? -1 : 1);
}
