import { DashboardIcon } from 'tdesign-icons-vue-next'
import { shallowRef } from 'vue'

import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'dashboard',
    meta: {
      title: {
        'zh-CN': '仪表盘',
        'en-US': 'Dashboard',
        'zh-TW': '儀表盤',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: {
          title: {
            'zh-CN': '概览仪表盘',
            'en-US': 'Overview',
            'zh-TW': '概覽儀表盤',
          },
        },
      },
    ],
  },
]
