import type { DropdownOption } from 'tdesign-vue-next'
import type { I18nOptions } from 'vue-i18n'
import { useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import { computed } from 'vue'
import { createI18n } from 'vue-i18n'

// 语言代码标准化函数
function normalizeLocale(locale: string): string {
  return locale.replace('_', '-')
}

// 获取浏览器默认语言环境
const languages = usePreferredLanguages()

// 获取标准化的默认语言
const defaultLocale = normalizeLocale(languages.value[0] || 'zh-CN')

const langModuleMap = new Map<string, unknown>()

// 导入语言文件
const modules = import.meta.glob('./langs/**/*.json', { eager: true })

export const langCodeList: Array<string> = []

// 将导入的语言文件转化为 langModuleMap
Object.entries(modules).forEach(([path, module]) => {
  // 从路径中提取语言代码和文件名，例如 './langs/zh-CN/common.json' -> 'zh-CN', 'common'
  const pathMatch = path.match(/\/langs\/([^/]+)\/([^/]+)\.json$/)
  if (pathMatch) {
    const langCode = pathMatch[1]
    const namespace = pathMatch[2] // 文件名作为命名空间，如 'common'
    // 如果该语言已存在
    if (langModuleMap.has(langCode)) {
      const existingMessages = langModuleMap.get(langCode) as any
      langModuleMap.set(langCode, {
        ...existingMessages,
        [namespace]: (module as any).default,
      })
    }
    else {
      langModuleMap.set(langCode, {
        [namespace]: (module as any).default,
      })
    }

    langCodeList.push(langCode)
  }
})

// 导出 Message
const importMessages = computed(() => {
  const message: I18nOptions['messages'] = {}
  langModuleMap.forEach((value: any, key) => {
    message[key] = value // 直接使用 value，因为现在已经是处理后的对象了
  })
  return message
})

export const langList = computed(() => {
  const list: DropdownOption[] = []
  langModuleMap.forEach((value: any, key) => {
    list.push({
      content: value.common.lang,
      value: key,
    })
  })

  return list
})

export const localeConfigKey = 'laicui-wms-admin-locale'

export const i18n = createI18n({
  legacy: false,
  locale: useLocalStorage(localeConfigKey, 'zh-CN').value || defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: importMessages.value,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
})

export const { t } = i18n.global

export default i18n
