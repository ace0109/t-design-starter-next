<script setup lang="tsx">
import { computed } from 'vue'
import { useLocale } from './locales/useLocale'
import { useSettingStore } from './store'

const { getTDesignLocale, locale } = useLocale()

const store = useSettingStore()

const mode = computed(() => {
  return store.displayMode
})
</script>

<template>
  <t-config-provider :global-config="getTDesignLocale">
    <router-view :key="locale" :class="[mode]" />
  </t-config-provider>
</template>

<style scoped>

</style>
