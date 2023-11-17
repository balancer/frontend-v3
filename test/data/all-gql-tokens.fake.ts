/* TBD:
 Maybe adding a command to reload this file (with 10 tokens for each chain) from a real request
 */
export const allFakeGqlTokens = [
  {
    __typename: 'GqlToken',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    priority: 0,
    tradable: true,
  },
  {
    __typename: 'GqlToken',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    priority: 0,
    tradable: true,
  },
  {
    __typename: 'GqlToken',
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
    name: 'Balancer',
    symbol: 'BAL',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xba100000625a3754423978a60c9317c58a424e3d.png',
    priority: 0,
    tradable: true,
  },
  {
    __typename: 'GqlToken',
    address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
    name: 'Rocket Pool Protocol',
    symbol: 'RPL',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/0xd33526068d116ce69f19a9ee46f0bd304f21a51f.png',
    priority: 0,
    tradable: true,
  },
  {
    __typename: 'GqlToken',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    chainId: 1,
    logoURI:
      'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    priority: 0,
    tradable: false,
  },
  {
    __typename: 'GqlToken',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    priority: 0,
    tradable: false,
  },
  {
    __typename: 'GqlToken',
    address: '0x9ba00d6856a4edf4665bca2c2309936572473b7e',
    name: 'Aave Interest bearing USDC',
    symbol: 'aUSDC',
    decimals: 6,
    chainId: 1,
    logoURI: 'https://assets.coingecko.com/coins/images/11674/large/aUSDC.png?1592546449',
    priority: 0,
    tradable: true,
  },
  {
    __typename: 'GqlToken',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    chainId: 1,
    logoURI:
      'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    priority: 0,
    tradable: true,
  },
]

export function fakeTokenBySymbol(symbol: string) {
  const token = allFakeGqlTokens.find(token => token.symbol === symbol)
  if (!token) {
    console.log(
      'Available fake tokens: ',
      allFakeGqlTokens.map(token => token.symbol)
    )
    throw new Error(`Invalid symbol for fake token: ${symbol}`)
  }
  return token
}

// console.log(
//   JSON.stringify(
//     allFakeGqlTokens.map(t => t.symbol),
//     null,
//     2
//   )
// )
