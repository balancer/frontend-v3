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
        ],
      },
    ],
  },
}
