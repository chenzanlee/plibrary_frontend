
const comfortManager = {
  path: 'comfortManager',
  meta: { title: '现场反馈管理', icon: 'Information-Maintenance', noCache: true },
  redirect: '/unit-evc/comfortManager/comfortReview',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/comfortManager/page'),
  children: [
    {
      path: 'comfortReview',
      meta: { title: '舒适状况审核', noCache: true },
      component: () => import('@/views/IntelligentControl/comfortManager/page/comfortReview')
    }
  ]
}

export default comfortManager
