
const baseInfo = {
  path: 'baseInfo',
  meta: { title: '基础信息维护', icon: 'Information-Maintenance', noCache: true },
  redirect: '/unit-evc/baseInfo/fieldWindMachineConfig',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/baseInfo/page'),
  children: [
    {
      path: 'controllerMaintain',
      meta: { title: '设备信息管理', noCache: true },
      redirect: '/unit-evc/baseInfo/controllerMaintain/targetMaintenance/deviceInformation',
      alwaysShow: true,
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/controllerMaintain'),
      children: [
        {
          path: 'deviceInformation',
          meta: { title: '自研/华诚信息维护', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/controllerMaintain/subpage/deviceInformation')
        },
        {
          path: 'piggeryShowerControllerMaintain',
          meta: { title: '猪舍喷淋控制器', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/controllerMaintain/subpage/piggeryShowerControllerMaintain')
        }
      ]
    },
    {
      path: 'informationMaintenanceOfBuildingPigHouseController',
      meta: { title: '楼房猪舍控制器', icon: 'Information-Maintenance', noCache: true },
      redirect: '/unit-evc/baseInfo/informationMaintenanceOfBuildingPigHouseController/mainControllerInformationMaintenance',
      alwaysShow: true,
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/informationMaintenanceOfBuildingPigHouseController'),
      children: [
        {
          path: 'mainControllerInformationMaintenance',
          meta: { title: '环控主控制器', noCache: true },
          alwaysShow: true,
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/informationMaintenanceOfBuildingPigHouseController/subpage/mainControllerInformationMaintenance')
        },
        {
          path: 'fanControllerInformationMaintenance',
          meta: { title: '风机控制器', noCache: true },
          alwaysShow: true,
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/informationMaintenanceOfBuildingPigHouseController/subpage/fanControllerInformationMaintenance')
        },
        {
          path: 'unitControllerInformationMaintenance',
          meta: { title: '单元控制器', noCache: true },
          alwaysShow: true,
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/informationMaintenanceOfBuildingPigHouseController/subpage/unitControllerInformationMaintenance')
        }
      ]
    },
    {
      path: 'alarmManagement',
      meta: { title: '告警推送管理', noCache: true },
      redirect: '/unit-evc/baseInfo/alarmManagement/targetMaintenance',
      alwaysShow: true,
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/alarmManagement'),
      children: [
        {
          path: 'targetMaintenance',
          meta: { title: '推送人员维护', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/alarmManagement/subpage/targetMaintenance')
        },
        {
          path: 'durationConfiguration',
          meta: { title: '告警时长配置', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/alarmManagement/subpage/durationConfiguration')
        }
      ]
    },
    {
      path: 'fieldWindMachineConfig',
      meta: { title: '场区风机配置', noCache: true },
      redirect: '/unit-evc/baseInfo/fieldWindMachineConfig/fanDatabase',
      alwaysShow: true,
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/fieldWindMachineConfig'),
      children: [
        {
          path: 'fanDatabase',
          meta: { title: '风机数据管理', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/fieldWindMachineConfig/subpage/fanDatabase')
        },
        {
          path: 'configurationManagement',
          meta: { title: '场区配置管理', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/fieldWindMachineConfig/subpage/configurationManagement')
        }
      ]
    },
    {
      path: 'equipmentParameterTemplate',
      meta: { title: '设备参数模板', noCache: true },
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/equipmentParameterTemplate')
    },
    {
      path: 'systemAuthority',
      meta: { title: '系统权限管理', noCache: true },
      redirect: '/unit-evc/baseInfo/systemAuthority/rolePermission',
      alwaysShow: true,
      component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/fieldWindMachineConfig'),
      children: [
        {
          path: 'rolePermission',
          meta: { title: '角色权限管理', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/systemAuthority/subpage/rolePermission')
        },
        {
          path: 'dataRights',
          meta: { title: '数据权限管理', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/systemAuthority/subpage/dataRights')
        },
        {
          path: 'userReverseSearch',
          meta: { title: '用户权限反查', noCache: true },
          component: () => import('@/views/IntelligentControl/baseInfo/page/subpage/systemAuthority/subpage/userReverseSearch')
        }
      ]
    }
  ]
}

export default baseInfo
