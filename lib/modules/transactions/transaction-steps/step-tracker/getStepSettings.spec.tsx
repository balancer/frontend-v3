import { mockDeep } from 'vitest-mock-extended'
import { StepProps, getStepSettings } from './getStepSettings'
import { FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'

const flowStep = mockDeep<FlowStep>()

describe('generates step props', () => {
  test('when the step is active and the transaction execution is loading', () => {
    flowStep.simulation.isLoading = false
    flowStep.execution.isLoading = true

    const props: StepProps = {
      currentIndex: 0,
      index: 0,
      step: { title: 'Add Liquidity' },
      colorMode: 'light',
      flowStep,
    }
    const state = getStepSettings(props)

    expect(state).toMatchInlineSnapshot(`
      {
        "color": "orange",
        "isActive": true,
        "isActiveLoading": true,
        "status": "active",
        "stepNumber": 1,
        "title": "Add Liquidity",
      }
    `)
  })

  test('when the step is incomplete', () => {
    const props: StepProps = {
      currentIndex: 0,
      index: 1,
      step: { title: 'Add Liquidity' },
      colorMode: 'light',
      flowStep: undefined,
    }
    const state = getStepSettings(props)

    expect(state).toMatchInlineSnapshot(`
      {
        "color": "gray",
        "isActive": false,
        "isActiveLoading": false,
        "status": "incomplete",
        "stepNumber": 2,
        "title": "Add Liquidity",
      }
    `)
  })
})
