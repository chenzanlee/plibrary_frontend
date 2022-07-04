/* eslint-disable indent */
const sampleTemplate =
{
  path: 'baseDeploy',
  meta: { title: '系统设置', icon: 'Basic-Configuration', noCache: true },
  redirect: '/wlw/baseDeploy/menuManager',
  alwaysShow: true,
  component: () => import('@/views/WlwAdministration/baseDeploy/page'),
  children: [
    {
      code: 'menuManager',
      path: 'menuManager',
      meta: { title: '菜单管理', icon: 'Map', noCache: true, hidden: true },
      component: () => import('@/views/WlwAdministration/baseDeploy/page/subpage/menuManager')
    },
    {
      path: 'dataPermissions',
      meta: { title: '数据权限', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/baseDeploy/page/subpage/dataPermissions')
    },
    {
      path: 'rolePermissions',
      meta: { title: '角色权限', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/baseDeploy/page/subpage/rolePermissions')
    },
    {
      path: 'dataInterface',
      meta: { title: '数据接口', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/baseDeploy/page/subpage/dataInterface')
    }
  ]

}
export default sampleTemplate
