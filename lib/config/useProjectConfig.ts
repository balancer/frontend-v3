import { ProjectConfigBeets } from '@/lib/config/projects/beets'
import { ProjectConfigBalancer } from '@/lib/config/projects/balancer'

export const PROJECT_CONFIG =
  process.env.NEXT_PUBLIC_PROJECT_ID === 'beets' ? ProjectConfigBeets : ProjectConfigBalancer

export function useProjectConfig() {
  return PROJECT_CONFIG
}
