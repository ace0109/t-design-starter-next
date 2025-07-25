import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import { MessagePlugin } from 'tdesign-vue-next'
import router from '@/router'
import { getPermissionStore, useUserStore } from '@/store'
import { PAGE_NOT_FOUND_ROUTE } from '@/utils/route/constant'
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const permissionStore = getPermissionStore()
  const { whiteListRouters } = permissionStore

  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next()
      return
    }
    try {
      await userStore.getUserInfo()

      const { asyncRoutes } = permissionStore

      if (asyncRoutes && asyncRoutes.length === 0) {
        const routeList = await permissionStore.buildAsyncRoutes()
        routeList.forEach((item: RouteRecordRaw) => {
          router.addRoute(item)
        })

        if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
          // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
          next({ path: to.fullPath, replace: true, query: to.query })
        }
        else {
          const redirect = decodeURIComponent((from.query.redirect || to.path) as string)
          next(to.path === redirect ? { ...to, replace: true } : { path: redirect, query: to.query })
          return
        }
      }
      if (to.name && router.hasRoute(to.name)) {
        next()
      }
      else {
        next(`/`)
      }
    }
    catch (error) {
      MessagePlugin.error(error instanceof Error ? error.message : 'An error occurred')
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
      NProgress.done()
    }
  }
  else {
    /* white list router */
    if (whiteListRouters.includes(to.path)) {
      next()
    }
    else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
    NProgress.done()
  }
})

router.afterEach((to) => {
  if (to.path === '/login') {
    const userStore = useUserStore()
    const permissionStore = getPermissionStore()

    userStore.logout()
    permissionStore.restoreRoutes()
  }
  NProgress.done()
})
