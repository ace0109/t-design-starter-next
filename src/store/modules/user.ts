import type { IUserStore } from '../types/user'
import type { IUserLoginParams } from '@/api/model/user'
import type { UserInfo } from '@/types/interface'
import { defineStore } from 'pinia'
import { GetUserInfo, Login } from '@/api/user'
import { usePermissionStore } from '@/store'

const InitUserInfo: UserInfo = {
  username: '',
  realname: '',
}

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    token: '',
    userInfo: { ...InitUserInfo },
  }),
  getters: {

  },
  actions: {
    async login(loginParams: IUserLoginParams) {
      const res = await Login(loginParams)

      this.token = res.data
    },
    async getUserInfo() {
      const res = await GetUserInfo()
      this.userInfo = res.data
    },
    async logout() {
      this.token = ''
      this.userInfo = { ...InitUserInfo }
    },
  },
  persist: {
    key: 'user',
    pick: ['token'],
    afterHydrate: () => {
      const permissionStore = usePermissionStore()
      permissionStore.initRoutes()
    },
  },
})
