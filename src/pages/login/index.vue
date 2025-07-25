<script setup lang="ts">
import TdesignSetting from '@/layouts/setting.vue'
import { t } from '@/locales'

import LoginHeader from './components/Header.vue'
import Login from './components/Login.vue'

defineOptions({
  name: 'LoginIndex',
})
</script>

<template>
  <div class="h-screen flex flex-col bg-cover position-relative bg-[100%] bg-[url('https://wms-static-1312851603.cos.ap-shanghai.myqcloud.com/wms-admin/assets-login-bg-white.png')] dark:bg-[url('https://wms-static-1312851603.cos.ap-shanghai.myqcloud.com/wms-admin/assets-login-bg-black.png')] bg-page-color">
    <LoginHeader />

    <div class="position-absolute top-[22%] left-[12%] max-h-500px">
      <div>
        <h1 class="text-primary font-600 text-36px">
          {{ t('pages.login.loginTitle') }}
        </h1>
        <h1 class="text-primary font-600 text-36px mt-4px">
          TDesign Starter
        </h1>
      </div>

      <Login />
      <TdesignSetting />
    </div>

    <footer class="text-secondary text-14px lh-22px position-absolute bottom-64px left-[5%]">
      Copyright @ 2021-2025 Tencent. All Rights Reserved
    </footer>
  </div>
</template>
