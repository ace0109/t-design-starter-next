<script setup lang="ts">
import { TranslateIcon } from 'tdesign-icons-vue-next'
import { ref } from 'vue'
import LogoFullIcon from '@/assets/assets-logo-full.svg?component'
import { langList } from '@/locales'
import { useLocale } from '@/locales/useLocale'
import { useSettingStore } from '@/store'

const settingStore = useSettingStore()
function toggleSettingPanel() {
  settingStore.updateConfig({
    showSettingPanel: true,
  })
}

function navToGitHub() {
  window.open('https://github.com/tencent/tdesign-vue-next-starter')
}

function navToHelper() {
  window.open('http://tdesign.tencent.com/starter/docs/get-started')
}

// 切换语言
const { changeLocale } = useLocale()
function changeLang(lang: string) {
  changeLocale(lang)
}

const showSetting = ref(import.meta.env.MODE === 'development')
</script>

<template>
  <header class="flex justify-between items-center backdrop-blur-10px h-56px text-primary px-24px">
    <LogoFullIcon class="w-178px h-40px" />
    <div class="flex items-center gap-16px">
      <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
        <t-icon name="logo-github" class="icon" />
      </t-button>
      <t-button theme="default" shape="square" variant="text" @click="navToHelper">
        <t-icon name="help-circle" class="icon" />
      </t-button>
      <t-dropdown trigger="click">
        <t-button theme="default" shape="square" variant="text">
          <TranslateIcon />
        </t-button>
        <template #dropdown>
          <t-dropdown-item
            v-for="(lang, index) in langList"
            :key="index"
            :value="lang.value"
            @click="(options) => changeLang(options.value as string)"
          >
            {{ lang.content }}
          </t-dropdown-item>
        </template>
      </t-dropdown>
      <t-button v-if="showSetting" theme="default" shape="square" variant="text" @click="toggleSettingPanel">
        <t-icon name="setting" class="icon" />
      </t-button>
    </div>
  </header>
</template>
