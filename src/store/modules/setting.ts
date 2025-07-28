import type { ModeType } from '@/types/interface'
import keys from 'lodash/keys'

import { defineStore } from 'pinia'
import STYLE_CONFIG from '@/config/style'
import { store } from '@/store'

const state: Record<string, any> = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
}

export type TState = typeof state
export type TStateKey = keyof typeof state

export const useSettingStore = defineStore('setting', {
  state: () => state,
  getters: {
    showSidebar: state => state.layout !== 'top',
    showSidebarLogo: state => state.layout === 'side',
    showHeaderLogo: state => state.layout !== 'side',
    displayMode: (state): ModeType => {
      if (state.mode === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme:dark)')
        if (media.matches) {
          return 'dark'
        }
        return 'light'
      }
      return state.mode as ModeType
    },
    displaySideMode: (state): ModeType => {
      return state.sideMode as ModeType
    },
  },
  actions: {
    async changeMode(mode: ModeType | 'auto') {
      let theme = mode

      if (mode === 'auto') {
        theme = this.getMediaColor()
      }
      const isDarkMode = theme === 'dark'

      document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '')
    },
    async changeSideMode(mode: ModeType) {
      const isDarkMode = mode === 'dark'

      document.documentElement.setAttribute('side-mode', isDarkMode ? 'dark' : '')
    },
    getMediaColor() {
      const media = window.matchMedia('(prefers-color-scheme:dark)')

      if (media.matches) {
        return 'dark'
      }
      return 'light'
    },
    updateConfig(payload: Partial<TState>) {
      for (const key in payload) {
        if (payload[key as TStateKey] !== undefined) {
          this[key as TStateKey] = payload[key as TStateKey]
        }
        if (key === 'mode') {
          this.changeMode(payload[key] as ModeType)
        }
        if (key === 'sideMode') {
          this.changeSideMode(payload[key] as ModeType)
        }
      }
    },
  },
  persist: {
    pick: [...keys(STYLE_CONFIG)],
  },
})

export function getSettingStore() {
  return useSettingStore(store)
}
