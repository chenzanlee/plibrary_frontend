const regionalAlarmMonitoring = [
  {
    path: 'regionalAlarmMonitoring',
    name: 'regionalAlarmMonitoring',
    meta: { title: '区域告警监控', icon: 'Map', noCache: true },
    component: () => import('@/views/IntelligentControl/regionalAlarmMonitoring/page/index')
  },
  {
    path: 'regionalAlarmMonitoring/detail',
    name: 'regionalAlarmMonitoringDetail',
    meta: { title: '区域告警监控', icon: 'Device-Preview', noCache: true, hidden: true },
    component: () => import('@/views/IntelligentControl/regionalAlarmMonitoring/page/subpage/detail')
  }
]

export default regionalAlarmMonitoring
