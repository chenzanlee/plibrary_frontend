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
import plibrary from '@/views/plibrary/library/public/router/index'
import LibraryHome from '../views/plibrary/home'

const baseRouterMap = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
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
    path: '/index',
    component: () => import('@/views/plibrary/index')
  },
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
  userManagements,
  plibrary
]

const constantRouterMap = [...baseRouterMap, ...appRouterMap, ...routerAbout404]
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
