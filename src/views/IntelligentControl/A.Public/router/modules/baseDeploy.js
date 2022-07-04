
const baseDeploy = {
  path: 'baseDeploy',
  meta: { title: '基础配置管理', icon: 'Basic-Configuration', noCache: true },
  redirect: '/unit-evc/baseDeploy/menuManager',
  alwaysShow: true,
  component: () => import('@/views/IntelligentControl/baseDeploy/page'),
  children: [
    {
      code: 'menuManager',
      path: 'menuManager',
      meta: { title: '菜单管理', noCache: true },
      component: () => import('@/views/IntelligentControl/baseDeploy/page/subpage/menuManager')
    },
    {
      code: 'unit-evcDataInterface',
      path: 'dataInterface',
      meta: { title: '数据接口', noCache: true },
      component: () => import('@/views/IntelligentControl/baseDeploy/page/subpage/dataInterface')
    }
    // {
    //   path:'overview0fPlantEquipment',
    //   meta: { title: '厂区设备概览', noCache: true },
    //   component:() => import('@/views/IntelligentControl/baseDeploy/page/subpage/overview0fPlantEquipment')
    // },
    // {
    //   path:'pigHouse',
    //   meta: { title: '楼房猪舍', noCache: true },
    //   component:() => import('@/views/IntelligentControl/baseDeploy/page/subpage/pigHouse')
    // }
  ]

}

export default baseDeploy
