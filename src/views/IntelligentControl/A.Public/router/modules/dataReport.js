
const dataReport = {
  path: 'dataReport',
  meta: { title: '环控数据报表', icon: 'Information-Maintenance', noCache: true },
  redirect: '/unit-evc/dataReport/onlineCondition',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/dataReport/page'),
  children: [
    {
      path: 'onlineCondition',
      meta: { title: '设备在线情况', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/onlineCondition')
    },
    {
      path: 'comfortableReport',
      meta: { title: '舒适度报表', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/comfortableReport')
    },
    {
      path: 'troubleCondition',
      meta: { title: '设备故障情况', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/troubleCondition')
    },
    {
      path: 'fieldParameter',
      meta: { title: '参数变更统计', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/fieldParameter')
    },
    {
      path: 'fieldUnlock',
      meta: { title: '单元解锁统计', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/fieldUnlock')
    },
    {
      path: 'fieldLock',
      meta: { title: '单元锁定情况', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/fieldLock')
    },
    {
      path: 'humiture',
      meta: { title: '温湿度曲线图', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/humiture')
    },
    {
      path: 'environment',
      meta: { title: '环境对比分析', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/environment')
    },
    {
      path: 'paramsExport',
      meta: { title: '设备参数导出', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/paramsExport')
    },
    {
      path: 'equipment',
      meta: { title: '设备状态导出', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/equipment')
    },
    {
      path: 'warmHumidCondition',
      meta: { title: '温湿探头统计', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/warmHumidCondition')
    },
    {
      path: 'unitDataExport',
      meta: { title: '单元数据导出', icon: 'Map', noCache: true },
      component: () => import('@/views/IntelligentControl/unitDataExport/page/index')
    },
    {
      path: 'emptycircleReport',
      meta: { title: '空圈单元报表', noCache: true },
      component: () => import('@/views/IntelligentControl/dataReport/page/subpage/emptycircleReport')
    }
  ]
}

export default dataReport
