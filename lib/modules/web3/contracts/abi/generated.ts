import { useContractRead, UseContractReadConfig } from 'wagmi'
import { ReadContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BalancerV2ComposableStablePoolV5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdacf5fa19b1f720111609043ac67a9818262850c)
 */
export const balancerV2ComposableStablePoolV5ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ComposableStablePool.NewPoolParams',
        type: 'tuple',
        components: [
          { name: 'vault', internalType: 'contract IVault', type: 'address' },
          {
            name: 'protocolFeeProvider',
            internalType: 'contract IProtocolFeePercentagesProvider',
            type: 'address',
          },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
          { name: 'rateProviders', internalType: 'contract IRateProvider[]', type: 'address[]' },
          { name: 'tokenRateCacheDurations', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'exemptFromYieldProtocolFeeFlag', internalType: 'bool', type: 'bool' },
          { name: 'amplificationParameter', internalType: 'uint256', type: 'uint256' },
          { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' },
          { name: 'pauseWindowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'bufferPeriodDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'version', internalType: 'string', type: 'string' },
        ],
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'startValue', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endValue', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'startTime', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endTime', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AmpUpdateStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'currentValue', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'AmpUpdateStopped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
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
      { name: 'feeType', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'protocolFeePercentage', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProtocolFeePercentageCacheUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'RecoveryModeStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SwapFeePercentageChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'rate', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TokenRateCacheUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenIndex', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'provider', internalType: 'contract IRateProvider', type: 'address', indexed: true },
      { name: 'cacheDuration', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TokenRateProviderSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'disableRecoveryMode',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'enableRecoveryMode',
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
    name: 'getActualSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAmplificationParameter',
    outputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'isUpdating', internalType: 'bool', type: 'bool' },
      { name: 'precision', internalType: 'uint256', type: 'uint256' },
    ],
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
    name: 'getBptIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'getLastJoinExitData',
    outputs: [
      { name: 'lastJoinExitAmplification', internalType: 'uint256', type: 'uint256' },
      { name: 'lastPostJoinExitInvariant', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'getMinimumBpt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getNextNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'getPoolId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'feeType', internalType: 'uint256', type: 'uint256' }],
    name: 'getProtocolFeePercentageCache',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolFeesCollector',
    outputs: [{ name: '', internalType: 'contract IProtocolFeesCollector', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolSwapFeeDelegation',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRateProviders',
    outputs: [{ name: '', internalType: 'contract IRateProvider[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getScalingFactors',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getSwapFeePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenRateCache',
    outputs: [
      { name: 'rate', internalType: 'uint256', type: 'uint256' },
      { name: 'oldRate', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'expires', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVault',
    outputs: [{ name: '', internalType: 'contract IVault', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'inRecoveryMode',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isExemptFromYieldProtocolFee',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'isTokenExemptFromYieldProtocolFee',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onExitPool',
    outputs: [
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onJoinPool',
    outputs: [
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'swapRequest',
        internalType: 'struct IPoolSwapStructs.SwapRequest',
        type: 'tuple',
        components: [
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'tokenIn', internalType: 'contract IERC20', type: 'address' },
          { name: 'tokenOut', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'indexIn', internalType: 'uint256', type: 'uint256' },
      { name: 'indexOut', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onSwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'pause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryExit',
    outputs: [
      { name: 'bptIn', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsOut', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryJoin',
    outputs: [
      { name: 'bptOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsIn', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'poolConfig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setAssetManagerPoolConfig',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' }],
    name: 'setSwapFeePercentage',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTokenRateCacheDuration',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'rawEndValue', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'startAmplificationParameterUpdate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'stopAmplificationParameterUpdate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unpause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'updateProtocolFeePercentageCache',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'updateTokenRateCache',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdacf5fa19b1f720111609043ac67a9818262850c)
 */
export const balancerV2ComposableStablePoolV5Address = {
  1: '0xDACf5Fa19b1f720111609043ac67A9818262850c',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdacf5fa19b1f720111609043ac67a9818262850c)
 */
export const balancerV2ComposableStablePoolV5Config = {
  address: balancerV2ComposableStablePoolV5Address,
  abi: balancerV2ComposableStablePoolV5ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BalancerV2ERC4626LinearPoolV3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385)
 */
export const balancerV2Erc4626LinearPoolV3ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'args',
        internalType: 'struct ERC4626LinearPool.ConstructorArgs',
        type: 'tuple',
        components: [
          { name: 'vault', internalType: 'contract IVault', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'mainToken', internalType: 'contract IERC20', type: 'address' },
          { name: 'wrappedToken', internalType: 'contract IERC20', type: 'address' },
          { name: 'assetManager', internalType: 'address', type: 'address' },
          { name: 'upperTarget', internalType: 'uint256', type: 'uint256' },
          { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' },
          { name: 'pauseWindowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'bufferPeriodDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'version', internalType: 'string', type: 'string' },
        ],
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
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
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'RecoveryModeStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SwapFeePercentageChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address', indexed: true },
      { name: 'lowerTarget', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'upperTarget', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TargetsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'disableRecoveryMode',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'enableRecoveryMode',
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
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'getBptIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'getMainIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getMainToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getNextNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'getPoolId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolFeesCollector',
    outputs: [{ name: '', internalType: 'contract IProtocolFeesCollector', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getScalingFactors',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getSwapFeePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTargets',
    outputs: [
      { name: 'lowerTarget', internalType: 'uint256', type: 'uint256' },
      { name: 'upperTarget', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVault',
    outputs: [{ name: '', internalType: 'contract IVault', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVirtualSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getWrappedIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getWrappedToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getWrappedTokenRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'inRecoveryMode',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'initialize', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onExitPool',
    outputs: [
      { name: 'amountsOut', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'dueProtocolFees', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onJoinPool',
    outputs: [
      { name: 'amountsIn', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'dueProtocolFees', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'request',
        internalType: 'struct IPoolSwapStructs.SwapRequest',
        type: 'tuple',
        components: [
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'tokenIn', internalType: 'contract IERC20', type: 'address' },
          { name: 'tokenOut', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'indexIn', internalType: 'uint256', type: 'uint256' },
      { name: 'indexOut', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onSwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'request',
        internalType: 'struct IPoolSwapStructs.SwapRequest',
        type: 'tuple',
        components: [
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'tokenIn', internalType: 'contract IERC20', type: 'address' },
          { name: 'tokenOut', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'balanceTokenIn', internalType: 'uint256', type: 'uint256' },
      { name: 'balanceTokenOut', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onSwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'pause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryExit',
    outputs: [
      { name: 'bptIn', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsOut', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryJoin',
    outputs: [
      { name: 'bptOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsIn', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' }],
    name: 'setSwapFeePercentage',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newLowerTarget', internalType: 'uint256', type: 'uint256' },
      { name: 'newUpperTarget', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTargets',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unpause', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385)
 */
export const balancerV2Erc4626LinearPoolV3Address = {
  1: '0x6667c6fa9f2b3Fc1Cc8D85320b62703d938E4385',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385)
 */
export const balancerV2Erc4626LinearPoolV3Config = {
  address: balancerV2Erc4626LinearPoolV3Address,
  abi: balancerV2Erc4626LinearPoolV3ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BalancerV2GaugeV5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xbc02ef87f4e15ef78a571f3b2adcc726fee70d8b)
 */
export const balancerV2GaugeV5ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Withdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'original_balance', type: 'uint256', indexed: false },
      { name: 'original_supply', type: 'uint256', indexed: false },
      { name: 'working_balance', type: 'uint256', indexed: false },
      { name: 'working_supply', type: 'uint256', indexed: false },
    ],
    name: 'UpdateLiquidityLimit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_from', type: 'address', indexed: true },
      { name: '_to', type: 'address', indexed: true },
      { name: '_value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_owner', type: 'address', indexed: true },
      { name: '_spender', type: 'address', indexed: true },
      { name: '_value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'reward_token', type: 'address', indexed: true },
      { name: 'distributor', type: 'address', indexed: false },
    ],
    name: 'RewardDistributorUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'new_relative_weight_cap', type: 'uint256', indexed: false }],
    name: 'RelativeWeightCapChanged',
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'minter', type: 'address' },
      { name: 'veBoostProxy', type: 'address' },
      { name: 'authorizerAdaptor', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_value', type: 'uint256' },
      { name: '_addr', type: 'address' },
    ],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_value', type: 'uint256' },
      { name: '_addr', type: 'address' },
      { name: '_claim_rewards', type: 'bool' },
    ],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_value', type: 'uint256' },
      { name: '_claim_rewards', type: 'bool' },
    ],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'claim_rewards',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_addr', type: 'address' }],
    name: 'claim_rewards',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_addr', type: 'address' },
      { name: '_receiver', type: 'address' },
    ],
    name: 'claim_rewards',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_v', type: 'uint8' },
      { name: '_r', type: 'bytes32' },
      { name: '_s', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_added_value', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_subtracted_value', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'user_checkpoint',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_receiver', type: 'address' }],
    name: 'set_rewards_receiver',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'kick',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_reward_token', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'deposit_reward_token',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_reward_token', type: 'address' },
      { name: '_distributor', type: 'address' },
    ],
    name: 'add_reward',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_reward_token', type: 'address' },
      { name: '_distributor', type: 'address' },
    ],
    name: 'set_reward_distributor',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'killGauge', outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unkillGauge', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_addr', type: 'address' },
      { name: '_token', type: 'address' },
    ],
    name: 'claimed_reward',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_reward_token', type: 'address' },
    ],
    name: 'claimable_reward',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'claimable_tokens',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'integrate_checkpoint',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'future_epoch_time',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'inflation_rate',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', type: 'string' }],
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
      { name: '_lp_token', type: 'address' },
      { name: 'relative_weight_cap', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'relative_weight_cap', type: 'uint256' }],
    name: 'setRelativeWeightCap',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRelativeWeightCap',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'time', type: 'uint256' }],
    name: 'getCappedRelativeWeight',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'getMaxRelativeWeightCap',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
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
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lp_token',
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'is_killed',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'reward_count',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'reward_data',
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'token', type: 'address' },
          { name: 'distributor', type: 'address' },
          { name: 'period_finish', type: 'uint256' },
          { name: 'rate', type: 'uint256' },
          { name: 'last_update', type: 'uint256' },
          { name: 'integral', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'rewards_receiver',
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'arg0', type: 'address' },
      { name: 'arg1', type: 'address' },
    ],
    name: 'reward_integral_for',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'working_balances',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'working_supply',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'integrate_inv_supply_of',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'integrate_checkpoint_of',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'address' }],
    name: 'integrate_fraction',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'period',
    outputs: [{ name: '', type: 'int128' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    name: 'reward_tokens',
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    name: 'period_timestamp',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    name: 'integrate_inv_supply',
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xbc02ef87f4e15ef78a571f3b2adcc726fee70d8b)
 */
export const balancerV2GaugeV5Address = {
  1: '0xBC02eF87f4E15EF78A571f3B2aDcC726Fee70d8b',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xbc02ef87f4e15ef78a571f3b2adcc726fee70d8b)
 */
export const balancerV2GaugeV5Config = {
  address: balancerV2GaugeV5Address,
  abi: balancerV2GaugeV5ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BalancerV2Vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const balancerV2VaultABI = [
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
    stateMutability: 'nonpayable',
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

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const balancerV2VaultAddress = {
  1: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const balancerV2VaultConfig = {
  address: balancerV2VaultAddress,
  abi: balancerV2VaultABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BalancerV2WeightedPoolV4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e)
 */
export const balancerV2WeightedPoolV4ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'params',
        internalType: 'struct WeightedPool.NewPoolParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
          { name: 'normalizedWeights', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'rateProviders', internalType: 'contract IRateProvider[]', type: 'address[]' },
          { name: 'assetManagers', internalType: 'address[]', type: 'address[]' },
          { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'vault', internalType: 'contract IVault', type: 'address' },
      {
        name: 'protocolFeeProvider',
        internalType: 'contract IProtocolFeePercentagesProvider',
        type: 'address',
      },
      { name: 'pauseWindowDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'bufferPeriodDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'version', internalType: 'string', type: 'string' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
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
      { name: 'feeType', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'protocolFeePercentage', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProtocolFeePercentageCacheUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'RecoveryModeStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SwapFeePercentageChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DELEGATE_PROTOCOL_SWAP_FEES_SENTINEL',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'disableRecoveryMode',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'enableRecoveryMode',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getATHRateProduct',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'getActualSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'getInvariant',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLastPostJoinExitInvariant',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getNextNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getNormalizedWeights',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'getPoolId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'feeType', internalType: 'uint256', type: 'uint256' }],
    name: 'getProtocolFeePercentageCache',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolFeesCollector',
    outputs: [{ name: '', internalType: 'contract IProtocolFeesCollector', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolSwapFeeDelegation',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRateProviders',
    outputs: [{ name: '', internalType: 'contract IRateProvider[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getScalingFactors',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getSwapFeePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVault',
    outputs: [{ name: '', internalType: 'contract IVault', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'inRecoveryMode',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onExitPool',
    outputs: [
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onJoinPool',
    outputs: [
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'request',
        internalType: 'struct IPoolSwapStructs.SwapRequest',
        type: 'tuple',
        components: [
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'tokenIn', internalType: 'contract IERC20', type: 'address' },
          { name: 'tokenOut', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'balanceTokenIn', internalType: 'uint256', type: 'uint256' },
      { name: 'balanceTokenOut', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onSwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'pause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryExit',
    outputs: [
      { name: 'bptIn', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsOut', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'protocolSwapFeePercentage', internalType: 'uint256', type: 'uint256' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'queryJoin',
    outputs: [
      { name: 'bptOut', internalType: 'uint256', type: 'uint256' },
      { name: 'amountsIn', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'poolConfig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setAssetManagerPoolConfig',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'swapFeePercentage', internalType: 'uint256', type: 'uint256' }],
    name: 'setSwapFeePercentage',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unpause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'updateProtocolFeePercentageCache',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e)
 */
export const balancerV2WeightedPoolV4Address = {
  1: '0x3ff3a210e57cFe679D9AD1e9bA6453A716C56a2e',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e)
 */
export const balancerV2WeightedPoolV4Config = {
  address: balancerV2WeightedPoolV4Address,
  abi: balancerV2WeightedPoolV4ABI,
} as const

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
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link balancerV2ComposableStablePoolV5ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xdacf5fa19b1f720111609043ac67a9818262850c)
 */
export function useBalancerV2ComposableStablePoolV5Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof balancerV2ComposableStablePoolV5ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof balancerV2ComposableStablePoolV5ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof balancerV2ComposableStablePoolV5Address } = {} as any
) {
  return useContractRead({
    abi: balancerV2ComposableStablePoolV5ABI,
    address: balancerV2ComposableStablePoolV5Address[1],
    ...config,
  } as UseContractReadConfig<typeof balancerV2ComposableStablePoolV5ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link balancerV2Erc4626LinearPoolV3ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385)
 */
export function useBalancerV2Erc4626LinearPoolV3Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof balancerV2Erc4626LinearPoolV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof balancerV2Erc4626LinearPoolV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof balancerV2Erc4626LinearPoolV3Address } = {} as any
) {
  return useContractRead({
    abi: balancerV2Erc4626LinearPoolV3ABI,
    address: balancerV2Erc4626LinearPoolV3Address[1],
    ...config,
  } as UseContractReadConfig<typeof balancerV2Erc4626LinearPoolV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link balancerV2GaugeV5ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xbc02ef87f4e15ef78a571f3b2adcc726fee70d8b)
 */
export function useBalancerV2GaugeV5Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof balancerV2GaugeV5ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof balancerV2GaugeV5ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof balancerV2GaugeV5Address } = {} as any
) {
  return useContractRead({
    abi: balancerV2GaugeV5ABI,
    address: balancerV2GaugeV5Address[1],
    ...config,
  } as UseContractReadConfig<typeof balancerV2GaugeV5ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link balancerV2VaultABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useBalancerV2VaultRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof balancerV2VaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof balancerV2VaultABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof balancerV2VaultAddress } = {} as any
) {
  return useContractRead({
    abi: balancerV2VaultABI,
    address: balancerV2VaultAddress[1],
    ...config,
  } as UseContractReadConfig<typeof balancerV2VaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link balancerV2WeightedPoolV4ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e)
 */
export function useBalancerV2WeightedPoolV4Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof balancerV2WeightedPoolV4ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof balancerV2WeightedPoolV4ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof balancerV2WeightedPoolV4Address } = {} as any
) {
  return useContractRead({
    abi: balancerV2WeightedPoolV4ABI,
    address: balancerV2WeightedPoolV4Address[1],
    ...config,
  } as UseContractReadConfig<typeof balancerV2WeightedPoolV4ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}
