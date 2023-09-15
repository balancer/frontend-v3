import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'authorizer', internalType: 'contract IAuthorizer', type: 'address' },
      { name: 'weth', internalType: 'contract IWETH', type: 'address' },
      { name: 'pauseWindowDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'bufferPeriodDuration', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAuthorizer',
        internalType: 'contract IAuthorizer',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AuthorizerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ExternalBalanceTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'contract IFlashLoanRecipient',
        type: 'address',
        indexed: true,
      },
      { name: 'token', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'feeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'FlashLoan',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'InternalBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'paused', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'PausedStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'liquidityProvider', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]', indexed: false },
      { name: 'deltas', internalType: 'int256[]', type: 'int256[]', indexed: false },
      { name: 'protocolFeeAmounts', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'PoolBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'assetManager', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'cashDelta', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'managedDelta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'PoolBalanceManaged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'poolAddress', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'specialization',
        internalType: 'enum IVault.PoolSpecialization',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'PoolRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'relayer', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RelayerApprovalChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'tokenIn', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'tokenOut', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amountOut', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Swap',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]', indexed: false },
    ],
    name: 'TokensDeregistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]', indexed: false },
      { name: 'assetManagers', internalType: 'address[]', type: 'address[]', indexed: false },
    ],
    name: 'TokensRegistered',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'WETH',
    outputs: [{ name: '', internalType: 'contract IWETH', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
      {
        name: 'swaps',
        internalType: 'struct IVault.BatchSwapStep[]',
        type: 'tuple[]',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'assetInIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'assetOutIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          { name: 'recipient', internalType: 'address payable', type: 'address' },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'limits', internalType: 'int256[]', type: 'int256[]' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'batchSwap',
    outputs: [{ name: 'assetDeltas', internalType: 'int256[]', type: 'int256[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'deregisterTokens',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      {
        name: 'request',
        internalType: 'struct IVault.ExitPoolRequest',
        type: 'tuple',
        components: [
          { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
          { name: 'minAmountsOut', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'exitPool',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'contract IFlashLoanRecipient', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flashLoan',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'selector', internalType: 'bytes4', type: 'bytes4' }],
    name: 'getActionId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAuthorizer',
    outputs: [{ name: '', internalType: 'contract IAuthorizer', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getInternalBalance',
    outputs: [{ name: 'balances', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getNextNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getPausedState',
    outputs: [
      { name: 'paused', internalType: 'bool', type: 'bool' },
      { name: 'pauseWindowEndTime', internalType: 'uint256', type: 'uint256' },
      { name: 'bufferPeriodEndTime', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'poolId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPool',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'enum IVault.PoolSpecialization', type: 'uint8' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getPoolTokenInfo',
    outputs: [
      { name: 'cash', internalType: 'uint256', type: 'uint256' },
      { name: 'managed', internalType: 'uint256', type: 'uint256' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'assetManager', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'poolId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPoolTokens',
    outputs: [
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolFeesCollector',
    outputs: [{ name: '', internalType: 'contract ProtocolFeesCollector', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'relayer', internalType: 'address', type: 'address' },
    ],
    name: 'hasApprovedRelayer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      {
        name: 'request',
        internalType: 'struct IVault.JoinPoolRequest',
        type: 'tuple',
        components: [
          { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
          { name: 'maxAmountsIn', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'joinPool',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct IVault.PoolBalanceOp[]',
        type: 'tuple[]',
        components: [
          { name: 'kind', internalType: 'enum IVault.PoolBalanceOpKind', type: 'uint8' },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'token', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'managePoolBalance',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct IVault.UserBalanceOp[]',
        type: 'tuple[]',
        components: [
          { name: 'kind', internalType: 'enum IVault.UserBalanceOpKind', type: 'uint8' },
          { name: 'asset', internalType: 'contract IAsset', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'recipient', internalType: 'address payable', type: 'address' },
        ],
      },
    ],
    name: 'manageUserBalance',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
      {
        name: 'swaps',
        internalType: 'struct IVault.BatchSwapStep[]',
        type: 'tuple[]',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'assetInIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'assetOutIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          { name: 'recipient', internalType: 'address payable', type: 'address' },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'queryBatchSwap',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'specialization', internalType: 'enum IVault.PoolSpecialization', type: 'uint8' },
    ],
    name: 'registerPool',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'assetManagers', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'registerTokens',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newAuthorizer', internalType: 'contract IAuthorizer', type: 'address' }],
    name: 'setAuthorizer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'paused', internalType: 'bool', type: 'bool' }],
    name: 'setPaused',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'relayer', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRelayerApproval',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'singleSwap',
        internalType: 'struct IVault.SingleSwap',
        type: 'tuple',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'assetIn', internalType: 'contract IAsset', type: 'address' },
          { name: 'assetOut', internalType: 'contract IAsset', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          { name: 'recipient', internalType: 'address payable', type: 'address' },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swap',
    outputs: [{ name: 'amountCalculated', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({
    abi: erc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: erc20ABI, ...config } as UsePrepareContractWriteConfig<
    typeof erc20ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof erc20ABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: erc20ABI, ...config } as UseContractEventConfig<
    typeof erc20ABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: vaultABI, ...config } as UseContractReadConfig<
    typeof vaultABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"WETH"`.
 */
export function useVaultWeth<
  TFunctionName extends 'WETH',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'WETH',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getActionId"`.
 */
export function useVaultGetActionId<
  TFunctionName extends 'getActionId',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getActionId',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getAuthorizer"`.
 */
export function useVaultGetAuthorizer<
  TFunctionName extends 'getAuthorizer',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getAuthorizer',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getDomainSeparator"`.
 */
export function useVaultGetDomainSeparator<
  TFunctionName extends 'getDomainSeparator',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getDomainSeparator',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getInternalBalance"`.
 */
export function useVaultGetInternalBalance<
  TFunctionName extends 'getInternalBalance',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getInternalBalance',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getNextNonce"`.
 */
export function useVaultGetNextNonce<
  TFunctionName extends 'getNextNonce',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getNextNonce',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPausedState"`.
 */
export function useVaultGetPausedState<
  TFunctionName extends 'getPausedState',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getPausedState',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPool"`.
 */
export function useVaultGetPool<
  TFunctionName extends 'getPool',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getPool',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPoolTokenInfo"`.
 */
export function useVaultGetPoolTokenInfo<
  TFunctionName extends 'getPoolTokenInfo',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getPoolTokenInfo',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPoolTokens"`.
 */
export function useVaultGetPoolTokens<
  TFunctionName extends 'getPoolTokens',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getPoolTokens',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getProtocolFeesCollector"`.
 */
export function useVaultGetProtocolFeesCollector<
  TFunctionName extends 'getProtocolFeesCollector',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'getProtocolFeesCollector',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"hasApprovedRelayer"`.
 */
export function useVaultHasApprovedRelayer<
  TFunctionName extends 'hasApprovedRelayer',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'hasApprovedRelayer',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"queryBatchSwap"`.
 */
export function useVaultQueryBatchSwap<
  TFunctionName extends 'queryBatchSwap',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: vaultABI,
    functionName: 'queryBatchSwap',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof vaultABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, TFunctionName, TMode>({
    abi: vaultABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"batchSwap"`.
 */
export function useVaultBatchSwap<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'batchSwap'>['request']['abi'],
        'batchSwap',
        TMode
      > & { functionName?: 'batchSwap' }
    : UseContractWriteConfig<typeof vaultABI, 'batchSwap', TMode> & {
        abi?: never
        functionName?: 'batchSwap'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'batchSwap', TMode>({
    abi: vaultABI,
    functionName: 'batchSwap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deregisterTokens"`.
 */
export function useVaultDeregisterTokens<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'deregisterTokens'>['request']['abi'],
        'deregisterTokens',
        TMode
      > & { functionName?: 'deregisterTokens' }
    : UseContractWriteConfig<typeof vaultABI, 'deregisterTokens', TMode> & {
        abi?: never
        functionName?: 'deregisterTokens'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'deregisterTokens', TMode>({
    abi: vaultABI,
    functionName: 'deregisterTokens',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"exitPool"`.
 */
export function useVaultExitPool<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'exitPool'>['request']['abi'],
        'exitPool',
        TMode
      > & { functionName?: 'exitPool' }
    : UseContractWriteConfig<typeof vaultABI, 'exitPool', TMode> & {
        abi?: never
        functionName?: 'exitPool'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'exitPool', TMode>({
    abi: vaultABI,
    functionName: 'exitPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"flashLoan"`.
 */
export function useVaultFlashLoan<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'flashLoan'>['request']['abi'],
        'flashLoan',
        TMode
      > & { functionName?: 'flashLoan' }
    : UseContractWriteConfig<typeof vaultABI, 'flashLoan', TMode> & {
        abi?: never
        functionName?: 'flashLoan'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'flashLoan', TMode>({
    abi: vaultABI,
    functionName: 'flashLoan',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"joinPool"`.
 */
export function useVaultJoinPool<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'joinPool'>['request']['abi'],
        'joinPool',
        TMode
      > & { functionName?: 'joinPool' }
    : UseContractWriteConfig<typeof vaultABI, 'joinPool', TMode> & {
        abi?: never
        functionName?: 'joinPool'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'joinPool', TMode>({
    abi: vaultABI,
    functionName: 'joinPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"managePoolBalance"`.
 */
export function useVaultManagePoolBalance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'managePoolBalance'>['request']['abi'],
        'managePoolBalance',
        TMode
      > & { functionName?: 'managePoolBalance' }
    : UseContractWriteConfig<typeof vaultABI, 'managePoolBalance', TMode> & {
        abi?: never
        functionName?: 'managePoolBalance'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'managePoolBalance', TMode>({
    abi: vaultABI,
    functionName: 'managePoolBalance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"manageUserBalance"`.
 */
export function useVaultManageUserBalance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'manageUserBalance'>['request']['abi'],
        'manageUserBalance',
        TMode
      > & { functionName?: 'manageUserBalance' }
    : UseContractWriteConfig<typeof vaultABI, 'manageUserBalance', TMode> & {
        abi?: never
        functionName?: 'manageUserBalance'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'manageUserBalance', TMode>({
    abi: vaultABI,
    functionName: 'manageUserBalance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerPool"`.
 */
export function useVaultRegisterPool<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'registerPool'>['request']['abi'],
        'registerPool',
        TMode
      > & { functionName?: 'registerPool' }
    : UseContractWriteConfig<typeof vaultABI, 'registerPool', TMode> & {
        abi?: never
        functionName?: 'registerPool'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'registerPool', TMode>({
    abi: vaultABI,
    functionName: 'registerPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerTokens"`.
 */
export function useVaultRegisterTokens<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'registerTokens'>['request']['abi'],
        'registerTokens',
        TMode
      > & { functionName?: 'registerTokens' }
    : UseContractWriteConfig<typeof vaultABI, 'registerTokens', TMode> & {
        abi?: never
        functionName?: 'registerTokens'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'registerTokens', TMode>({
    abi: vaultABI,
    functionName: 'registerTokens',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setAuthorizer"`.
 */
export function useVaultSetAuthorizer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'setAuthorizer'>['request']['abi'],
        'setAuthorizer',
        TMode
      > & { functionName?: 'setAuthorizer' }
    : UseContractWriteConfig<typeof vaultABI, 'setAuthorizer', TMode> & {
        abi?: never
        functionName?: 'setAuthorizer'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'setAuthorizer', TMode>({
    abi: vaultABI,
    functionName: 'setAuthorizer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setPaused"`.
 */
export function useVaultSetPaused<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'setPaused'>['request']['abi'],
        'setPaused',
        TMode
      > & { functionName?: 'setPaused' }
    : UseContractWriteConfig<typeof vaultABI, 'setPaused', TMode> & {
        abi?: never
        functionName?: 'setPaused'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'setPaused', TMode>({
    abi: vaultABI,
    functionName: 'setPaused',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setRelayerApproval"`.
 */
export function useVaultSetRelayerApproval<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'setRelayerApproval'>['request']['abi'],
        'setRelayerApproval',
        TMode
      > & { functionName?: 'setRelayerApproval' }
    : UseContractWriteConfig<typeof vaultABI, 'setRelayerApproval', TMode> & {
        abi?: never
        functionName?: 'setRelayerApproval'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'setRelayerApproval', TMode>({
    abi: vaultABI,
    functionName: 'setRelayerApproval',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"swap"`.
 */
export function useVaultSwap<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'swap'>['request']['abi'],
        'swap',
        TMode
      > & { functionName?: 'swap' }
    : UseContractWriteConfig<typeof vaultABI, 'swap', TMode> & {
        abi?: never
        functionName?: 'swap'
      } = {} as any,
) {
  return useContractWrite<typeof vaultABI, 'swap', TMode>({
    abi: vaultABI,
    functionName: 'swap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__.
 */
export function usePrepareVaultWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: vaultABI, ...config } as UsePrepareContractWriteConfig<
    typeof vaultABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"batchSwap"`.
 */
export function usePrepareVaultBatchSwap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'batchSwap'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'batchSwap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'batchSwap'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deregisterTokens"`.
 */
export function usePrepareVaultDeregisterTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'deregisterTokens'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'deregisterTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'deregisterTokens'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"exitPool"`.
 */
export function usePrepareVaultExitPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'exitPool'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'exitPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'exitPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"flashLoan"`.
 */
export function usePrepareVaultFlashLoan(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'flashLoan'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'flashLoan',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'flashLoan'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"joinPool"`.
 */
export function usePrepareVaultJoinPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'joinPool'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'joinPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'joinPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"managePoolBalance"`.
 */
export function usePrepareVaultManagePoolBalance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'managePoolBalance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'managePoolBalance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'managePoolBalance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"manageUserBalance"`.
 */
export function usePrepareVaultManageUserBalance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'manageUserBalance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'manageUserBalance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'manageUserBalance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerPool"`.
 */
export function usePrepareVaultRegisterPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'registerPool'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'registerPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'registerPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerTokens"`.
 */
export function usePrepareVaultRegisterTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'registerTokens'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'registerTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'registerTokens'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setAuthorizer"`.
 */
export function usePrepareVaultSetAuthorizer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setAuthorizer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'setAuthorizer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setAuthorizer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setPaused"`.
 */
export function usePrepareVaultSetPaused(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setPaused'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'setPaused',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setPaused'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setRelayerApproval"`.
 */
export function usePrepareVaultSetRelayerApproval(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setRelayerApproval'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'setRelayerApproval',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setRelayerApproval'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"swap"`.
 */
export function usePrepareVaultSwap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'swap'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: 'swap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'swap'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof vaultABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: vaultABI, ...config } as UseContractEventConfig<
    typeof vaultABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"AuthorizerChanged"`.
 */
export function useVaultAuthorizerChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'AuthorizerChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'AuthorizerChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'AuthorizerChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"ExternalBalanceTransfer"`.
 */
export function useVaultExternalBalanceTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'ExternalBalanceTransfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'ExternalBalanceTransfer',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'ExternalBalanceTransfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"FlashLoan"`.
 */
export function useVaultFlashLoanEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'FlashLoan'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'FlashLoan',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'FlashLoan'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"InternalBalanceChanged"`.
 */
export function useVaultInternalBalanceChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'InternalBalanceChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'InternalBalanceChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'InternalBalanceChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PausedStateChanged"`.
 */
export function useVaultPausedStateChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PausedStateChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'PausedStateChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PausedStateChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolBalanceChanged"`.
 */
export function useVaultPoolBalanceChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolBalanceChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'PoolBalanceChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolBalanceChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolBalanceManaged"`.
 */
export function useVaultPoolBalanceManagedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolBalanceManaged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'PoolBalanceManaged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolBalanceManaged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolRegistered"`.
 */
export function useVaultPoolRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolRegistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'PoolRegistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"RelayerApprovalChanged"`.
 */
export function useVaultRelayerApprovalChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'RelayerApprovalChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'RelayerApprovalChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'RelayerApprovalChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Swap"`.
 */
export function useVaultSwapEvent(
  config: Omit<UseContractEventConfig<typeof vaultABI, 'Swap'>, 'abi' | 'eventName'> = {} as any,
) {
  return useContractEvent({ abi: vaultABI, eventName: 'Swap', ...config } as UseContractEventConfig<
    typeof vaultABI,
    'Swap'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"TokensDeregistered"`.
 */
export function useVaultTokensDeregisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'TokensDeregistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'TokensDeregistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'TokensDeregistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"TokensRegistered"`.
 */
export function useVaultTokensRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'TokensRegistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: 'TokensRegistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'TokensRegistered'>)
}
