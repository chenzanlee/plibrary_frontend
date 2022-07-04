const piggeryDeviceOverview = [
  {
    path: 'piggeryDeviceOverview',
    name: 'piggeryDeviceOverview',
    meta: { title: '喷淋设备概览', icon: 'Device-Preview', noCache: true },
    component: () => import('@/views/IntelligentControl/piggeryDeviceOverview/page')
  },
  {
    path: 'piggeryDeviceOverview/detail',
    name: 'piggeryDeviceOverviewDetail',
    meta: { title: '喷淋设备概览', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/piggeryDeviceOverview/page/subpage/piggeryDeviceOverviewDetail')
  }
]

export default piggeryDeviceOverview
