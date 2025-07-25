<script setup lang="ts">
import type { FormInstanceFunctions, FormRules, SubmitContext } from 'tdesign-vue-next'
import type { IUserLoginParams } from '@/api/model/user'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/locales'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const INITIAL_DATA = {
  username: '',
  password: '',
}

const FORM_RULES: FormRules<IUserLoginParams> = {
  username: [{ required: true, message: t('pages.login.required.username'), type: 'error' }],
  password: [{ required: true, message: t('pages.login.required.password'), type: 'error' }],
}

const form = ref<FormInstanceFunctions>()
const formData = ref({ ...INITIAL_DATA })
const showPsw = ref(false)

const router = useRouter()
const route = useRoute()

async function onSubmit(ctx: SubmitContext) {
  if (ctx.validateResult === true) {
    try {
      await userStore.login(formData.value)

      MessagePlugin.success('登录成功')
      const redirect = route.query.redirect as string
      const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard'
      router.push(redirectUrl)
    }
    catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <t-form
    ref="form"
    class="w-400px mt-40px"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="username">
      <t-input v-model="formData.username" size="large" :placeholder="`${t('pages.login.input.username')}`">
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        :placeholder="`${t('pages.login.input.password')}`"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit">
        {{ t('pages.login.signIn') }}
      </t-button>
    </t-form-item>
  </t-form>
</template>
