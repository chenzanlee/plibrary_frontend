export default {
  path: 'areaMaintain',
  meta: { title: '场区维护', icon: 'Basic-Configuration', noCache: true },
  redirect: '/wlw/areaMaintain/unitInformation',
  alwaysShow: true,
  component: () => import('@/views/WlwAdministration/A.Public/page/parentView.vue'),
  children: [
    {
      path: 'siteInformationManagement',
      meta: { title: '场区信息', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/siteInformationManagement')
    },
    {
      path: 'unitInformation',
      meta: { title: '单元信息', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/unitInformation')
    },
    {
      path: 'emptyCircleManagement',
      meta: { title: '空圈管理', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement')
    },
    {
      path: '',
      meta: { title: '空圈管理', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement/subpage/index'),
      children: [
        {
          path: 'detail',
          name: 'emptyCircleDetail',
          meta: { title: '空圈管理详情', noCache: true, hidden: true },
          component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement/subpage/addEmptyCircle/subpage/detail')
        }
      ]
    }
  ]
}
