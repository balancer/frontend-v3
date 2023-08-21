import { Address } from 'viem'

import { AbiERC20 } from '@/lib/abi/AbiERC20'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { createWagmiTestConfig } from '@/test/utils/wagmi'
import { readContracts } from 'wagmi/actions'

test('readContracts with allowFailure', async () => {
  //NOTE: Needed if we use wagmi outside hooks/components
  createWagmiTestConfig()

  const anvilTestAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address

  const bal = fakeTokenBySymbol('BAL')
  const usdc = fakeTokenBySymbol('USDC')

  const tokens = [bal, usdc]

  const data = await readContracts({
    contracts: tokens.map(token => ({
      abi: AbiERC20,
      address: token.address as Address,
      functionName: 'balanceOf',
      args: [anvilTestAccount],
    })),
    allowFailure: false,
  })

  expect(data).toEqual([0n, 0n])
})
