export const OmniVotingEscrowAbi = [
  {
    inputs: [{ internalType: 'contract IVault', name: 'vault', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes',
        name: 'newAdapterParams',
        type: 'bytes',
      },
    ],
    name: 'AdapterParamsUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract IOmniVotingEscrow',
        name: 'newOmniVotingEscrow',
        type: 'address',
      },
    ],
    name: 'OmniVotingEscrowUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'newUseZero',
        type: 'bool',
      },
    ],
    name: 'UseZeroUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newZeroPaymentAddress',
        type: 'address',
      },
    ],
    name: 'ZeroPaymentAddressUpdated',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_dstChainId', type: 'uint16' }],
    name: 'estimateSendUserBalance',
    outputs: [
      { internalType: 'uint256', name: 'nativeFee', type: 'uint256' },
      { internalType: 'uint256', name: 'zroFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'getActionId',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAdapterParams',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAuthorizer',
    outputs: [{ internalType: 'contract IAuthorizer', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOmniVotingEscrow',
    outputs: [
      {
        internalType: 'contract IOmniVotingEscrow',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUseZero',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVault',
    outputs: [{ internalType: 'contract IVault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getZeroPaymentAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      {
        internalType: 'address payable',
        name: '_refundAddress',
        type: 'address',
      },
    ],
    name: 'sendUserBalance',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'adapterParams', type: 'bytes' }],
    name: 'setAdapterParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IOmniVotingEscrow',
        name: 'omniVotingEscrow',
        type: 'address',
      },
    ],
    name: 'setOmniVotingEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: 'useZro', type: 'bool' }],
    name: 'setUseZero',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'paymentAddress', type: 'address' }],
    name: 'setZeroPaymentAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
