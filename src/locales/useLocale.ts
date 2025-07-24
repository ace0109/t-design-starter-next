import { useLocalStorage } from '@vueuse/core'
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import twConfig from 'tdesign-vue-next/es/locale/zh_TW'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { langCodeList, localeConfigKey } from '@/locales/index'

export function useLocale() {
  const { locale } = useI18n({ useScope: 'global' })
  function changeLocale(lang: string) {
    // 如果切换的语言不在对应语言文件里则默认为简体中文
    if (!langCodeList.includes(lang)) {
      lang = 'zh-CN'
    }

    locale.value = lang
    useLocalStorage(localeConfigKey, 'zh-CN').value = lang
  }

  const TDesignLocaleMap: Record<string, any> = {
    'zh-CN': zhConfig,
    'en-US': enConfig,
    'zh-TW': twConfig,
  }

  const getTDesignLocale = computed(() => {
    return TDesignLocaleMap[locale.value]
  })

  return {
    changeLocale,
    getTDesignLocale,
    locale,
  }
}
