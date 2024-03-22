import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { StepConfig } from '../useIterateSteps'

export type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
  chain: GqlChain
}
