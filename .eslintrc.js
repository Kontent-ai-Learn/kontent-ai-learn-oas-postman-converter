module.exports = {
  root: true,
  parserOptions: {
    project: ['./tsconfig.shared.json'],
    tsconfigRootDir: __dirname,
  },
  extends: [
    /* Everything that does not require type-aware analysis should be specified in extended config */
    './.eslintrc.typeless.js',
  ],
  rules: {
    /* Turn on type-aware rules that are not checked in the './.eslintrc.typeless.js' */
    /* To see which rules require type-aware analysis and decide whether it goes here or to .eslintrc.typeless.js, see: */
    /* https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules */
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/require-array-sort-compare': 'error',
    '@typescript-eslint/require-await': 'error',
  },
};
