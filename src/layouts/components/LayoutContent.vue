<script setup lang="ts">
import type { PopupVisibleChangeContext } from 'tdesign-vue-next'
import type { TRouterInfo, TTabRemoveOptions } from '@/types/interface'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/locales'
import { useLocale } from '@/locales/useLocale'

import { useSettingStore, useTabsRouterStore } from '@/store'
import LBreadcrumb from './Breadcrumb.vue'
import LContent from './Content.vue'
import LFooter from './Footer.vue'

const route = useRoute()
const router = useRouter()

const settingStore = useSettingStore()
const setting = storeToRefs(settingStore)
const tabsRouterStore = useTabsRouterStore()
const tabRouters = computed(() => tabsRouterStore.tabRouters.filter(route => route.isAlive || route.isHome))
const activeTabPath = ref<string | null>(null)

const { locale } = useLocale()

function handleChangeCurrentTab(path: string) {
  const { tabRouters } = tabsRouterStore
  const route = tabRouters.find(i => i.path === path)
  router.push({ path, query: route?.query })
}

function handleRemove(options: TTabRemoveOptions) {
  const { tabRouters } = tabsRouterStore
  const nextRouter = tabRouters[options.index + 1] || tabRouters[options.index - 1]

  tabsRouterStore.subtractCurrentTabRouter({ path: options.value as string, routeIdx: options.index })
  if ((options.value as string) === route.path)
    router.push({ path: nextRouter.path, query: nextRouter.query })
}

function renderTitle(title: string | Record<string, string>) {
  if (typeof title === 'string')
    return title
  return title[locale.value]
}
function handleRefresh(route: TRouterInfo, routeIdx: number) {
  tabsRouterStore.toggleTabRouterAlive(routeIdx)
  nextTick(() => {
    tabsRouterStore.toggleTabRouterAlive(routeIdx)
    router.replace({ path: route.path, query: route.query })
  })
  activeTabPath.value = null
}
function handleCloseAhead(path: string, routeIdx: number) {
  tabsRouterStore.subtractTabRouterAhead({ path, routeIdx })

  handleOperationEffect('ahead', routeIdx)
}
function handleCloseBehind(path: string, routeIdx: number) {
  tabsRouterStore.subtractTabRouterBehind({ path, routeIdx })

  handleOperationEffect('behind', routeIdx)
}
function handleCloseOther(path: string, routeIdx: number) {
  tabsRouterStore.subtractTabRouterOther({ path, routeIdx })

  handleOperationEffect('other', routeIdx)
}

// 处理非当前路由操作的副作用
function handleOperationEffect(type: 'other' | 'ahead' | 'behind', routeIndex: number) {
  const currentPath = router.currentRoute.value.path
  const { tabRouters } = tabsRouterStore

  const currentIdx = tabRouters.findIndex(i => i.path === currentPath)
  // 存在三种情况需要刷新当前路由
  // 点击非当前路由的关闭其他、点击非当前路由的关闭左侧且当前路由小于触发路由、点击非当前路由的关闭右侧且当前路由大于触发路由
  const needRefreshRouter
    = (type === 'other' && currentIdx !== routeIndex)
      || (type === 'ahead' && currentIdx < routeIndex)
      || (type === 'behind' && currentIdx === -1)
  if (needRefreshRouter) {
    const nextRouteIdx = type === 'behind' ? tabRouters.length - 1 : 1
    const nextRouter = tabRouters[nextRouteIdx]
    router.push({ path: nextRouter.path, query: nextRouter.query })
  }

  activeTabPath.value = null
}
function handleTabMenuClick(visible: boolean, ctx: PopupVisibleChangeContext, path: string) {
  if (ctx.trigger === 'document')
    activeTabPath.value = null
  if (visible)
    activeTabPath.value = path
}

function handleDragend(options: { currentIndex: number, targetIndex: number }) {
  const { tabRouters } = tabsRouterStore;

  [tabRouters[options.currentIndex], tabRouters[options.targetIndex]] = [
    tabRouters[options.targetIndex],
    tabRouters[options.currentIndex],
  ]
}
</script>

<template>
  <t-layout class="tdesign-starter-layout relative h-[calc(100vh_-_var(--td-comp-size-xxxl))]" :class="{ 'flex-1 w-[1%]': setting.layout.value === 'mix' }">
    <t-tabs
      v-if="settingStore.isUseTabsRouter"
      drag-sort
      theme="card"
      class="tdesign-starter-layout-tabs-nav w-full absolute overflow-visible z-1"
      :value="$route.path"
      @change="(value) => handleChangeCurrentTab(value as string)"
      @remove="handleRemove"
      @drag-sort="handleDragend"
    >
      <t-tab-panel
        v-for="(routeItem, index) in tabRouters"
        :key="`${routeItem.path}_${index}`"
        :value="routeItem.path"
        :removable="!routeItem.isHome"
        :draggable="!routeItem.isHome"
      >
        <template #label>
          <t-dropdown
            trigger="context-menu"
            :min-column-width="128"
            :popup-props="{
              overlayClassName: 'route-tabs-dropdown',
              onVisibleChange: (visible: boolean, ctx: PopupVisibleChangeContext) =>
                handleTabMenuClick(visible, ctx, routeItem.path),
              visible: activeTabPath === routeItem.path,
            }"
          >
            <template v-if="!routeItem.isHome">
              {{ renderTitle(routeItem.title!) }}
            </template>
            <t-icon v-else name="home" />
            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item @click="() => handleRefresh(routeItem, index)">
                  <t-icon name="refresh" />
                  {{ t('layout.tagTabs.refresh') }}
                </t-dropdown-item>
                <t-dropdown-item v-if="index > 1" @click="() => handleCloseAhead(routeItem.path, index)">
                  <t-icon name="arrow-left" />
                  {{ t('layout.tagTabs.closeLeft') }}
                </t-dropdown-item>
                <t-dropdown-item
                  v-if="index < tabRouters.length - 1"
                  @click="() => handleCloseBehind(routeItem.path, index)"
                >
                  <t-icon name="arrow-right" />
                  {{ t('layout.tagTabs.closeRight') }}
                </t-dropdown-item>
                <t-dropdown-item v-if="tabRouters.length > 2" @click="() => handleCloseOther(routeItem.path, index)">
                  <t-icon name="close-circle" />
                  {{ t('layout.tagTabs.closeOther') }}
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
          </t-dropdown>
        </template>
      </t-tab-panel>
    </t-tabs>
    <t-content class="tdesign-starter-content-layout h-full overflow-y-scroll p-[16px]" :class="{ 'mt-[48px]': settingStore.isUseTabsRouter }">
      <LBreadcrumb v-if="settingStore.showBreadcrumb" />
      <LContent />
    </t-content>
    <t-footer v-if="settingStore.showFooter" class="tdesign-starter-footer-layout p-0">
      <LFooter />
    </t-footer>
  </t-layout>
</template>
