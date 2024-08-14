import { copyFileSync } from 'fs'

/*
  This script is a workaround to generate a manifest.json file that is compatible with Safe Apps.
  Using nextjs manifest.ts does not work because:
  1) nextjs is using manifest.webmanifest instead of manifest.json (not supported by Safe Apps)
  2) nextjs only supports manifest.ts in the root folder but we also need it in /public/pools
  More info:
  https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file
*/
const isBeets = process.env.PROTOCOL === 'beets'

const protocol = isBeets ? 'beets' : 'balancer'

const sourcePath = `./scripts/${protocol}.pools.manifest.json`
const destinationPath = './public/pools/manifest.json'

copyFileSync(sourcePath, destinationPath)

console.log(`✅ manifest.json for ${protocol} saved in /public/pools/manifest.json`)
