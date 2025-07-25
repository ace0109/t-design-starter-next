<script setup lang="tsx">
import type { DropdownOption } from 'tdesign-vue-next'
import { ref } from 'vue'
import { langList, t } from '@/locales'
import { useLocale } from '@/locales/useLocale'
import { usePermissionStore } from '@/store'

const VITE_API_URL = ref(import.meta.env.VITE_API_URL)

const { changeLocale } = useLocale()

function changeLang(lang: string) {
  changeLocale(lang)
}

const { routers, asyncRoutes } = usePermissionStore()
</script>

<template>
  <div class="hello flex flex-col items-center justify-center h-screen gap-4">
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

    <div>{{ routers }}</div>
    <div>{{ asyncRoutes }}</div>
  </div>
</template>

<style scoped>
</style>
