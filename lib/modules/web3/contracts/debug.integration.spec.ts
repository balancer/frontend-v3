import { testManagedTransaction } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'

test('relayer successful relayer approval transaction', async () => {
  const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

  const result = testManagedTransaction('balancer.vaultV2', 'setRelayerApproval', {
    args: [defaultTestUserAccount, balancerRelayer, true],
  })
})
