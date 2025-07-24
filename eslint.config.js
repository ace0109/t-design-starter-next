import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
}, {
  rules: {
    'no-console': 'warn',
    /* Allow start with _ */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'vue/no-unused-vars': [
      'error',
      {
        ignorePattern: '^_',
      },
    ],
  },
})
