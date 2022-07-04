/* eslint-disable indent */
const basicData =
{
  path: 'basicData',
  meta: { title: '产品接入', icon: 'Basic-Configuration', noCache: true },
  redirect: '/wlw/basicData/manufacturer',
  alwaysShow: true,
  component: () => import('@/views/WlwAdministration/basicData/page'),
  children: [
    {
      path: 'equipmentOnlineCondition',
      meta: { title: '设备管理', icon: 'Device-Preview', noCache: true },
      component: () => import('@/views/WlwAdministration/equipmentOnlineCondition')
    },
    {
      path: 'manufacturer',
      meta: { title: '厂商管理', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/manufacturer')
    },
    {
      path: 'eventType',
      meta: { title: '事件类型', icon: 'Map', noCache: true, hidden: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/eventType')
    },
    {
      path: 'equipmentType',
      meta: { title: '设备类型', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/equipmentType')
    },
    {
      path: 'equipmentModel',
      meta: { title: '设备型号', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/equipmentModel')
    },
    {
      path: 'equipmentFaultCode',
      meta: { title: '故障定义', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/equipmentFaultCode')
    },
    {
      path: 'dataManagement',
      meta: { title: '数据管理', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/dataManagement')
    },
    {
      path: 'eventManagement',
      meta: { title: '事件管理', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/eventManagement')
    },
    // {
    //   path: 'deviceFirmware',
    //   meta: { title: '固件管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/deviceFirmware')
    // },
    {
      path: 'controlInstruction',
      meta: { title: '指令定义', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/controlInstruction')
    },
    // {
    //   path: 'unitInformation',
    //   meta: { title: '单元信息管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/unitInformation')
    // },
    // {
    //   path: 'firmwareDistribution',
    //   meta: { title: '固件分布', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/firmwareDistribution')
    // },
    // {
    //   path: 'emptyCircleManagement',
    //   meta: { title: '空圈管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement')
    // },
    // {
    //   path: '',
    //   meta: { title: '空圈管理', noCache: true },
    //   redirect: '',
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement/subpage/index'),
    //   children: [
    //     {
    //       path: 'emptyCircleManagement/detail',
    //       name: 'emptyCircleDetail',
    //       meta: { title: '空圈管理详情', noCache: true, hidden: true },
    //       component: () => import('@/views/WlwAdministration/basicData/page/subpage/emptyCircleManagement/subpage/addEmptyCircle/subpage/detail')
    //     }
    //   ]
    // },
    {
      path: 'plcManagement',
      meta: { title: 'PLC管理', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/plcManagement')
    }
    // {
    //   path: 'operatingInstructions',
    //   meta: { title: '操作说明管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/operatingInstructions')
    // },
    // {
    //   path: 'alarmManagement',
    //   meta: { title: '告警管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement'),
    //   redirect: '/wlw/basicData/alarmManagement/myAlarmConfig',
    //   children: [
    //     {
    //       path: 'myAlarmConfig',
    //       meta: { title: '告警配置管理', icon: 'Map', noCache: true },
    //       component: () =>
    //         import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement/subpage/myAlarmConfig')
    //     },
    //     {
    //       path: 'myAlarmThresholdManage',
    //       meta: { title: '告警阈值管理', icon: 'Map', noCache: true },
    //       component: () =>
    //         import('@/views/WlwAdministration/basicData/page/subpage/alarmManagement/subpage/myAlarmThresholdManage')
    //     }
    //   ]
    // }
    // {
    //   path: 'siteInformationManagement',
    //   meta: { title: '场区信息管理', icon: 'Map', noCache: true },
    //   component: () => import('@/views/WlwAdministration/basicData/page/subpage/siteInformationManagement')
    // }
  ]

}

export default basicData
