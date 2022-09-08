module.exports = {
  env: {
    browser: true,
  },
  extends: ['../.eslintrc.cjs', 'plugin:react/jsx-runtime'],
  ignorePatterns: ['dist'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: 'frontend',
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
