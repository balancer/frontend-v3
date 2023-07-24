import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    ['./lib/services/api/generated/schema.graphql']: {
      schema: 'https://api-v3.balancer.fi/graphql',
      plugins: ['schema-ast'],
    },
    [`./lib/services/api/generated/types.ts`]: {
      schema: 'https://api-v3.balancer.fi/graphql',
      documents: ['./lib/services/api/**/*.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
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
