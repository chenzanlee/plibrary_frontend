// /**
//  * 请求库的配置
//  * @file 底层请求库封装
//  * @author author-name(李红波 15537053107)
//  */

// import axios from 'axios'
// import { interceptors } from '@/http/interceptors'

// // 开发环境配置
// var baseURL = ''
// // if (location.hostname === 'localhost') {
// //   baseURL = "/api/"
// // } else if (location.hostname.includes('dev')) {
// //   baseURL = "/api/"
// // } else {
// //   baseURL = "/api/"
// // }

// // 初始化
// const service = axios.create({
//   baseURL,
//   timeout: 100000
// })

// // 拦截器
// interceptors(service)

// export default service

/* *********************************************************************** */

import request from '@/http/https'
import { setToken, getToken, getRefresh, setRefresh, setAuthTime, setExpires, getExpires } from '@/views/userManagement/common/auth/authStore'
import { setBytes } from '@/views/userManagement/common/auth/userStore'
import router from '@/router/index'
import store from '@/store'
import jwtDecode from 'jwt-decode'

let setoutTimer = null
let refreshStatus = false
// 设置过期时间
// const be_overdue = (1000 * 60 * 59) + (1000 * 40)
const be_overdue = 1000 * 60 * 10
// 设置最后一次操作后，刷新token时间
const end_token = 1000 * 60 * 9
// 设置等待token时间
const await_token = 1000
// token有效时间
// const effective_time = (1000 * 60 * 59) + (1000 * 50)
const effective_time = 1000 * 60 * 30

// 是否获取到新的token
const getTimeDifference = () => {
  const new_Time = new Date(getExpires()) - new Date().getTime()
  if (new_Time > effective_time) {
    return true
  } else {
    return false
  }
}

// 更新token
const refreshToken = () => {
  return request('/api/auth/jwt/refresh', {
    method: 'POST',
    headers: {
      Authorization: getToken(),
      RefreshToken: getRefresh()
    }
  })
}

// 返回登录
const backLogin = () => {
  refreshStatus = false
  router.push({ path: '/login' })
}

// 延时后面进入的接口
const setTimer = (url, data) => {
  if (refreshStatus) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve('') }, await_token)
    }).then(res => {
      refreshStatus = !getTimeDifference()
      return setTimer(url, data)
    })
  } else {
    setTimeGetToken()
    return request(url, data)
  }
}
// 缓存新的token
const setTokenInfo = (response) => {
  // vuex存储token
  store.commit('SET_TOKEN', response.data.rows[0].token)
  // vuex过期token
  store.commit('SET_REFRESHTOKEN', response.data.rows[0].refreshToken)
  // vuex存储token Acction
  store.commit('SET_BYTES', jwtDecode(response.data.rows[0].token))
  // 缓存token
  setToken(response.data.rows[0].token)
  localStorage.setItem('user-token', response.data.rows[0].token)
  // 缓存过期token
  setRefresh(response.data.rows[0].refreshToken)
  //  缓存token Acction
  setBytes(jwtDecode(response.data.rows[0].token))
  // 存储当前时间
  setAuthTime()
  // 存储时间间隔值
  setExpires(`${jwtDecode(response.data.rows[0].token).exp}000`)
  refreshStatus = false
}
// 最后一次操作后延时获取token
const setTimeGetToken = () => {
  clearTimeout(setoutTimer)
  setoutTimer = setTimeout(() => {
    refreshStatus = true
    refreshToken().then((response) => {
      refreshStatus = false
      setTokenInfo(response)
    }).catch(res => { backLogin })
  }, end_token)
}

const httpService = (url, data) => {
  if (url === 'logout') {
    refreshStatus = false
    clearTimeout(setoutTimer)
    return
  } else if (url === '/api/auth/jwt/token' || url === '/api/auth/jwt/tokenByWxQrCode') {
    return request(url, data)
  } else {
    if (refreshStatus) {
      return setTimer(url, data)
    } else {
      const type = ((new Date(getExpires()) - new Date().getTime()) < be_overdue)
      if (type) {
        clearTimeout(setoutTimer)
        refreshStatus = true
        return refreshToken().then((response) => {
          setTokenInfo(response)
          return request(url, data)
        }).catch(res => { backLogin })
      } else {
        setTimeGetToken()
        return request(url, data)
      }
    }
  }
}

export default httpService
