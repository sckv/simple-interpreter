module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    mongo: true,
    worker: true,
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended', 
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    useJSXTextNode: true,
    project: './tsconfig.json',
    tsconfigRootDir: '.',
    extraFileExtensions: ['.tsx', '.ts'],
  },
  plugins: ['prettier', 'jest', 'security', 'import'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  settings: {
    react: {
      version: '16.8.6', // Tells eslint-plugin-react to automatically detect the version of React to use
    }, 
    'import/resolver': {
      'node': {
        'extensions': [
          '.ts',
          '.tsx'   
        ]
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': [ '.ts', '.tsx']
    }
  },
  rules: {
    '@typescript-eslint/generic-type-naming': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
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
    // IMPORT
    'typescript': {
      'directory': '.'
    },
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-unresolved': 0,
    'import/order': ['error', {
      'newlines-between': 'always',
      'groups': ['external', 'internal', 'index', 'sibling', 'parent',  'builtin']
    }
    ],
  },
};
