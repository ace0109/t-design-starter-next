import Layout from '@/layouts/index.vue'

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: { 'zh-CN': '个人中心', 'en-US': 'User Center', 'zh-TW': '個人中心' }, icon: 'user-circle' },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: { 'zh-CN': '个人中心', 'en-US': 'User Center', 'zh-TW': '個人中心' } },
      },
    ],
  },
]
