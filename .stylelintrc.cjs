module.exports = {
  extends: [
    'stylelint-config-standard',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    // Ignore "display: -webkit-box;"
    // This line clampin technique only works with the webkit prefix.
    // https://css-tricks.com/line-clampin/
    'value-no-vendor-prefix': [true, { ignoreValues: ['box'] }],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind']
      }
    ],
  },
};
