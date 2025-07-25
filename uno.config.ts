import { defineConfig } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      // 添加自定义颜色变量
      'primary': 'var(--td-text-color-primary)',
      'secondary': 'var(--td-text-color-secondary)',
      'success': 'var(--td-text-color-success)',
      'warning': 'var(--td-text-color-warning)',
      'error': 'var(--td-text-color-error)',
      'page-color': 'var(--td-bg-color-page)',
    },
  },
})
