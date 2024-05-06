export const VeBALAbi = [
  {
    name: 'CommitOwnership',
    inputs: [
      {
        name: 'admin',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'ApplyOwnership',
    inputs: [
      {
        name: 'admin',
        type: 'address',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Deposit',
    inputs: [
      {
        name: 'provider',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'locktime',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'type',
        type: 'int128',
        indexed: false,
      },
      {
        name: 'ts',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Withdraw',
    inputs: [
      {
        name: 'provider',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ts',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    name: 'Supply',
    inputs: [
      {
        name: 'prevSupply',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'supply',
        type: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
    type: 'event',
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'token_addr',
        type: 'address',
      },
      {
        name: '_name',
        type: 'string',
      },
      {
        name: '_symbol',
        type: 'string',
      },
      {
        name: '_version',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_transfer_ownership',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
    ],
    outputs: [],
    gas: 39445,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'apply_transfer_ownership',
    inputs: [],
    outputs: [],
    gas: 41536,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_smart_wallet_checker',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
    ],
    outputs: [],
    gas: 37665,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'apply_smart_wallet_checker',
    inputs: [],
    outputs: [],
    gas: 39641,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_last_user_slope',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'int128',
      },
    ],
    gas: 5124,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'user_point_history__ts',
    inputs: [
      {
        name: '_addr',
        type: 'address',
      },
      {
        name: '_idx',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2927,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'locked__end',
    inputs: [
      {
        name: '_addr',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 2912,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'checkpoint',
    inputs: [],
    outputs: [],
    gas: 37283250,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'deposit_for',
    inputs: [
      {
        name: '_addr',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [],
    gas: 37475758,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'create_lock',
    inputs: [
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_unlock_time',
        type: 'uint256',
      },
    ],
    outputs: [],
    gas: 37483576,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'increase_amount',
    inputs: [
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [],
    gas: 37479799,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'increase_unlock_time',
    inputs: [
      {
        name: '_unlock_time',
        type: 'uint256',
      },
    ],
    outputs: [],
    gas: 37486953,
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'withdraw',
    inputs: [],
    outputs: [],
    gas: 37465773,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 12660,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
      {
        name: '_t',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 12660,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOfAt',
    inputs: [
      {
        name: 'addr',
        type: 'address',
      },
      {
        name: '_block',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 792910,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 905026,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupply',
    inputs: [
      {
        name: 't',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 905026,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupplyAt',
    inputs: [
      {
        name: '_block',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 1287488,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'token',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 2970,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'supply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 3000,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'locked',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          {
            name: 'amount',
            type: 'int128',
          },
          {
            name: 'end',
            type: 'uint256',
          },
        ],
      },
    ],
    gas: 5453,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'epoch',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 3060,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'point_history',
    inputs: [
      {
        name: 'arg0',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          {
            name: 'bias',
            type: 'int128',
          },
          {
            name: 'slope',
            type: 'int128',
          },
          {
            name: 'ts',
            type: 'uint256',
          },
          {
            name: 'blk',
            type: 'uint256',
          },
        ],
      },
    ],
    gas: 9524,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'user_point_history',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
      {
        name: 'arg1',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          {
            name: 'bias',
            type: 'int128',
          },
          {
            name: 'slope',
            type: 'int128',
          },
          {
            name: 'ts',
            type: 'uint256',
          },
          {
            name: 'blk',
            type: 'uint256',
          },
        ],
      },
    ],
    gas: 9820,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'user_point_epoch',
    inputs: [
      {
        name: 'arg0',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 3416,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'slope_changes',
    inputs: [
      {
        name: 'arg0',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'int128',
      },
    ],
    gas: 3295,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    gas: 13499,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    gas: 11258,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    gas: 11288,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    gas: 3300,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_smart_wallet_checker',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 3330,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'smart_wallet_checker',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 3360,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 3390,
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_admin',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    gas: 3420,
  },
]
