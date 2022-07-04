
const autoDetectionTask = {
  path: 'autoDetectionTask',
  meta: { title: '自动检测任务', icon: 'Basic-Configuration', noCache: true },
  redirect: '/unit-evc/autoDetectionTask',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/autoDetectionTask/page'),
  children: [
    {
      path: 'fieldAlarm',
      name: 'fieldAlarm',
      meta: { title: '场区告警自检', noCache: true },
      component: () => import('@/views/IntelligentControl/autoDetectionTask/page/subpage/fieldAlarm/fieldAlarm')
      // children: [
      //   {
      //     path: 'taskManagement',
      //     name: 'taskManagement',
      //     meta: { title: '任务记录', noCache: true },
      //     component: () => import('@/views/IntelligentControl/autoDetectionTask/page/subpage/fieldAlarm/subpage/taskManagement')
      //   }
      // ]
    },
    {
      path: '',
      meta: { title: '场区告警自检', noCache: true },
      redirect: '/unit-evc/autoDetectionTask/fieldAlarm',
      component: () => import('@/views/IntelligentControl/autoDetectionTask/page/subpage/fieldAlarm/index'),
      children: [
        {
          path: 'fieldAlarm/taskManagement',
          name: 'taskManagement',
          meta: { title: '任务记录', noCache: true },
          component: () => import('@/views/IntelligentControl/autoDetectionTask/page/subpage/fieldAlarm/subpage/taskManagement')
        }
      ]
    },
    {
      path: 'airFiltrationTest',
      meta: { title: '空气过滤检测', noCache: true },
      component: () => import('@/views/IntelligentControl/autoDetectionTask/page/subpage/airFiltrationTest')
    }
  ]

}

export default autoDetectionTask

