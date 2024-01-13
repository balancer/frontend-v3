'use client'

import { get } from 'lodash'
import { NetworkConfig } from '../../../config/config.types'
import { useNetworkConfig } from '../../../config/useNetworkConfig'

type Paths<T, D extends string = '.'> = {
  [K in keyof T]: K extends string
    ? `${K}${T[K] extends object ? `${D}${Paths<T[K], D>}` : ''}`
    : never
}[keyof T]

export type ContractPath = Paths<NetworkConfig['contracts']>

export function useContractAddress(contractId: ContractPath) {
  const networkConfig = useNetworkConfig()

  const address = get(networkConfig.contracts, contractId)
  return address
}
