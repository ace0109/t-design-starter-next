<script setup lang="ts">
import type { NotificationItem } from '@/types/interface'
import { storeToRefs } from 'pinia'

import { useRouter } from 'vue-router'
import { t } from '@/locales'
import { useNotificationStore } from '@/store'

const router = useRouter()
const store = useNotificationStore()
const { msgData, unreadMsg } = storeToRefs(store)

function setRead(type: string, item?: NotificationItem) {
  const changeMsg = msgData.value
  if (type === 'all') {
    changeMsg.forEach((e) => {
      e.status = false
    })
  }
  else {
    changeMsg.forEach((e) => {
      if (e.id === item?.id) {
        e.status = false
      }
    })
  }
  store.setMsgData(changeMsg)
}

function goDetail() {
  router.push('/detail/secondary')
}
</script>

<template>
  <t-popup expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="w-[400px]">
        <div class="relative flex items-center justify-between text-primary font-600 text-[16px] px-[16px] pt-[12px]">
          <p>{{ t('layout.notice.title') }}</p>
          <t-button
            v-if="unreadMsg.length > 0"
            variant="text"
            theme="primary"
            @click="setRead('all')"
          >
            {{ t('layout.notice.clear') }}
          </t-button>
        </div>
        <t-list v-if="unreadMsg.length > 0" class="h-[calc(100%-104px)]" :split="false">
          <t-list-item
            v-for="(item, index) in unreadMsg"
            :key="index"
            class="group overflow-hidden w-full rounded cursor-pointer text-primary transition-colors duration-200 hover:bg-[--td-bg-color-container-hover]"
          >
            <div>
              <p class="mb-2 group-hover:text-[--td-brand-color]">
                {{ item.content }}
              </p>
              <p class="text-secondary">
                {{ item.type }}
              </p>
            </div>
            <p class="absolute right-[--td-comp-margin-xxl] bottom-[--td-comp-margin-l] text-secondary transition-all duration-200 ease group-hover:opacity-0 group-hover:bottom-[-6px]">
              {{ item.date }}
            </p>
            <template #action>
              <t-button size="small" variant="outline" class="opacity-0 absolute bottom-[-6px] group-hover:opacity-100 right-[--td-comp-margin-xxl] group-hover:bottom-[--td-comp-margin-l]" @click="setRead('radio', item)">
                {{ t('layout.notice.setRead') }}
              </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="text-center p-y-8 font-600 text-secondary">
          <img class="w-12" src="https://tdesign.gtimg.com/pro-template/personal/nothing.png" alt="空">
          <p class="mt-2">
            {{ t('layout.notice.empty') }}
          </p>
        </div>
        <div v-if="unreadMsg.length > 0" class="flex items-center justify-center border-t-solid border-[--td-component-stroke] p-[8px]">
          <t-button class="no-underline cursor-pointer text-[--td-text-color-placeholder]" variant="text" theme="default" block @click="goDetail">
            {{
              t('layout.notice.viewAll')
            }}
          </t-button>
        </div>
      </div>
    </template>
    <t-badge :count="unreadMsg.length" :offset="[4, 4]">
      <t-button theme="default" shape="square" variant="text">
        <t-icon name="mail" />
      </t-button>
    </t-badge>
  </t-popup>
</template>
