import { getProjectConfig } from '@/lib/config/getProjectConfig'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const { projectId, projectName } = getProjectConfig()
  return {
    name: `${projectName}`,
    short_name: `${projectName}`,
    description: `${projectName} is a battle-tested toolkit for true AMM experimentation and innovation.`,
    start_url: '/pools',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: `${projectId}.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
