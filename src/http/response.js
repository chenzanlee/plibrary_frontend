/**
 * 请求相关的配置函数
 * @file 请求库工具函数封装
 * @author author-name(李红波 15537053107)
 */

import {
  Message,
  Notification
} from 'element-ui'
import router from '@/router/index'
// import store from '@/store'

// 是否正在刷新的标记
// let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
// let requests = []
/**
 * message 提示函数
 *
 * @param {*} msg 提示的信息，5秒后关闭
 * @param {*} msg 提示的信息类型
 */
export const message = (type, msg) => {
  Message({
    message: msg,
    type: type,
    iconClass: 'el-icon-warning errorMsgIcon',
    showClose: true,
    duration: 5 * 1000
  })
}

/**
 * notification 提示函数
 *
 * @param {*} msg 提示信息
 * @param {*} a  提示信息的下标
 */
export const notification = (msg, a) => {
  Notification({
    title: '请求异常',
    type: 'error',
    message: msg,
    offset: 70 * a
  })
}

/**
 * 登录页跳转函数
 *
 */
export const toLogin = () => {
  router.push({
    path: '/login'
  })
}

/**
 * 请求失败后的错误统一处理
 *
 * @param {*} status 响应的状态码
 * @param {*} msg    响应的信息
 */
export const errorHandle = (status, msg, url, path) => {
  switch (status) {
    // 400: token获取异常 || 请求参数异常
    // 跳转登录页
    case 400:
      if (url !== '/api/unit_evc/myEvcMcuInfo/update' && url !== '/api/unit_evc/myEvcMcuInfo/add') {
        // toLogin()
      }
      message('error', msg || '请求错误')
      break
    // 401: 未登录 || 未经授权
    // 跳转登录页
    case 401:
      // store.dispatch('RefreshToken')
      toLogin()
      localStorage.clear()
      break
    // 403: token 过期 || 权限不足
    // 展示提示信息
    case 403:
      message('error', '温馨提示:用户访问权限不足!')
      break
      // if (path === '/platform-overview') {
      //   break
      // } else {
      //   message('error', '温馨提示:用户访问权限不足!')
      //   break
      // }
    case 404:
      message('error', '温馨提示:URL失效')
      break
    case 500:
      message('error', '服务器内部错误')
      break
    case 501:
      message('error', '服务器内部错误')
      break
    case 502:
      message('error', '服务器内部错误')
      break
    case 503:
      message('error', '服务器内部错误')
      break
    case 504:
      message('error', '服务器内部错误')
      break
    case 505:
      message('error', '服务器内部错误')
      break
    // 其他错误，直接展示后台错误提示
    default:
      message('error', msg || `${status}: 未知错误`)
  }
}

/**
 * 请求成功后的错误统一处理
 * @param {*} status 响应的状态码
 * @param {*} msg    响应的信息
 */
export const successHandle = (status, msg) => {
  switch (status) {
    case 200:
      message('success', msg)
      break
  }
}

// export const tokenQueue = (error) => {
//   const config = error.response.config
//   if (!isRefreshing) {
//     isRefreshing = true

//     return store.dispatch('RefreshToken').then(res => {
//       config.headers['Authorization'] = getToken()

//       requests.forEach(cb => cb(getToken()))
//       requests = []
//       return service(config)
//     }, err => {
//     }).catch(res => {
//       console.error('refreshtoken error =>', res)
//     }).finally(() => {
//       isRefreshing = false
//     })
//   } else {
//     return new Promise((resolve) => {
//       requests.push(() => {
//         config.headers['Authorization'] = getToken()
//         resolve(service(config))
//       })
//     })
//   }
// }
