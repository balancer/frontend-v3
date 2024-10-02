export function allEqual<T>(array: T[]): boolean {
  if (array.length === 0) return true
  return array.every(value => value === array[0])
}
