import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { useErc20Read } from './useErc20Read'
import { getSdkTestUtils } from '@/test/integration/sdk-utils'
import { poolId, vaultV2Address, wETHAddress } from '@/lib/debug-helpers'
import { MAX_BIGINT } from '@/lib/shared/utils/bigint'

const utils = await getSdkTestUtils({ poolId })
// setupToken approves WETH with MAX_BIGINT allowance
await utils.setupToken('100', wETHAddress)

test('fetches token allowance (WETH)', async () => {
  const ownerAddress = defaultTestUserAccount
  const spenderAddress = vaultV2Address

  const { result } = testHook(() => {
    return useErc20Read(wETHAddress, 'allowance', {
      args: [ownerAddress, spenderAddress],
    })
  })

  await waitFor(() => expect(result.current.status).toBe('success'))
  expect(result.current.data).toBe(MAX_BIGINT)
})
