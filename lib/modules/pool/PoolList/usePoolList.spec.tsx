import { PoolList as PoolListType } from '@/lib/modules/pool/pool.types'
import { defaultPoolList, mockPoolList } from '@/test/msw/handlers/PoolList.handlers'
import { aGqlPoolMinimalMock } from '@/test/msw/builders/gqlPoolMinimal.builders'
import { testHook } from '@/test/utils/custom-renderers'

import { _usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'

async function renderUsePoolsList() {
  const { result, waitForLoadedUseQuery } = testHook(() => _usePoolList())
  await waitForLoadedUseQuery(result)
  return result
}

test('Returns pool list', async () => {
  const result = await renderUsePoolsList()

  expect(result.current.pools).toEqual(defaultPoolList)
})

test('Returns pool list with a custom mocked GQL pool', async () => {
  const mockedList: PoolListType = [aGqlPoolMinimalMock({ name: 'FOO BAL' })]

  mockPoolList(mockedList)

  const result = await renderUsePoolsList()

  expect(result.current.pools[0].name).toEqual('FOO BAL')
})
