import { SupportedChainId } from '@/lib/config/config.types'
import { StepConfig } from '../useIterateSteps'

export type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
  chainId: SupportedChainId
}
