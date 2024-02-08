import {
  DefaultAddLiquidityTestProvider,
  DefaultPoolTestProvider,
  testHook,
} from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useSignRelayerApproval } from './signRelayerApproval.hooks'
import { PropsWithChildren } from 'react'
import { useAddLiquidity } from '../pool/actions/add-liquidity/useAddLiquidity'

const Providers = ({ children }: PropsWithChildren) => (
  <DefaultPoolTestProvider>
    <DefaultAddLiquidityTestProvider>{children}</DefaultAddLiquidityTestProvider>
  </DefaultPoolTestProvider>
)

test('Signs relayer approval and saves signature in the addLiquidity provider state', async () => {
  const { result } = testHook(
    () => {
      const { relayerApprovalSignature } = useAddLiquidity()
      const signResult = useSignRelayerApproval()
      return { ...signResult, relayerApprovalSignature }
    },
    {
      wrapper: Providers,
    }
  )

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  await act(() => result.current.signRelayer())

  expect(result.current.relayerApprovalSignature).toBeDefined()
})
