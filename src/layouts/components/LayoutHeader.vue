<script setup lang="ts">
import type { MenuRoute } from '@/types/interface'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { usePermissionStore, useSettingStore } from '@/store'

import LHeader from './Header.vue'

const permissionStore = usePermissionStore()
const settingStore = useSettingStore()
const { routers: menuRouters } = storeToRefs(permissionStore)
const headerMenu = computed(() => {
  if (settingStore.layout === 'mix') {
    if (settingStore.splitMenu) {
      return menuRouters.value.map(menu => ({
        ...menu,
        children: [],
      })) as MenuRoute[]
    }
    return []
  }
  return menuRouters.value as MenuRoute[]
})
</script>

<template>
  <LHeader
    v-if="settingStore.showHeader"
    :show-logo="settingStore.showHeaderLogo"
    :theme="settingStore.displayMode"
    :layout="settingStore.layout"
    :is-fixed="settingStore.isHeaderFixed"
    :menu="headerMenu"
    :is-compact="settingStore.isSidebarCompact"
  />
</template>
