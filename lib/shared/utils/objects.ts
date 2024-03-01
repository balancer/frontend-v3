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
export function convertHexKeysToLowerCase(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertHexKeysToLowerCase(item))
  }

  const newObj: { [key: string]: any } = {}
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      if (isHex(key)) {
        const newKey = key.toLowerCase()
        newObj[newKey] = convertHexKeysToLowerCase(obj[key])
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}

function isHex(s: string) {
  return s.startsWith('0x')
}
