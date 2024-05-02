import { ProjectConfig } from '@/lib/config/config.types'
import { fantom, optimism } from 'viem/chains'

export const beetsSupportedChains = [fantom, optimism] as const

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedChains: beetsSupportedChains,
}
