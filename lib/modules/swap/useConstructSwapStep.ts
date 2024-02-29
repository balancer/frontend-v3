/* eslint-disable react-hooks/exhaustive-deps */
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useSwap } from './useSwap'
import { useManagedTransaction } from '../web3/contracts/useManagedTransaction'
import { useContractAddress } from '../web3/contracts/useContractAddress'
import {
  GqlChain,
  GqlSorSwap,
  GqlSorSwapType,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import { useUserAccount } from '../web3/useUserAccount'
import { isNativeAsset, isSameAddress } from '@/lib/shared/utils/addresses'
import { Address, parseUnits, zeroAddress } from 'viem'
import { bn } from '@/lib/shared/utils/numbers'
import { useUserSettings } from '../user/settings/useUserSettings'
import { getTimestampInMinsFromNow } from '@/lib/shared/utils/time'

// function getSwapLimits({
//   tokenAddresses,
//   tokenIn,
//   tokenOut,
//   chain,
//   swapType,
//   slippageDecimal,
// }: {
//   tokenAddresses: string[]
//   chain: GqlChain
//   tokenIn: GqlToken & { amount: string }
//   tokenOut: GqlToken & { amount: string }
//   swapType: GqlSorSwapType
//   slippageDecimal: string
// }) {
//   return tokenAddresses.map((tokenAddress, i) => {
//     const isTokenIn =
//       isSameAddress(tokenAddress, tokenIn.address) ||
//       (isNativeAsset(chain, tokenIn.address) && tokenAddress === zeroAddress)

//     const isTokenOut =
//       isSameAddress(tokenAddress, tokenOut.address) ||
//       (isNativeAsset(chain, tokenOut.address) && tokenAddress === zeroAddress)

//     if (swapType === GqlSorSwapType.ExactIn) {
//       if (isTokenIn) {
//         // Token in limit should be the amount input by the user for exact in swap.
//         return parseUnits(tokenIn.amount, tokenIn.decimals).toString()
//       } else if (isTokenOut) {
//         // Token out limit should be the amount out returned from query minus slippage.
//         return bn(parseUnits(tokenOut.amount, tokenIn.decimals))
//           .times(bn(1).minus(slippageDecimal))
//           .times(-1)
//           .toFixed(0)
//       }
//     } else if (swapType === GqlSorSwapType.ExactOut) {
//       if (isTokenIn) {
//         return bn(parseUnits(tokenOut.amount, tokenOut.decimals))
//           .times(bn(1).plus(slippageDecimal))
//           .toFixed(0)
//       } else if (isTokenOut) {
//         return parseUnits(tokenOut.amount, tokenOut.decimals).toString()
//       }
//     }

//     return '0'
//   })
// }

// export function useConstructSwapStep() {
//   const transactionLabels: TransactionLabels = {
//     init: 'Swap',
//     confirming: 'Confirming...',
//     confirmed: `Swap confirmed!`,
//     tooltip: 'Swap x for y.',
//   }

//   const { simulationQuery, swapType, tokenIn, tokenOut, selectedChain, tokenInInfo, tokenOutInfo } =
//     useSwap()
//   const { userAddress } = useUserAccount()
//   const { slippageDecimal } = useUserSettings()

//   const swapKind = swapType === GqlSorSwapType.ExactIn ? 1 : 0
//   const simSwaps = simulationQuery.data?.sorSwapsQuery?.swaps.swaps as (GqlSorSwap & {
//     poolId: Address
//     assetInIndex: bigint
//     assetOutIndex: bigint
//   })[]
//   // const swaps
//   const tokenAddresses = (simulationQuery.data?.sorSwapsQuery?.swaps.tokenAddresses ||
//     []) as Address[]
//   const deadline = getTimestampInMinsFromNow(100)
//   const funds = {
//     sender: userAddress,
//     recipient: userAddress,
//     fromInternalBalance: false,
//     toInternalBalance: false,
//   }
//   const limits = getSwapLimits({
//     tokenAddresses,
//     tokenIn: { ...tokenIn, ...tokenInInfo },
//     tokenOut: { ...tokenOut, ...tokenOutInfo },
//     chain: selectedChain,
//     swapType,
//     slippageDecimal,
//   })

//   // useEffect(() => {
//   //   // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
//   //   if (simulationQuery.data) {
//   //     buildCallDataQuery.refetch()
//   //   }
//   // }, [simulationQuery.data])

//   // const swapTransaction = useManagedSendTransaction(transactionLabels,
//   // buildCallDataQuery.data)
//   const vaultAddress = useContractAddress('balancer.vaultV2')
//   const swapTransaction = useManagedTransaction(
//     vaultAddress,
//     'balancer.vaultV2',
//     'batchSwap',
//     transactionLabels,
//     { args: [swapKind, simSwaps, tokenAddresses, funds, limits, deadline] }
//   )

//   const isComplete = () => swapTransaction.result.isSuccess

//   const swapStep: FlowStep = {
//     ...swapTransaction,
//     transactionLabels,
//     id: 'swap',
//     stepType: 'swap',
//     isComplete,
//   }

//   return {
//     swapStep,
//     swapTransaction,
//   }
// }
