
const logManagement = {
  path: 'logManagement',
  name: 'logManagement',
  meta: { title: '环控日志管理', icon: 'Basic-Configuration', noCache: false },
  redirect: '/unit-evc/logManagement/fieldCommand',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/logManagement/page'),
  children: [
    {
      path: 'fieldCommand',
      name: 'fieldCommand',
      meta: { title: '场区指令日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/fieldCommand')
    },
    {
      path: 'alarmPush',
      name: 'alarmPush',
      meta: { title: '报警推送日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/alarmPush')
    },
    {
      path: 'siteAlarm',
      meta: { title: '场区告警日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/siteAlarm')
    },
    {
      path: 'alarmLogMerge',
      meta: { title: '告警合并日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/alarmLogMerge')
    },
    {
      path: 'parameterChange',
      meta: { title: '参数变更日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/parameterChange')
    },
    {
      path: 'paramReportLog',
      meta: { title: '参数上报日志', noCache: false },
      component: () => import('@/views/IntelligentControl/logManagement/page/subpage/paramReportLog')
    }
  ]

}

export default logManagement
