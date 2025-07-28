<script setup lang="ts">
import type { PropType } from 'vue'
import type { MenuRoute, ModeType } from '@/types/interface'
import { ChevronDownIcon, PoweroffIcon, SettingIcon, TranslateIcon, UserCircleIcon } from 'tdesign-icons-vue-next'
import { computed } from 'vue'

import { useRouter } from 'vue-router'
import LogoFull from '@/assets/assets-logo-full.svg?component'
import { langList, t } from '@/locales'
import { useLocale } from '@/locales/useLocale'
import { getActive } from '@/router'
import { useSettingStore, useUserStore } from '@/store'

import MenuContent from './MenuContent.vue'
import Notice from './Notice.vue'
import Search from './Search.vue'

const { theme, layout, showLogo, menu, isFixed, isCompact } = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
  layout: {
    type: String,
    default: 'top',
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
  menu: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
  maxLevel: {
    type: Number,
    default: 3,
  },
})

const router = useRouter()
const settingStore = useSettingStore()
const user = useUserStore()

function toggleSettingPanel() {
  settingStore.updateConfig({
    showSettingPanel: true,
  })
}

const active = computed(() => getActive())

const layoutCls = computed(() => [`tdesign-starter-header-layout`])

const menuCls = computed(() => {
  return [
    {
      [`tdesign-starter-header-menu`]: !isFixed,
      'tdesign-starter-header-menu-fixed': isFixed,
      'tdesign-starter-header-menu-fixed-side': layout === 'side' && isFixed,
      'tdesign-starter-header-menu-fixed-side-compact': layout === 'side' && isFixed && isCompact,
    },
  ]
})
const menuTheme = computed(() => theme as ModeType)

// 切换语言
const { changeLocale } = useLocale()
function changeLang(lang: string) {
  changeLocale(lang)
}

function changeCollapsed() {
  settingStore.updateConfig({
    isSidebarCompact: !settingStore.isSidebarCompact,
  })
}

function handleNav(url: string) {
  router.push(url)
}

function handleLogout() {
  router.push({
    path: '/login',
    query: { redirect: encodeURIComponent(router.currentRoute.value.fullPath) },
  })
}

function navToGitHub() {
  window.open('https://github.com/tencent/tdesign-vue-next-starter')
}

function navToHelper() {
  window.open('http://tdesign.tencent.com/starter/docs/get-started')
}
</script>

<template>
  <div :class="layoutCls">
    <t-head-menu :class="menuCls" :theme="menuTheme" expand-type="popup" :value="active" class="!fixed top-0 z-1001">
      <template #logo>
        <span
          v-if="showLogo"
          class="header-logo-container inline-flex cursor-pointer"
          @click="handleNav('/dashboard/index')"
        >
          <LogoFull class="t-logo h-full w-full" />
        </span>
        <div v-else class="header-operate-left flex items-center leading-0">
          <t-button theme="default" shape="square" variant="text" @click="changeCollapsed">
            <t-icon class="collapsed-icon" name="view-list" />
          </t-button>
          <search :layout="layout" />
        </div>
      </template>
      <template v-if="layout !== 'side'" #default>
        <MenuContent class="header-menu" :nav-data="menu" />
      </template>
      <template #operations>
        <div class="operations-container flex items-center">
          <!-- 搜索框 -->
          <search v-if="layout !== 'side'" :layout="layout" />

          <!-- 全局通知 -->
          <Notice />

          <t-tooltip placement="bottom" :content="t('layout.header.code')">
            <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
              <t-icon name="logo-github" />
            </t-button>
          </t-tooltip>
          <t-tooltip placement="bottom" :content="t('layout.header.help')">
            <t-button theme="default" shape="square" variant="text" @click="navToHelper">
              <t-icon name="help-circle" />
            </t-button>
          </t-tooltip>
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
          <t-dropdown :min-column-width="120" trigger="click">
            <template #dropdown>
              <t-dropdown-item
                class="operations-dropdown-container-item w-full flex items-center"
                @click="handleNav('/user/index')"
              >
                <UserCircleIcon />{{ t('layout.header.user') }}
              </t-dropdown-item>
              <t-dropdown-item
                class="operations-dropdown-container-item w-full flex items-center"
                @click="handleLogout"
              >
                <PoweroffIcon />{{ t('layout.header.signOut') }}
              </t-dropdown-item>
            </template>
            <t-button class="header-user-btn" theme="default" variant="text">
              <template #icon>
                <t-icon class="header-user-avatar" name="user-circle" />
              </template>
              <div class="header-user-account inline-flex items-center text-[var(--td-text-color-primary)]">
                {{ user.userInfo.username }}
              </div>
              <template #suffix>
                <ChevronDownIcon />
              </template>
            </t-button>
          </t-dropdown>
          <t-tooltip placement="bottom" :content="t('layout.header.setting')">
            <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
              <SettingIcon />
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-head-menu>
  </div>
</template>

<style scoped>
.tdesign-starter-header-menu-fixed {
  :deep(.t-head-menu__inner) {
    padding-right: var(--td-comp-margin-xl);
  }
}
.tdesign-starter-header-menu-fixed-side {
  left: 232px;
  right: 0;
  z-index: 10;
  width: auto;
  transition: all 0.3s;
}
.tdesign-starter-header-menu-fixed-side-compact {
  left: 64px;
}
.header-menu {
  flex: 1 1 auto;
  display: inline-flex;
}
.header-menu {
  :deep(.t-menu__item) {
    min-width: unset;
  }
}
.operations-container {
  .t-popup__reference {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.operations-container {
  .t-button {
    margin-left: var(--td-comp-margin-l);
  }
}
.header-logo-container {
  width: 184px;
  height: 26px;
  display: flex;
  margin-left: 24px;
  color: var(--td-text-color-primary);
}
.header-logo-container {
  .t-logo:hover {
    cursor: pointer;
  }
}
.header-logo-container:hover {
  cursor: pointer;
}
:deep(.t-head-menu__inner) {
  border-bottom: 1px solid var(--td-component-stroke);
}
.t-menu--light {
  .header-user-account {
    color: var(--td-text-color-primary);
  }
}
.t-menu--dark {
  .t-head-menu__inner {
    border-bottom: 1px solid var(--td-gray-color-10);
  }
}
.t-menu--dark {
  .header-user-account {
    color: rgba(255, 255, 255, 0.55);
  }
}
.operations-dropdown-container-item {
  :deep(.t-dropdown__item-text) {
    display: flex;
    align-items: center;
  }
}
.operations-dropdown-container-item {
  .t-icon {
    font-size: var(--td-comp-size-xxxs);
    margin-right: var(--td-comp-margin-s);
  }
}
.operations-dropdown-container-item {
  :deep(.t-dropdown__item) {
    width: 100%;
    margin-bottom: 0;
  }
}
.operations-dropdown-container-item:last-child {
  :deep(.t-dropdown__item) {
    margin-bottom: 8px;
  }
}
</style>
