<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { MessagePlugin } from 'tdesign-vue-next'
import { computed, ref, watchEffect } from 'vue'

import SettingAutoIcon from '@/assets/assets-setting-auto.svg'
import SettingDarkIcon from '@/assets/assets-setting-dark.svg'
import SettingLightIcon from '@/assets/assets-setting-light.svg'
import STYLE_CONFIG from '@/config/style'
import { t } from '@/locales'
import { useSettingStore } from '@/store'

const settingStore = useSettingStore()

const LAYOUT_OPTION = ['side', 'top', 'mix']

const MODE_OPTIONS = [
  { type: 'light', text: t('layout.setting.theme.options.light') },
  { type: 'dark', text: t('layout.setting.theme.options.dark') },
  { type: 'auto', text: t('layout.setting.theme.options.auto') },
]

function initStyleConfig() {
  const styleConfig = STYLE_CONFIG
  for (const key in styleConfig) {
    if (Object.prototype.hasOwnProperty.call(styleConfig, key)) {
      (styleConfig[key as keyof typeof STYLE_CONFIG] as any) = settingStore[key as keyof typeof STYLE_CONFIG]
    }
  }

  return styleConfig
}

const formData = ref({ ...initStyleConfig() })

const showSettingPanel = computed({
  get() {
    return settingStore.showSettingPanel
  },
  set(newVal: boolean) {
    settingStore.updateConfig({
      showSettingPanel: newVal,
    })
  },
})

function handleCopy() {
  const sourceText = JSON.stringify(formData.value, null, 4)
  const { copy } = useClipboard({ source: sourceText })
  copy()
    .then(() => {
      MessagePlugin.closeAll()
      MessagePlugin.success('复制成功')
    })
    .catch(() => {
      MessagePlugin.closeAll()
      MessagePlugin.error('复制失败')
    })
}
function getModeIcon(mode: string) {
  if (mode === 'light') {
    return SettingLightIcon
  }
  if (mode === 'dark') {
    return SettingDarkIcon
  }
  return SettingAutoIcon
}

function handleCloseDrawer() {
  settingStore.updateConfig({
    showSettingPanel: false,
  })
}

function getThumbnailUrl(name: string): string {
  return `https://tdesign.gtimg.com/tdesign-pro/setting/${name}.png`
}

watchEffect(() => {
  if (formData.value.brandTheme)
    settingStore.updateConfig(formData.value)
})
</script>

<template>
  <t-drawer
    v-model:visible="showSettingPanel"
    size="408px"
    :footer="false"
    :header="t('layout.setting.title')"
    :close-btn="true"
    class="setting-drawer-container"
    @close-btn-click="handleCloseDrawer"
  >
    <div class="setting-container">
      <t-form :data="formData" label-align="left">
        <div class="setting-group-title">
          {{ t('layout.setting.theme.mode') }}
        </div>
        <t-radio-group v-model="formData.mode">
          <div v-for="(item, index) in MODE_OPTIONS" :key="index" class="setting-layout-drawer">
            <div>
              <t-radio-button :key="index" :value="item.type">
                <component :is="getModeIcon(item.type)" />
              </t-radio-button>
              <p :style="{ textAlign: 'center', marginTop: '8px' }">
                {{ item.text }}
              </p>
            </div>
          </div>
        </t-radio-group>
        <div class="setting-group-title">
          {{ t('layout.setting.navigationLayout') }}
        </div>
        <t-radio-group v-model="formData.layout">
          <div v-for="(item, index) in LAYOUT_OPTION" :key="index" class="setting-layout-drawer">
            <t-radio-button :key="index" :value="item">
              <t-image :src="getThumbnailUrl(item)" fit="contain" class="w-88px h-48px" />
            </t-radio-button>
          </div>
        </t-radio-group>

        <t-form-item v-show="formData.layout === 'mix'" :label="t('layout.setting.splitMenu')" name="splitMenu">
          <t-switch v-model="formData.splitMenu" />
        </t-form-item>
        <t-form-item v-show="formData.layout === 'mix'" :label="t('layout.setting.fixedSidebar')" name="isSidebarFixed">
          <t-switch v-model="formData.isSidebarFixed" />
        </t-form-item>

        <div class="setting-group-title">
          {{ t('layout.setting.element.title') }}
        </div>
        <t-form-item :label="t('layout.setting.sideMode')" name="sideMode">
          <t-radio-group v-model="formData.sideMode" class="side-mode-radio">
            <t-radio-button key="light" value="light" :label="t('layout.setting.theme.options.light')" />
            <t-radio-button key="dark" value="dark" :label="t('layout.setting.theme.options.dark')" />
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-show="formData.layout === 'side'"
          :label="t('layout.setting.element.showHeader')"
          name="showHeader"
        >
          <t-switch v-model="formData.showHeader" />
        </t-form-item>
        <t-form-item :label="t('layout.setting.element.showBreadcrumb')" name="showBreadcrumb">
          <t-switch v-model="formData.showBreadcrumb" />
        </t-form-item>
        <t-form-item :label="t('layout.setting.element.showFooter')" name="showFooter">
          <t-switch v-model="formData.showFooter" />
        </t-form-item>
        <t-form-item :label="t('layout.setting.element.useTagTabs')" name="isUseTabsRouter">
          <t-switch v-model="formData.isUseTabsRouter" />
        </t-form-item>
        <t-form-item :label="t('layout.setting.element.menuAutoCollapsed')" name="menuAutoCollapsed">
          <t-switch v-model="formData.menuAutoCollapsed" />
        </t-form-item>
      </t-form>
      <div class="setting-info">
        <p>{{ t('layout.setting.tips') }}</p>
        <t-button theme="primary" variant="text" @click="handleCopy">
          {{ t('layout.setting.copy.title') }}
        </t-button>
      </div>
    </div>
  </t-drawer>
