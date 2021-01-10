module.exports = {
  env: {
    node: true,
    jest: true,
    worker: true,
    'jest/globals': true,
  },
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.',
    extraFileExtensions: ['.ts'],
  },
  plugins: ['prettier', 'jest'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
  rules: {
    '@typescript-eslint/generic-type-naming': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    semi: ['error', 'always'],
    strict: 0,
    'no-duplicate-imports': 2,
    'no-class-assign': 2,
    'no-useless-constructor': 1,
    'no-useless-computed-key': 2,
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'no-eval': 2,
  },
};
