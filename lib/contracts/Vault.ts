/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { getContract } from 'viem'
import { WalletClient } from 'wagmi'
import { getContractConfig, useContractQuery } from './contract'
import { vaultABI } from '../abi/generated'

export class Vault {
  static contractId = 'balancer.vault'

  static getContractInstance(walletClient?: WalletClient) {
    let contractConfig = getContractConfig(this.contractId, walletClient)
    if (walletClient) contractConfig = getContractConfig(this.contractId)
    const contract = getContract({
      abi: vaultABI,
      ...contractConfig,
    })

    const query = useContractQuery(this.contractId, contract)

    return { ...contract, query }
  }
}
