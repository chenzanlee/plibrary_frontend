// /**
//  * 请求库的拦截器配置
//  * @file 请求库拦截器封装
//  * @author author-name(李红波 15537053107)
//  */
// // TODO:方法响应
// import * as fn from './response'
// // import { Loading } from 'element-ui'
// import { getToken } from '@/views/userManagement/common/auth/authStore'
// // import store from '@/store'
// import router from '@/router/index'
// import queueService from '@/lib/service/queue-service'
// import OauthService from '@/lib/service/oauth-service'
// const OAuthService = new OauthService()
// // import { refreshToken } from '@/http/api/userManagement'
// // let loading, hideLoading
// // function startLoading() { // 使用Element loading-start 方法
// //   loading = Loading.service({
// //     background: 'transparent',
// //     lock: true,
// //     text: '拼命加载中...'
// //   })
// // }
// // function endLoading() { // 使用Element loading-close 方法
// //   loading.close()
// // }
// export function interceptors(service) {
//   // 请求的配置
//   service.interceptors.request.use(
//     config => {
//       // if(config.method === 'get'){
//       //   config.url += '?'
//       //   for (let key in config.params) {
//       //     config.url += `${key}=${config.params[key]}&`;
//       //   };
//       // }
//       // hideLoading = config.hideLoading || false
//       // refreshToken().then(res=>{
//       // })
//       if (getToken()) {
//         config.headers.Authorization = getToken()
//       }
//       if (OAuthService.hasValidAccessToken() && OAuthService.refreshToken() && config.url !== '/api/auth/jwt/refresh') {
//         queueService.perform(config, service)
//       }
//       // if (!config.hideLoading) { startLoading() }
//       return config
//     },
//     error => {
//       Promise.reject(error)
//     }
//   )

//   // 响应的配置
//   service.interceptors.response.use(
//     res => {
//       // if (!hideLoading) { endLoading() }
//       if (res.data && res.data.message) {
//         // fn.successHandle(res.data.status, res.data.message)
//       }
//       if (res.data && res.data.status && res.data.status === 500) {
//         fn.errorHandle(res.data.status, res.data.message || res.data.msg)
//       }
//       return res.data
//     },
//     error => {
//       // if (!hideLoading) { endLoading() }
//       if (error.response) {
//         // if (error.response.status === 401 && error.response.config.url !== '/api/auth/jwt/refresh') {
//         //   const config = error.response.config
//         //   queueService.perform(config, service)
//         // } else {
//         const msg = error.response.data.msg || error.response.data.message
//         fn.errorHandle(error.response.status, msg, error.response.config.url, router.history.current.path)
//         return Promise.reject(error.response.data)
//         // }
//       }
//     }
//   )
// }

/* ***************************************************************************** */

/**
 * 请求库的拦截器配置
 * @file 请求库拦截器封装
 * @author author-name(李红波 15537053107)
 */
// TODO:方法响应
import * as fn from './response'
import axios from 'axios'
// import { Loading } from 'element-ui'
import { getToken } from '@/views/userManagement/common/auth/authStore'
// import store from '@/store'
import router from '@/router/index'
// import queueService from '@/lib/service/queue-service'
// import OauthService from '@/lib/service/oauth-service'
// const OAuthService = new OauthService()
// import { refreshToken } from '@/http/api/userManagement'
// let loading, hideLoading
// function startLoading() { // 使用Element loading-start 方法
//   loading = Loading.service({
//     background: 'transparent',
//     lock: true,
//     text: '拼命加载中...'
//   })
// }
// function endLoading() { // 使用Element loading-close 方法
//   loading.close()
// }

window.axiosCancel = []// 全局定义一个存放取消请求的标识

export function interceptors(service) {
  // 请求的配置
  service.interceptors.request.use(
    config => {
      // config.headers.frontAppCode = 'clean-produce' // 清洁生产 自己用
      // if(config.method === 'get'){
      //   config.url += '?'
      //   for (let key in config.params) {
      //     config.url += `${key}=${config.params[key]}&`;
      //   };
      // }
      // hideLoading = config.hideLoading || false
      // refreshToken().then(res=>{
      // })
      config.cancelToken = new axios.CancelToken(cancel => {
        window.axiosCancel.push({
          cancel
        })
      })
      if (getToken()) {
        config.headers.Authorization = getToken()
      }
      const currentSelectedApp = JSON.parse(localStorage.getItem('currentlySelect'))
      if (currentSelectedApp && currentSelectedApp.appCode && currentSelectedApp.appCode === 'feed-scheduling') {
        config.headers['Access-Code'] = currentSelectedApp.appCode
      }
      // if (OAuthService.hasValidAccessToken() && OAuthService.refreshToken() && config.url !== '/api/auth/jwt/refresh') {
      //   queueService.perform(config, service)
      // }
      // if (!config.hideLoading) { startLoading() }
      return config
    },
    error => {
      Promise.reject(error)
    }
  )

  // 响应的配置
  service.interceptors.response.use(
    res => {
      // if (!hideLoading) { endLoading() }
      if (res.data && res.data.message) {
        // fn.successHandle(res.data.status, res.data.message)
      }
      if (res.data && res.data.status && res.data.status === 500) {
        fn.errorHandle(res.data.status, res.data.message || res.data.msg)
      }
      return res.data
    },
    error => {
      // if (!hideLoading) { endLoading() }
      if (error.response) {
        // if (error.response.status === 401 && error.response.config.url !== '/api/auth/jwt/refresh') {
        //   const config = error.response.config
        //   queueService.perform(config, service)
        // } else {
        const msg = error.response.data.msg || error.response.data.message
        fn.errorHandle(error.response.status, msg, error.response.config.url, router.history.current.path)
        return Promise.reject(error.response.data)
        // }
      }
    }
  )
}
