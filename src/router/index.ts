import type { RouteRecordRaw } from 'vue-router'
import uniq from 'lodash/uniq'
import { createRouter, createWebHistory } from 'vue-router'

// 导入homepage相关固定路由
const homepageModules = import.meta.glob('./modules/**/homepage.ts', { eager: true })

// 导入modules非homepage相关固定路由
const fixedModules = import.meta.glob('./modules/**/!(homepage).ts', { eager: true })

// 其他固定路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard/index',
  },
]
// 存放固定路由
export const homepageRouterList: Array<RouteRecordRaw> = mapModuleRouterList(homepageModules)
export const fixedRouterList: Array<RouteRecordRaw> = mapModuleRouterList(fixedModules)

export const allRoutes = [...homepageRouterList, ...fixedRouterList, ...defaultRouterList]

// 固定路由模块转换为路由
export function mapModuleRouterList(modules: Record<string, unknown>): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = []
  Object.keys(modules).forEach((key) => {
    // @ts-expect-error 外部赋值不太好直接写类型
    const mod = modules[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routerList.push(...modList)
  })
  return routerList
}

/**
 *
 * @deprecated 未使用
 */
export function getRoutesExpanded() {
  const expandedRoutes: Array<string> = []

  fixedRouterList.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path)
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter(child => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path)
          expandedRoutes.push(`${item.path}/${child.path}`)
        })
    }
  })
  return uniq(expandedRoutes)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export function getActive(maxLevel = 3): string {
  // 非组件内调用必须通过Router实例获取当前路由
  const route = router.currentRoute.value

  if (!route.path) {
    return ''
  }

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')
}

export default router
