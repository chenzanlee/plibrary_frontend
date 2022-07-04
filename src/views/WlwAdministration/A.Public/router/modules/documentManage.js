export default {
  path: 'documentManage',
  meta: { title: '文档管理', icon: 'Basic-Configuration', noCache: true },
  redirect: '/wlw/documentManage/operatingInstructions',
  alwaysShow: true,
  component: () => import('@/views/WlwAdministration/A.Public/page/parentView.vue'),
  children: [
    {
      path: 'operatingInstructions',
      meta: { title: '操作说明', icon: 'Map', noCache: true },
      component: () => import('@/views/WlwAdministration/basicData/page/subpage/operatingInstructions')
    }
  ]
}
