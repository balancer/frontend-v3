import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Features, ProjectConfig } from './config.types'
import { getProjectConfig } from './getProjectConfig'

export function hasFeature(chain: GqlChain, feature: Features): boolean {
  const projectConfig = getProjectConfig()
  return checkFeatureForProject(projectConfig, chain, feature)
}

function checkFeatureForProject(
  projectConfig: ProjectConfig,
  chain: GqlChain,
  feature: Features
): boolean {
  if (!projectConfig.supportedNetworks.includes(chain)) {
    return false
  }

  const features = projectConfig.features[chain]
  return features ? features.includes(feature) : false
}
