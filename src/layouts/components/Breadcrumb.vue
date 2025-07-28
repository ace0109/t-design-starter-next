<script setup lang="ts">
import type { RouteMeta } from '@/types/interface'
import { computed } from 'vue'

import { useRoute } from 'vue-router'
import { useLocale } from '@/locales/useLocale'

const { locale } = useLocale()
const route = useRoute()

interface BreadcrumbItem {
  path: string
  to: string
  title: string
}

const crumbs = computed(() => {
  const pathArray = route.path.split('/')
  pathArray.shift()

  const breadcrumbs = pathArray.reduce((breadcrumbArray: BreadcrumbItem[], path, idx) => {
    // 如果路由下有hiddenBreadcrumb或当前遍历到参数则隐藏
    const meta = route.matched[idx]?.meta as RouteMeta
    if (meta?.hiddenBreadcrumb || Object.values(route.params).includes(path)) {
      return breadcrumbArray
    }
    let title = path
    if (meta?.title) {
      if (typeof meta.title === 'string') {
        title = meta.title
      }
      else {
        title = meta.title[locale.value]
      }
    }
    breadcrumbArray.push({
      path,
      to: breadcrumbArray[idx - 1] ? `${breadcrumbArray[idx - 1].to}/${path}` : `/${path}`,
      title,
    })
    return breadcrumbArray
  }, [] as BreadcrumbItem[])
  return breadcrumbs
})
</script>

<template>
  <t-breadcrumb max-item-width="150" class="tdesign-breadcrumb">
    <t-breadcrumbItem v-for="item in crumbs" :key="item.to" :to="item.to">
      {{ item.title }}
    </t-breadcrumbItem>
  </t-breadcrumb>
</template>

<style scoped>
.tdesign-breadcrumb {
  margin-bottom: 24px;
}
</style>
