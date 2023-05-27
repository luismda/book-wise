export function excludeFields<Object, Key extends keyof Object>(
  object: Object,
  keys: Key[],
): Omit<Object, Key> {
  for (const key of keys) {
    delete object[key]
  }

  return object
}
