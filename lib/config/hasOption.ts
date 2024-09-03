import { Options } from './config.types'
import { getProjectConfig } from './getProjectConfig'

export function hasOption(option: Options): boolean {
  const projectConfig = getProjectConfig()
  return projectConfig.options.includes(option)
}
