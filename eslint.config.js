// eslint.config.js (ESLint v9+ flat config)
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import next from 'eslint-plugin-next'
import prettier from 'eslint-config-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  next.configs.recommended,
  prettier,
  {
    plugins: {
      unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'react/react-in-jsx-scope': 'off', // not needed for Next.js
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]