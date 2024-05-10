export const FeeDistributorStaticAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'contract IERC20[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    name: 'claimTokens',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
