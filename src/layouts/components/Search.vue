<script setup lang="ts">
import { ref } from 'vue'

import { t } from '@/locales'

defineProps({
  layout: {
    type: String,
    default: '',
  },
})

const isSearchFocus = ref(false)
const searchData = ref('')
function changeSearchFocus(value: boolean) {
  if (!value) {
    searchData.value = ''
  }
  isSearchFocus.value = value
}
</script>

<template>
  <div v-if="layout === 'side'" class="header-menu-search">
    <t-input
      class="header-search"
      :class="[{ 'hover-active': isSearchFocus }]"
      :placeholder="t('layout.searchPlaceholder')"
      @blur="changeSearchFocus(false)"
      @focus="changeSearchFocus(true)"
    >
      <template #prefix-icon>
        <t-icon class="icon" name="search" size="16" />
      </template>
    </t-input>
  </div>

  <div v-else class="header-menu-search-left">
    <t-button
      :class="{ 'search-icon-hide': isSearchFocus }"
      theme="default"
      shape="square"
      variant="text"
      @click="changeSearchFocus(true)"
    >
      <t-icon name="search" />
    </t-button>
    <t-input
      v-model="searchData"
      class="header-search"
      :class="[{ 'width-zero': !isSearchFocus }]"
      :placeholder="t('layout.searchPlaceholder')"
      :autofocus="isSearchFocus"
      @blur="changeSearchFocus(false)"
    >
      <template #prefix-icon>
        <t-icon name="search" size="16" />
      </template>
    </t-input>
  </div>
</template>

<style scoped>
.header-menu-search {
  display: flex;
  margin-left: 16px;

  .hover-active {
    background: var(--td-bg-color-secondarycontainer);
  }

  .t-icon {
    color: var(--td-text-color-primary) !important;
  }

  .header-search {
    :deep(.t-input) {
      border: none;
      outline: none;
      box-shadow: none;
      transition: all var(--anim-duration-base) linear;

      .t-input__inner {
        transition: all var(--anim-duration-base) linear;
        all: none;
      }
    }
  }
}

.t-button {
  margin: 0 8px;
  transition: opacity var(--anim-duration-base) var(--anim-time-fn-easing);

  .t-icon {
    font-size: 20px;

    &.general {
      margin-right: 16px;
    }
  }
}

.search-icon-hide {
  opacity: 0;
}

.header-menu-search-left {
  display: flex;
  align-items: center;

  .header-search {
    width: 200px;
    transition: width var(--anim-duration-base) var(--anim-time-fn-easing);

    :deep(.t-input) {
      border: 0;

      &:focus {
        box-shadow: none;
      }
    }

    &.width-zero {
      width: 0;
      opacity: 0;
    }
  }
}
</style>