</template>

<!-- teleport导致drawer 内 scoped样式问题无法生效 先规避下 -->
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.tdesign-setting {
  z-index: 100;
  position: fixed;
  bottom: 200px;
  right: 0;
  height: 40px;
  width: 40px;
  border-radius: 20px 0 0 20px;
  transition: all 0.3s;

  .t-icon {
    margin-left: 8px;
  }

  .tdesign-setting-text {
    font-size: 12px;
    display: none;
  }

  &:hover {
    width: 96px;

    .tdesign-setting-text {
      display: inline-block;
    }
  }
}

.setting-layout-color-group {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50% !important;
  padding: 6px !important;
  border: 2px solid transparent !important;

  > .t-radio-button__label {
    display: inline-flex;
  }
}

.tdesign-setting-close {
  position: fixed;
  bottom: 200px;
  right: 300px;
}

.setting-group-title {
  font-size: 14px;
  line-height: 22px;
  margin: 32px 0 24px;
  text-align: left;
  font-family: 'PingFang SC', var(--td-font-family);
  font-style: normal;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.setting-link {
  cursor: pointer;
  color: var(--td-brand-color);
  margin-bottom: 8px;
}

.setting-info {
  position: absolute;
  padding: 24px;
  bottom: 0;
  left: 0;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  color: var(--td-text-color-placeholder);
  width: 100%;
  background: var(--td-bg-color-container);
}

.setting-drawer-container {
  .setting-container {
    padding-bottom: 100px;
  }

  .t-radio-group.t-size-m {
    min-height: 32px;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    &.side-mode-radio {
      justify-content: end;
    }
  }

  .t-radio-group.t-size-m .t-radio-button {
    height: auto;
  }

  .setting-layout-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    .t-radio-button {
      display: inline-flex;
      max-height: 78px;
      padding: 8px;
      border-radius: var(--td-radius-default);
      border: 2px solid var(--td-component-border);

      > .t-radio-button__label {
        display: inline-flex;
      }
    }

    .t-is-checked {
      border: 2px solid var(--td-brand-color) !important;
    }

    .t-form__controls-content {
      justify-content: end;
    }
  }

  .t-form__controls-content {
    justify-content: end;
  }
}

.setting-route-theme {
  .t-form__label {
    min-width: 310px !important;
    color: var(--td-text-color-secondary);
  }
}

.setting-color-theme {
  .setting-layout-drawer {
    .t-radio-button {
      height: 32px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
