<script setup lang="ts">
import type { ComputedRef } from 'vue'
import isBoolean from 'lodash/isBoolean'
import isUndefined from 'lodash/isUndefined'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import FramePage from '@/layouts/frame/index.vue'
import { useTabsRouterStore } from '@/store'

// <suspense>标签属于实验性功能，请谨慎使用
// 如果存在需解决/page/1=> /page/2 刷新数据问题 请修改代码 使用activeRouteFullPath 作为key
// <suspense>
//  <component :is="Component" :key="activeRouteFullPath" />
// </suspense>

// import { useRouter } from 'vue-router';
// const activeRouteFullPath = computed(() => {
//   const router = useRouter();
//   return router.currentRoute.value.fullPath;
// });

const aliveViews = computed(() => {
  const tabsRouterStore = useTabsRouterStore()
  const { tabRouters } = tabsRouterStore
  return tabRouters
    .filter((route) => {
      const keepAliveConfig = route.meta?.keepAlive
      const isRouteKeepAlive = isUndefined(keepAliveConfig) || (isBoolean(keepAliveConfig) && keepAliveConfig) // 默认开启keepalive
      return route.isAlive && isRouteKeepAlive
    })
    .map(route => route.name)
}) as ComputedRef<string[]>

const isRefreshing = computed(() => {
  const tabsRouterStore = useTabsRouterStore()
  const { refreshing } = tabsRouterStore
  return refreshing
})

const route = useRoute() // 这个不能放到computed中，切换页面时会导致被缓存
const isFramePage = computed(() => {
  return !!route.meta?.frameSrc
})
</script>

<template>
  <div v-if="!isRefreshing" class="h-full">
    <router-view v-if="!isFramePage" v-slot="{ Component }">
      <transition name="fade" mode="out-in" class="h-full fade-leave-active:transition-opacity fade-enter-active:transition-opacity fade-leave-active:ease-in-out fade-enter-active:ease-in-out fade-leave-active:duration-300 fade-enter-active:duration-300 fade-enter-from:opacity-0 fade-leave-to:opacity-0">
        <keep-alive :include="aliveViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <FramePage v-else />
  </div>

  <t-loading v-else />
</template>

<style scoped>
</style>
