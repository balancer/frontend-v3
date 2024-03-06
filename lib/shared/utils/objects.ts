type Config<T> = Record<string, T>

/**
 * Given an object like:
 *
 *    const obj = { Address1: { ADDRESS2: true } }
 *
 * converts all its keys to lowercase:
 *
 *    { address1: { address2: true } }
 *
 * User by config files to enable non-case-sensitive lookups.
 */
export function convertHexToLowerCase<T>(config: Config<T>): Config<T> {
  const newConfig: Config<T> = {}

  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const value = config[key]
      const lowercaseKey = isHex(key) ? key.toLowerCase() : key

      if (typeof value === 'string' && isHex(value)) {
        newConfig[lowercaseKey] = value.toLowerCase() as T
      } else if (Array.isArray(value)) {
        newConfig[lowercaseKey] = value.map(item =>
          typeof item === 'string' && isHex(item) ? (item.toLowerCase() as T) : item
        ) as T
      } else if (typeof value === 'object') {
        newConfig[lowercaseKey] = convertHexToLowerCase(value as Config<T>) as T
      } else {
        newConfig[lowercaseKey] = value as T
      }
    }
  }

  return newConfig
}

function isHex(s: string) {
  return s.startsWith('0x')
}
