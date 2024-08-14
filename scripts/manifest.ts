import { loadEnvConfig } from '@next/env'
loadEnvConfig('.')
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import type { MetadataRoute } from 'next'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

/*
  This script is a workaround to generate a manifest.json file that is compatible with Safe Apps.
  Using nextjs manifest.ts does not work because:
  1) nextjs is using manifest.webmanifest instead of manifest.json (not supported by Safe Apps)
  2) nextjs only supports manifest.ts in the root folder but we also need it in /public/pools
  More info:
  https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file
*/
function buildRootManifest(): MetadataRoute.Manifest {
  const { projectId, projectName } = getProjectConfig()
  return {
    name: `${projectName}`,
    short_name: `${projectName}`,
    description: `${projectName} is a battle-tested toolkit for true AMM experimentation and innovation.`,
    start_url: '.',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: `/images/icons/${projectId}.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
    ],
  }
}

// We need a manifest.json in /public/pools to be used by Safe Apps
function buildPoolsManifest(): MetadataRoute.Manifest {
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

writeFileSync(
  resolve(__dirname, '../app/manifest.json'),
  JSON.stringify(buildRootManifest(), null, 2)
)
console.log('Root manifest.json saved in /app/')

writeFileSync(
  resolve(__dirname, '../public/pools/manifest.json'),
  JSON.stringify(buildPoolsManifest(), null, 2)
)
console.log('Pools manifest.json saved in /public/pools')
