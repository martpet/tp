module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],
  ignorePatterns: ['!.*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['simple-import-sort', 'prettier', 'import', 'unused-imports'],
  root: true,
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'no-console': 'off',
    'no-var': 'off',
    'vars-on-top': 'off',
    'newline-before-return': 'warn',
    'no-plusplus': 'off',
  },
};
