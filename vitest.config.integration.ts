/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { InlineConfig } from 'vitest'
import vitestUnitConfig from './vitest.config'

function setupFilesWithoutMswSetup() {
  const setupFiles = vitestUnitConfig.test!.setupFiles! as string[]
  return setupFiles.filter(file => file !== 'test/vitest/setup-msw.ts')
}

const isCI = true
const exclude = (tag: string) => {
  console.warn('Excluding tests tagged with', tag)
  console.log('\x1b[33m Welcome to the app! \x1b[0m')
  return `^((?!${tag}).)*$`
}

const integrationTestOptions: Partial<InlineConfig> = {
  include: ['./**/*.integration.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  // Avoid msw in integration tests
  setupFiles: [...setupFilesWithoutMswSetup(), 'test/vitest/setup-integration.ts'],
  globalSetup: ['./test/anvil/anvil-global-setup.ts'],
  testTimeout: 30_000,
  // Exclude slow tests in CI: TODO: add ci env
  testNamePattern: isCI ? exclude('slow') : undefined,
  // Consider disabling threads if we detect problems with anvil
  // poolOptions: {
  //   threads: { singleThread: true },
  // },
  retry: 1,
  // Uncomment the next line to exclude test for debug reasons
  // exclude: ['lib/modules/tokens/useTokenBalances.integration.spec.ts', 'node_modules', 'dist'],
}

const integrationConfig = vitestUnitConfig

integrationConfig.test = {
  ...integrationConfig.test,
  ...integrationTestOptions,
}

export default integrationConfig
