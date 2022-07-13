
const bookshelf = {
  path: 'bookshelves',
  meta: { title: '书架', icon: 'Basic-Configuration', noCache: true },
  // redirect: '/unit-evc/baseDeploy/menuManager',
  alwaysShow: true,
  component: () => import('@/views/plibrary/library/bookshelf/page/index'),
  children: [
    {
      code: 'menuManager',
      path: 'menuManager',
      meta: { title: '菜单管理', noCache: true },
      component: () => import('@/views/IntelligentControl/baseDeploy/page/subpage/menuManager')
    },
    {
      code: 'unit-evcDataInterface',
      path: 'dataInterface',
      meta: { title: '数据接口', noCache: true },
      component: () => import('@/views/IntelligentControl/baseDeploy/page/subpage/dataInterface')
    }
  ]
}

export default bookshelf
