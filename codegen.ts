import { CodegenConfig } from '@graphql-codegen/cli'
import { config as appConfig } from './lib/config/app.config'

const config: CodegenConfig = {
  generates: {
    ['./lib/services/api/generated/schema.graphql']: {
      schema: appConfig.apiUrl,
      plugins: ['schema-ast'],
    },
    [`./lib/services/api/generated/`]: {
      schema: appConfig.apiUrl,
      documents: ['./lib/services/api/**/*.graphql'],
      preset: 'client',
      config: {
        scalars: {
          BigInt: 'string',
          BigDecimal: 'string',
          Bytes: 'string',
          AmountHumanReadable: 'string',
          GqlBigNumber: 'string',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['eslint --fix --ext .ts,.tsx'],
  },
}

export default config
