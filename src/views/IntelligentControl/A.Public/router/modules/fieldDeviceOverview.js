const fieldDeviceOverview = [
  {
    path: 'fieldDeviceOverview',
    name: 'fieldDeviceOverview',
    meta: { title: '场区设备概览', icon: 'Device-Preview', noCache: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page')
  },
  {
    path: 'fieldDeviceOverview/detail',
    name: 'intelligentControlOverview',
    meta: { title: '场区设备概览', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page/subpage/detail')
  },
  {
    path: 'fieldDeviceOverview/multiUnitSetting',
    name: 'intelligentControlOverviewMultiUnitSetting',
    meta: { title: '多单元参数设置', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page/multiUnitSetting')
  },
  {
    path: 'fieldDeviceOverview/detail/v3',
    name: 'intelligentControlOverviewV3',
    meta: { title: '场区设备概览', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page/subpageV3/detail')
  },
  {
    path: 'fieldDeviceOverview/detail/v4',
    name: 'intelligentControlOverviewV4',
    meta: { title: '场区设备概览', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page/subpageV4/detail')
  },
  {
    path: 'fieldDeviceOverview/orderHistory',
    name: 'orderHistory',
    meta: { title: '指令下发历史记录', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/fieldDeviceOverview/page/subpage/orderHistory')
  }
]

export default fieldDeviceOverview
