/**
 *
 * @file 路由总入口
 * @author author-name(李红波 15537053107 , 孙亚飞 17600837372)
 */

import Vue from 'vue'
import Router from 'vue-router'
// import env from '@/common/config/env'
// import navList from '@/common/constants/navList'

Vue.use(Router)
// 用户管理
import userManagements from '@/views/userManagement/router/index'

// 智能环控
import IntelligentControl from '@/views/IntelligentControl/A.Public/router/index'

// 清洁生产
import WlwAdministration from '@/views/WlwAdministration/A.Public/router/index'

const baseRouterMap = [
  {
    path: '/',
    redirect: '/login'
  },
  // {
  //   // 平台概览
  //   path: '/platform-overview',
  //   component: () => import('@/views/PlatformOverview/index')
  // },
  {
    path: '/403',
    component: () => import('@/views/errorPage/403')
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404')
  }
  // {
  //   path: '/unauthPage',
  //   component: () => import('@/views/noAuthPage/index')
  // },
]

const routerAbout404 = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const appRouterMap = [
  IntelligentControl,
  userManagements,
  WlwAdministration
]

let constantRouterMap = []

if (process.env.VUE_APP_ONLY_PACK_APP_NAME === 'feed-scheduling') {
  // constantRouterMap = [...baseRouterMap, userManagements, dataCenter, IntelligentFeed, ...routerAbout404]
  constantRouterMap = [...baseRouterMap, userManagements, ...routerAbout404]
} else {
  constantRouterMap = [...baseRouterMap, ...appRouterMap, ...routerAbout404]
}

console.log('ss-{}', constantRouterMap)
const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

// router.onError((error) => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed) {
//     router.replace(targetPath)
//   }
// })

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
