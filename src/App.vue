<script setup lang="tsx">
import type { DropdownOption } from 'tdesign-vue-next'
import { ref } from 'vue'
import { langList, t } from './locales'
import { useLocale } from './locales/useLocale'

const VITE_API_URL = ref(import.meta.env.VITE_API_URL)

const { changeLocale, getTDesignLocale } = useLocale()

function changeLang(lang: string) {
  changeLocale(lang)
}
</script>

<template>
  <t-config-provider :global-config="getTDesignLocale">
    <div class="flex flex-col items-center justify-center h-screen gap-4">
      <t-dropdown trigger="click">
        <t-button theme="primary">
          切换语言
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item
            v-for="(lang, index) in langList"
            :key="index"
            :value="lang.value"
            @click="(options: DropdownOption) => changeLang(options.value as string)"
          >
            {{ lang.content }}
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-button theme="primary">
        当前语言：{{ t('common.lang') }}
      </t-button>

      <t-input class="w-200px" />

      <p>产品Title: {{ t('common.title') }}</p>

      <div class="bg-blue text-light">
        <p>VITE_API_URL: {{ VITE_API_URL }}</p>
        <p class="text">
          postcss-nesting 语法支持已开启，使用方式请参考
        </p>
      </div>
    </div>
  </t-config-provider>
</template>

<style scoped>

</style>
