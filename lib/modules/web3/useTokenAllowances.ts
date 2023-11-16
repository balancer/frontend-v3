import { Address, erc20ABI } from 'wagmi'
import { useUserTokenAllowance } from './useUserTokenAllowance'
import { vaultV2Address, wETHAddress } from '@/lib/debug-helpers'
import { ReactNode, createContext } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useContractAddress } from './contracts/useContractAddress'
import { useContractReads } from 'wagmi'
import {  GetFunctionArgs, InferFunctionName } from 'viem'
import { ReadAbiMutability } from './contracts/contract.types'
import { defaultTestUserAccount } from '@/test/utils/wagmi'


// export function useErc20Read<F extends InferFunctionName<Erc20Abi, string, ReadAbiMutability>>(
//   tokenAddress: Address,
//   functionName: F,
//   args?: GetFunctionArgs<Erc20Abi, F> | null,
//   additionalConfig?: Omit<
//     UseContractReadConfig<Erc20Abi, F, number>,
//     'abi' | 'address' | 'functionName' | 'args'
//   >,
//   account?: Address

type Erc20Abi = typeof erc20ABI


export type TokenAllowances = Record<Address, bigint>

export function _useTokenAllowances(spenderAddress: Address, tokenAddresses2: Address[]) {
  const supportedAddresses = [wETHAddress]
  const tokenAddresses: Address[] = [wETHAddress]

  type FunctionName = InferFunctionName<Erc20Abi, string, ReadAbiMutability>
  // type Args = GetFunctionArgs<typeof erc20ABI, FunctionName>

  type WagmiContractConfigs<F extends InferFunctionName<Erc20Abi, string , ReadAbiMutability>>  = {
    address: Address
    abi: Erc20Abi
    functionName: F
    args: GetFunctionArgs<Erc20Abi, F>['args'],
}[]

  const contracts1: WagmiContractConfigs<'allowance'> = tokenAddresses2.map(tokenAddress =>
    ({
      address: wETHAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [spenderAddress , defaultTestUserAccount]
    })


  const data = useContractReads({
    contracts: contracts1.map(c => ({...c, args: []})),
  })

  // const data = useContractReads({
  //   contracts: tokenAddresses.map(
  //     tokenAddress =>
  //       ({
  //         chainId: 1,
  //         abi: erc20ABI,
  //         address: wETHAddress,
  //         functionName: '',
  //         args: [],
  //       } as const)
  //   ),
  //   allowFailure: false,
  //   enabled: !!spenderAddress,
  // })

  // const query = useContractReads({
  //   contracts: [
  //     {
  //       chainId: 1,
  //       abi: erc20ABI,
  //       address: wETHAddress,
  //       functionName: '',
  //     },
  //   ],
  //   allowFailure: false,
  //   enabled: !!spenderAddress,
  // })

  return {
    data,
  }
}

export const TokenAllowancesContext = createContext<ReturnType<typeof _useTokenAllowances> | null>(
  null
)

export function TokenAllowancesProvider({ children }: { children: ReactNode }) {
  const spenderAddress = useContractAddress('balancer.vaultV2')
  const hook = _useTokenAllowances(spenderAddress)

  return <TokenAllowancesContext.Provider value={hook}>{children}</TokenAllowancesContext.Provider>
}

export function useTokenAllowances() {
  return useMandatoryContext(TokenAllowancesContext, 'TokenAllowances')
}
