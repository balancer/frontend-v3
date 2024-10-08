export const VeDelegationProxyL2Abi = [
  {
    inputs: [
      { internalType: 'contract IVault', name: 'vault', type: 'address' },
      {
        internalType: 'contract IERC20',
        name: 'votingEscrow',
        type: 'address',
      },
      {
        internalType: 'contract IVeDelegation',
        name: 'delegation',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'DelegationImplementationUpdated',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'adjustedBalanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'adjusted_balance_of',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    name: 'getAuthorizer',
    outputs: [{ internalType: 'contract IAuthorizer', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDelegationImplementation',
    outputs: [
      {
        internalType: 'contract IVeDelegation',
        name: '',
        type: 'address',
      },
    ],
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
    name: 'getVotingEscrow',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'killDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IVeDelegation',
        name: 'delegation',
        type: 'address',
      },
    ],
    name: 'setDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]
