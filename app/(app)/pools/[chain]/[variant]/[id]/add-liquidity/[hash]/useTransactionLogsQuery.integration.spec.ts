import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { Address, Hash } from 'viem'
import { useAddLiquidityReceipt, useRemoveLiquidityReceipt } from './useTransactionLogsQuery'

async function testAddReceipt(userAddress: Address, txHash: Hash) {
  const { result } = testHook(() => useAddLiquidityReceipt({ hash: txHash, userAddress }), {
    wrapper: DefaultPoolTestProvider,
  })
  return result
}

async function testRemoveReceipt(userAddress: Address, txHash: Hash) {
  const { result } = testHook(() => useRemoveLiquidityReceipt({ hash: txHash, userAddress }), {
    wrapper: DefaultPoolTestProvider,
  })
  return result
}

test('queries add liquidity transaction', async () => {
  // https://etherscan.io/tx/0x887f144bdfe73c7e585b0630361038bda9665aa213933f637d1d6fae9046652e
  const userAddress = '0x2a88a454A7b0C29d36D5A121b7Cf582db01bfCEC'
  const txHash = '0x887f144bdfe73c7e585b0630361038bda9665aa213933f637d1d6fae9046652e'

  const result = await testAddReceipt(userAddress, txHash)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  await waitFor(() => expect(result.current.sentTokens).toBeDefined())

  expect(result.current.sentTokens).toEqual([
    {
      tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f',
      humanAmount: '12',
    },
    {
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      humanAmount: '0.04',
    },
  ])

  expect(result.current.receivedBptUnits).toBe('7.669852124112308228')
})

test('queries remove liquidity transaction', async () => {
  // https://etherscan.io/tx/0x71301b46984d3d2e6b58c1fc0c99cc0561ec0f26d53bda8413528a7fb6828fc3
  const userAddress = '0x84f240cA232917d771DFBbd8C917B4669Ed640CD'
  const txHash = '0x71301b46984d3d2e6b58c1fc0c99cc0561ec0f26d53bda8413528a7fb6828fc3'

  const result = await testRemoveReceipt(userAddress, txHash)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  await waitFor(() => expect(result.current.receivedTokens).toBeDefined())

  expect(result.current.receivedTokens).toEqual([
    {
      humanAmount: '16597.845312687911573359',
      tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f',
    },
    {
      humanAmount: '4.553531492712836774',
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  ])

  expect(result.current.sentBptUnits).toBe('6439.400687368663510166')
})

test('returns query error when user is not connected', async () => {
  const userAddress = '' as Address
  const txHash = '0x887f144bdfe73c7e585b0630361038bda9665aa213933f637d1d6fae9046652e'

  const result = await testAddReceipt(userAddress, txHash)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  await waitFor(() => expect(result.current.error).toBe('User is not connected'))
})
