/* eslint-disable indent */
const businessManagement = [
  {
    path: 'businessManagement',
    meta: { title: '数据服务', icon: 'Basic-Configuration', noCache: true },
    redirect: '/wlw/businessManagement/permissionRangeConfiguration',
    alwaysShow: true,
    component: () => import('@/views/WlwAdministration/businessManagement/page'),
    children: [
      {
        path: 'permissionRangeConfiguration',
        meta: { title: '在线统计', icon: 'Map', noCache: true },
        component: () => import('@/views/WlwAdministration/businessManagement/page/subpage/permissionRangeConfiguration')
      }
    ]
  }
]

export default businessManagement

