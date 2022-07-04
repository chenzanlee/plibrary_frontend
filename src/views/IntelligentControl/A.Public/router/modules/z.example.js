const example = {
  path: 'example',
  meta: { title: '组件示例', icon: 'Information-Maintenance', noCache: true },
  redirect: '/unit-evc/example/from',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/example/page'),
  children: [
    {
      path: 'form',
      meta: { title: '表单组件', noCache: true },
      component: () => import('@/views/IntelligentControl/example/page/subpage/form')
    },
    {
      path: 'echartsView',
      meta: { title: '存栏量', noCache: true },
      component: () => import('@/views/IntelligentControl/example/page/echartsView')
    },
    {
      path: 'overview-box',
      meta: { title: '设备概览box', noCache: true },
      component: () => import('@/views/IntelligentControl/example/page/subpage/overviewBox')
    }
  ]
}

export default example
