import type { DefineComponent, defineComponent } from 'vue'

import type { RouteMeta } from '@/types/interface'

export interface MenuListResult {
  list: Array<RouteItem>
}

export type Component<T = any>
  = | ReturnType<typeof defineComponent>
    | (() => Promise<DefineComponent<object, object, any>>)
    | (() => Promise<T>)

export interface RouteItem {
  path: string
  name: string
  component?: Component | string
  components?: Component
  redirect?: string
  meta: RouteMeta
  children?: Array<RouteItem>
}
