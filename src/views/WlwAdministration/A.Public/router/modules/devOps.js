export default {
  path: 'devOps',
  meta: { title: '固件管理', icon: 'Basic-Configuration', noCache: true },
  redirect: '/wlw/devOps/deviceFirmware',
  alwaysShow: true,
  component: () => import('@/views/WlwAdministration/A.Public/page/parentView.vue'),
  children: [
    {
      path: 'deviceFirmware',
      meta: { title: '固件升级', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/deviceFirmware')
    },
    {
      path: 'deviceFirmware/detail',
      name: 'deviceFirmwareDetail',
      meta: { title: '设备固件管理详情', noCache: true, hidden: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/deviceFirmware/detail')
    },
    {
      path: 'firmwareDistribution',
      meta: { title: '固件分布', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/firmwareDistribution')
    }
  ]
}
