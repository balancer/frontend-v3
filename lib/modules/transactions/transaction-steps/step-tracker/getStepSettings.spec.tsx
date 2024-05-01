import { mockDeep } from 'vitest-mock-extended'
import { StepProps, getStepSettings } from './getStepSettings'
import { FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'

const flowStep = mockDeep<FlowStep>()

describe('generates step props', () => {
  test('when the step is active and the transaction execution is loading', () => {
    flowStep.simulation.isLoading = false
    flowStep.execution.isPending = true
    flowStep.result.isSuccess = false

    // Avoid "Expression produces a union type that is too complex to represent" only happening in this line
    // More context: https://github.com/chakra-ui/chakra-ui/issues/7526
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const props: StepProps = {
      currentIndex: 0,
      index: 0,
      step: { title: 'Add Liquidity' },
      colorMode: 'light',
      flowStep,
      isLastStep: true,
    }
    const state = getStepSettings(props)

    expect(state).toMatchInlineSnapshot(`
      {
        "color": "orange.300",
        "isActive": true,
        "isActiveLoading": true,
        "status": "active",
        "stepNumber": 1,
        "title": "Add Liquidity",
      }
    `)
  })

  test('when the last step transaction is complete (result is success)', () => {
    flowStep.result.isSuccess = true

    const props: StepProps = {
      currentIndex: 0,
      index: 0,
      step: { title: 'Add Liquidity' },
      colorMode: 'light',
      flowStep,
      isLastStep: true,
    }
    const state = getStepSettings(props)

    expect(state).toMatchInlineSnapshot(`
      {
        "color": "grayText",
        "isActive": true,
        "isActiveLoading": false,
        "status": "complete",
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
      isLastStep: true,
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
