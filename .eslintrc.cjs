/* eslint-env node */
module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],

  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    'prettier/prettier': 'warn',
    curly: ['error', 'multi-line'],
    'no-console': ['off'],
    'max-len': ['warn', { code: 120, ignoreComments: true, ignoreUrls: true }],
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-html-link-for-pages': ['off'],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['wagmi'],
            importNames: ['useAccount'],
            message: 'Use useUserAccount instead to avoid hydration issues',
          },
          {
            group: ['wagmi/dist'],
            message: 'Invalid import: remove dist from import path',
          },
          {
            /*
              There are some differences in behavior between react-query v3 (used by wagmi 1.X), v4 and v5
              With this rule we try to stick to react-query v3 API until we eventually migrate to wagmi v2 (and react-query v5)
              https://github.com/TanStack/query/issues/3584#issuecomment-1782331608
            */
            group: ['@tanstack/react-query'],
            importNames: ['useQuery'],
            message:
              'Import useQuery from wagmi to keep a unified useQuery API until we migrate to wagmi v2',
          },
          {
            group: ['@apollo/client'],
            importNames: ['useQuery'],
            message:
              // eslint-disable-next-line max-len
              'Import useQuery from @apollo/experimental-nextjs-app-support/ssr to avoid u.inFlightLinkObservables errors',
          },
        ],
      },
    ],
  },
}
