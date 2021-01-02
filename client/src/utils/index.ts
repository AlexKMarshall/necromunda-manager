export function createTempId() {
  const randomNumber = Math.ceil(Math.random() * 1000);
  return `TEMP-${randomNumber}`;
}

export function sortByField<T, K extends keyof T>(fieldName: K) {
  return (a: T, b: T) => (a[fieldName] < b[fieldName] ? -1 : 1);
}

function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
