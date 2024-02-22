import { daiAddress, maticAddress } from '@/lib/debug-helpers'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { startFork } from '@/test/anvil/anvil-runner'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { erc20ABI } from 'wagmi'
import { ChainContractConfig, useMulticall } from './useMulticall'

// In wagmi v1 we cannot test 2 chains at the same time but this will be possible in wagmi v2
// (check wagmi-test-setup.ts comments)
describe('Performs multicall in multiple chains', () => {
  const polygonRequest: ChainContractConfig = {
    id: 'maticBalance',
    chain: GqlChain.Polygon,
    abi: erc20ABI,
    address: maticAddress,
    functionName: 'balanceOf',
    args: [defaultTestUserAccount],
  }

  const mainnetRequest: ChainContractConfig = {
    id: 'ethBalance',
    chain: GqlChain.Mainnet,
    abi: erc20ABI,
    address: daiAddress,
    functionName: 'balanceOf',
    args: [defaultTestUserAccount],
  }

  test('including polygon contracts', async () => {
    await startFork('POLYGON')

    const multicallRequests: ChainContractConfig[] = [polygonRequest]

    const { result } = testHook(() => useMulticall(multicallRequests))

    await waitFor(() => expect(result.current.results.POLYGON.data).toBeDefined())
    expect(result.current.results.POLYGON.data).toMatchInlineSnapshot(`
    {
      "maticBalance": {
        "result": 10000000000000000000000n,
        "status": "success",
      },
    }
  `)
  })

  test('including mainnet contracts', async () => {
    const multicallRequests: ChainContractConfig[] = [mainnetRequest]

    await startFork('MAINNET')

    const { result } = testHook(() => useMulticall(multicallRequests))

    await waitFor(() => expect(result.current.results.MAINNET.data).toBeDefined())

    expect(result.current.results.MAINNET.data).toMatchInlineSnapshot(`
      {
        "ethBalance": {
          "result": 0n,
          "status": "success",
        },
      }
    `)
  })
})
