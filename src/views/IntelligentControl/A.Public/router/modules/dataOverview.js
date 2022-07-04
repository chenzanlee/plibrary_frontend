
const DataView = {
  path: 'dataView',
  meta: { title: '数据视图', icon: 'Basic-Configuration', noCache: true },
  redirect: '/unit-evc/dataView/groupView',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/baseDeploy/page'),
  children: [
    {
      code: 'groupView',
      path: 'groupView',
      meta: { title: '集团视图', noCache: true },
      component: () => import('@/views/IntelligentControl/groupOverview')
    },
    {
      code: 'areaView',
      path: 'areaView',
      meta: { title: '大区视图', noCache: true },
      component: () => import('@/views/IntelligentControl/areaOverview')
    },
    {
      code: 'regionView',
      path: 'regionView',
      meta: { title: '区域视图', noCache: true },
      component: () => import('@/views/IntelligentControl/regionOverview')
    }
  ]
}

export default DataView
