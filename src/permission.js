import router from '@/router'
// import { storageFrontInfo } from '@/utils/overtService'
/* 路由拦截器 路由跳转前的操作 */
const getToken = () => {
  const token = localStorage.getItem('MY-Admin-Token') || null
  return token
}
const whiteList = ['/login', '/404', '/403', '/unauthPage', '/index'] // 路由白名单  不需要token的页面
router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (!hasToken) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  } else {
    const cancelArr = window.axiosCancel
    cancelArr.forEach((ele, index) => {
      // 在失败函数中返回这里自定义的错误信息
      ele.cancel('取消了请求')
      delete window.axiosCancel[index]
    })
    // storageFrontInfo('all')
    next()
  }
})
