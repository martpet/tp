module.exports = {
  env: {
    node: true,
  },
  extends: ['../.eslintrc.cjs'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: 'backend',
  },
  ignorePatterns: ['cdk.out'],
  rules: {
    'no-new': 'off',
  },
};
