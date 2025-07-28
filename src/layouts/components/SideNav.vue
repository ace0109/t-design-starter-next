<script setup lang="ts">
import type { MenuValue } from 'tdesign-vue-next'
import type { PropType } from 'vue'
import type { MenuRoute, ModeType } from '@/types/interface'
import { difference, remove, union } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'

import { useRouter } from 'vue-router'
import AssetLogoFull from '@/assets/assets-logo-full.svg?component'
import AssetLogo from '@/assets/assets-t-logo.svg?component'
import { getActive } from '@/router'
import { useSettingStore } from '@/store'

import pgk from '../../../package.json'
import MenuContent from './MenuContent.vue'

const { menu, showLogo, isFixed, layout, theme, isCompact } = defineProps({
  menu: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
  showLogo: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  isFixed: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  layout: {
    type: String as PropType<string>,
    default: '',
  },
  headerHeight: {
    type: String as PropType<string>,
    default: '64px',
  },
  theme: {
    type: String as PropType<ModeType>,
    default: 'light',
  },
  isCompact: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const MIN_POINT = 992 - 1

const collapsed = computed(() => useSettingStore().isSidebarCompact)
const menuAutoCollapsed = computed(() => useSettingStore().menuAutoCollapsed)

const active = computed(() => getActive())

const expanded = ref<MenuValue[]>([])

watch(
  () => active.value,
  () => {
    const path = getActive()
    const parentPath = path.substring(0, path.lastIndexOf('/'))
    expanded.value = menuAutoCollapsed.value ? [parentPath] : union([parentPath], expanded.value)
  },
)

function onExpanded(value: MenuValue[]) {
  const currentOperationMenu = difference(expanded.value, value)
  const allExpanded = union(value, expanded.value)
  remove(allExpanded, item => currentOperationMenu.includes(item))
  expanded.value = allExpanded
}

const sideMode = computed(() => {
  return theme === 'dark'
})
const sideNavCls = computed(() => {
  return [
    {
      'w-64px': isCompact,
    },
  ]
})

const menuCls = computed(() => {
  return [
    {
      'z-1': !showLogo,
      'relative': !isFixed,
      'fixed': isFixed,
      'top-56px': layout === 'mix' && isFixed,
    },
  ]
})

const router = useRouter()
const settingStore = useSettingStore()

function autoCollapsed() {
  const isCompact = window.innerWidth <= MIN_POINT
  settingStore.updateConfig({
    isSidebarCompact: isCompact,
  })
}

onMounted(() => {
  const path = getActive()
  const parentPath = path.substring(0, path.lastIndexOf('/'))
  expanded.value = union([parentPath], expanded.value)
  autoCollapsed()
  window.onresize = () => {
    autoCollapsed()
  }
})

function goHome() {
  router.push('/dashboard/index')
}

function getLogo() {
  if (collapsed.value)
    return AssetLogo
  return AssetLogoFull
}
</script>

<template>
  <div :class="sideNavCls" class="h-full flex flex-col">
    <t-menu
      :class="menuCls"
      class="!h-[calc(100vh_-_56px)]"
      :theme="theme"
      :value="active"
      :collapsed="collapsed"
      :expanded="expanded"
      :expand-mutex="menuAutoCollapsed"
      @expand="onExpanded"
    >
      <template #logo>
        <span
          v-if="showLogo"
          class="w-full flex items-center justify-center"
          @click="goHome"
        >
          <component :is="getLogo()" class="dark:text-white" />
        </span>
      </template>
      <MenuContent :nav-data="menu" />
      <template #operations>
        <span class="text-secondary" :class="{ '!text-[--td-font-white-2]': sideMode }"> {{ !collapsed ? 'TDesign Starter' : '' }} {{ pgk.version }} </span>
      </template>
    </t-menu>
    <div class="min-w-232px transition-all-300" :class="{ hidden: collapsed }" />
  </div>
</template>

<style scoped></style>
