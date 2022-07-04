export default {
  path: 'alarmManagement',
  meta: { title: '告警管理', icon: 'Map', noCache: true },
  component: () => import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement'),
  redirect: '/wlw/basicData/alarmManagement/myAlarmConfig',
  children: [
    {
      path: 'myAlarmConfig',
      meta: { title: '告警配置管理', icon: 'Map', noCache: true },
      component: () =>
        import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement/subpage/myAlarmConfig')
    },
    {
      path: 'myAlarmThresholdManage',
      meta: { title: '告警阈值管理', icon: 'Map', noCache: true },
      component: () =>
        import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement/subpage/myAlarmThresholdManage')
    }
  ]
}
