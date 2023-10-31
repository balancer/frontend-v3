export function isSameAddress(address1: string, address2: string): boolean {
  if (!address1 || !address2) return false
  return address1.toLowerCase() === address2.toLowerCase()
}

export function includesAddress(addresses: string[], address: string): boolean {
  if (!address) return false
  addresses = addresses.map(a => (a ? a.toLowerCase() : ''))
  return addresses.includes(address.toLowerCase())
}

export function indexOfAddress(addresses: string[], address: string): number {
  if (!address) return -1
  addresses = addresses.map(a => (a ? a.toLowerCase() : ''))
  return addresses.indexOf(address.toLowerCase())
}

/**
 * Select an Address when it's unknown what format the addresses are in.
 *
 * @param map A hashmap of address -> type
 * @param address An address to find in the map
 * @returns Item from map or undefined
 */
export function selectByAddress<T>(map: Record<string, T>, address: string): T | undefined {
  const foundAddress = Object.keys(map).find(itemAddress => {
    if (isSameAddress(itemAddress, address)) {
      return true
    }
  })
  if (foundAddress) return map[foundAddress]
}

// export function findByAddress<T>(
//   items: Array<T>,
//   address: string,
//   key = 'address'
// ): T | undefined {
//   return items.find(item => isSameAddress(item[key], address))
// }

export function removeAddress(address: string, addresses: string[]): string[] {
  return addresses.filter(a => !isSameAddress(a, address))
}
