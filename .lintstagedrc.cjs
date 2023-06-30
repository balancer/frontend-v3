 module.exports = {
  '*.{js,jsx,ts,tsx}': ['bash -c "next lint --fix --max-warnings 0"', 'bash -c "pnpm run typecheck"'],
  '*.{md,json,yaml,ts,tsx}': "prettier --write",
  '*.css': "stylelint --fix"
}
