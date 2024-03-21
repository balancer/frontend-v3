import {
  captureLiquidityHandlerError,
  captureWagmiSimulationError,
} from '@/lib/shared/utils/query-errors'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import * as Sentry from '@sentry/nextjs'
import { waitFor } from '@testing-library/react'
import sentryTestkit from 'sentry-testkit'
import { recoveryPoolMock } from '../../modules/pool/__mocks__/recoveryPoolMock'
// eslint-disable-next-line max-len
import { Extras } from '@sentry/types'
// eslint-disable-next-line max-len
import { RecoveryRemoveLiquidityHandler } from '../../modules/pool/actions/remove-liquidity/handlers/RecoveryRemoveLiquidity.handler'

const { testkit, sentryTransport } = sentryTestkit()
const test_DSN = 'https://testDns@sentry.io/000001'

Sentry.init({
  dsn: test_DSN,
  transport: sentryTransport,
})

async function getSentryReport() {
  await waitFor(() => expect(testkit.reports()).toHaveLength(1))
  return testkit.reports()[0]
}

describe('Captures sentry error', () => {
  afterEach(() => testkit.reset())

  test('for simple Error exception', async function () {
    const error = new Error('Test error')
    Sentry.captureException(error, { extra: { foo: 'bar' } })

    const report = await getSentryReport()

    expect(report.error?.message).toBe('Test error')
    expect(report.extra).toEqual({ foo: 'bar' })
  })

  test('for liquidity handler query error', async function () {
    const params = {
      handler: new RecoveryRemoveLiquidityHandler(recoveryPoolMock),
      userAddress: defaultTestUserAccount,
      slippage: '0.1',
      poolId: recoveryPoolMock.id,
      humanBptIn: '1',
    }

    captureLiquidityHandlerError(new Error('test cause error'), 'Test error message', params)

    const report = await getSentryReport()

    expect(report.level).toBe('fatal')
    expect(report.error?.name).toBe('Error')
    expect(report.error?.message).toBe('test cause error')
    expect(report.extra).toMatchInlineSnapshot(`
      {
        "handler": "RecoveryRemoveLiquidityHandler",
        "params": {
          "handler": {
            "helpers": "[LiquidityActionHelpers]",
            "isRecovery": true,
          },
          "humanBptIn": "1",
          "poolId": "0x4fd4687ec38220f805b6363c3c1e52d0df3b5023000200000000000000000473",
          "slippage": "0.1",
          "userAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      }
    `)
  })

  test('for wagmi simulation error', async function () {
    const extra: Extras = {
      tokenSymbol: 'BAL',
      tokenAmount: 100,
    }

    captureWagmiSimulationError(
      new Error('Error in viem'),
      'Error executing token approval tx',
      extra
    )

    const report = await getSentryReport()

    expect(report.level).toBe('fatal')
    expect(report.error?.name).toBe('Error')
    expect(report.error?.message).toBe('Error in viem')
    expect(report.extra).toMatchInlineSnapshot(`
      {
        "tokenAmount": 100,
        "tokenSymbol": "BAL",
      }
    `)
  })
})
