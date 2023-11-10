import { GetAppGlobalPollingDataDocument } from '@/lib/shared/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { anAppGlobalData } from '@/lib/modules/tokens/__mocks__/AppGlobalData.builders'

export const defaultAppGlobalDataMock = anAppGlobalData()

export function buildAppGlobalDataMswHandler(appGlobalData = defaultAppGlobalDataMock) {
  return graphql.query(getQueryName(GetAppGlobalPollingDataDocument), (req, res, ctx) => {
    return res(ctx.data(appGlobalData))
  })
}

export function mockAppGlobalData(appGlobalData = defaultAppGlobalDataMock) {
  mockGQL(buildAppGlobalDataMswHandler(appGlobalData))
}
