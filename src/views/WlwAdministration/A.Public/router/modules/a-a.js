/* eslint-disable indent */
const businessManagement = [
  {
    path: 'dataManagement',
    meta: { title: '数据服务', icon: 'Basic-Configuration', noCache: true },
    redirect: '/wlw/dataManagement/equipmentOnlineInfo',
    alwaysShow: true,
    component: () => import('@/views/WlwAdministration/A.Public/page/parentView.vue'),
    children: [
      {
        path: 'equipmentOnlineInfo',
        meta: { title: '在线统计', icon: 'Device-Preview', noCache: true },
        component: () => import('@/views/WlwAdministration/equipmentOnlineInfo')
      }
    ]
  }
]

export default businessManagement

