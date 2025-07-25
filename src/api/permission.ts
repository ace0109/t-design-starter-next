// const Api = {
//   MenuList: '/get-menu-list',
// }

export function getMenuList() {
  return {
    list: [
      {
        path: '/system',
        name: 'system',
        component: 'LAYOUT',
        redirect: '/system/user',
        meta: {
          title: {
            'zh-CN': '系统管理',
            'en-US': 'System Management',
          },
          icon: 'view-list',
        },
        children: [
          {
            path: 'user',
            name: 'SystemUser',
            component: '/system/user/index',
            meta: {
              title: {
                'zh-CN': '用户管理',
                'en-US': 'User Management',
              },
            },
          },
        ],
      },
    ],
  }
}
