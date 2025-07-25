import type { RouteRecordRaw } from 'vue-router'
import type { RouteItem } from '@/api/model/permissionModel'

import { defineStore } from 'pinia'
import { getMenuList } from '@/api/permission'
import router, { homepageRouterList } from '@/router'
import { store } from '@/store'
import { transformObjectToRoute } from '@/utils/route'

export const usePermissionStore = defineStore('permission', {
  state: (): {
    whiteListRouters: string[]
    routers: RouteRecordRaw[]
    removeRoutes: RouteRecordRaw[]
    asyncRoutes: RouteRecordRaw[]
  } => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
    asyncRoutes: [],
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes
      // 在菜单只展示动态路由和首页
      this.routers = [...homepageRouterList, ...accessedRouters]
    },
    async buildAsyncRoutes() {
      try {
        // 发起菜单权限请求 获取菜单列表
        const asyncRoutes: Array<RouteItem> = (await getMenuList()).list
        this.asyncRoutes = transformObjectToRoute<RouteRecordRaw>(asyncRoutes)
        await this.initRoutes()
        return this.asyncRoutes
      }
      catch (error) {
        throw new Error(`Can't build routes: ${error}`)
      }
    },
    async restoreRoutes() {
      // 不需要在此额外调用initRoutes更新侧边导肮内容，在登录后asyncRoutes为空会调用
      this.asyncRoutes.forEach((item: RouteRecordRaw) => {
        if (item.name) {
          router.removeRoute(item.name)
        }
      })
      this.asyncRoutes = []
    },
  },
})

export function getPermissionStore() {
  return usePermissionStore(store)
}
