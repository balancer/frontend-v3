/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { get } from 'lodash'
import { useNetworkConfig } from '../config/useNetworkConfig'

const contractId = 'balancer.vault'

export function useVaultContractAddress() {
  const networkConfig = useNetworkConfig()

  const address = get(networkConfig.contracts, contractId)
  return address
}
