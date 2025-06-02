export function isProbablyDateString(value: string): boolean {
  // Check for ISO date format (e.g., 2023-06-01 or 2023-06-01T12:00:00Z)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
  if (!isoDateRegex.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}
