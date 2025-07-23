import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
}, {
  rules: {
    'n/prefer-global/process': ['never'], // 关闭const CWD = process.cwd()报错
  },
})
