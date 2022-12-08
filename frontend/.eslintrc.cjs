module.exports = {
  env: {
    browser: true,
  },
  extends: ['../.eslintrc.cjs', 'plugin:react/jsx-runtime'],
  plugins: ['formatjs'],
  ignorePatterns: ['dist'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
    tsconfigRootDir: 'frontend',
  },
  rules: {
    'formatjs/enforce-description': ['error', 'literal'],
    'formatjs/enforce-default-message': ['error', 'literal'],
    'formatjs/enforce-placeholders': 'error',
    'formatjs/no-literal-string-in-jsx': 'warn',
    'formatjs/no-multiple-whitespaces': 'error',
    'formatjs/no-multiple-plurals': 'error',
    'formatjs/no-offset': 'error',
    'formatjs/no-camel-case': 'error',
    'formatjs/no-id': 'error',
    'formatjs/enforce-id': [
      'off',
      { idInterpolationPattern: '[sha512:contenthash:base64:6]' },
    ],
    'formatjs/no-complex-selectors': 'error',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/style-prop-object': ['error', { allow: ['Button'] }],
    'no-restricted-imports': 'off',
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'no-param-reassign': ['error', { props: false }],
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'react-redux',
        importNames: [
          // 'useSelector',
          'useDispatch',
        ],
        message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
      },
      {
        name: '~/features/app',
        importNames: ['selectToolbarPosition'],
        message: 'Use hook `useToolbarPosition` instead.',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
