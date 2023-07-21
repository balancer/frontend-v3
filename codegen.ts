import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://api-v3.balancer.fi/graphql',
  documents: ['./lib/services/api/**/*.graphql'],
  generates: {
    './lib/services/api/generated/': {
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
    ['./lib/services/api/generated/schema.graphql']: {
      plugins: ['schema-ast'],
    },
  },

  hooks: {
    afterAllFileWrite: ['eslint --fix --ext .ts,.tsx'],
  },
}

export default config
