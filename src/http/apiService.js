import request from '@/http/http'
import { setToken, getToken, getRefresh, setRefresh, setAuthTime, setExpires, getExpires } from '@/views/userManagement/common/auth/authStore'
import { setBytes } from '@/views/userManagement/common/auth/userStore'
import router from '@/router/index'
import store from '@/store'
import jwtDecode from 'jwt-decode'

let setoutTimer = null
let refreshStatus = false
// 设置过期时间
const be_overdue = (1000 * 60 * 59) + (1000 * 40)
// 设置最后一次操作后，刷新token时间
const end_token = 1000 * 60 * 9
// 设置等待token时间
const await_token = 2000
// token有效时间
const effective_time = 1000 * 60 * 60

const getTimeDifference = () => {
  const now_time = new Date().getTime()
  const refresh_time = new Date(getExpires())
  const new_Time = refresh_time - now_time
  if (new_Time > effective_time) {
    return true
  } else {
    return false
  }
}

const setTimer = (url, data) => {
  if (refreshStatus) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, await_token)
    }).then(res => {
      if (getTimeDifference) {
        refreshStatus = false
      } else {
        refreshStatus = true
      }
      return setTimer(url, data)
    })
  } else {
    return request(url, data)
  }
}

const setTokenInfo = (response) => {
  // vuex存储token
  store.commit('SET_TOKEN', response.data.rows[0].token)
  // vuex过期token
  store.commit('SET_REFRESHTOKEN', response.data.rows[0].refreshToken)
  // vuex存储token Acction
  store.commit('SET_BYTES', jwtDecode(response.data.rows[0].token))
  // 缓存token
  setToken(response.data.rows[0].token)
  // 缓存过期token
  setRefresh(response.data.rows[0].refreshToken)
  //  缓存token Acction
  setBytes(jwtDecode(response.data.rows[0].token))
  // 存储当前时间
  setAuthTime()
  // 存储时间间隔值
  setExpires(`${jwtDecode(response.data.rows[0].token).exp}000`)
}

const httpService = (url, data) => {
  if (refreshStatus) {
    return setTimer(url, data)
  } else {
    // 过期时间
    const refresh_time = new Date(getExpires())
    // 当前时间
    const now_time = new Date().getTime()
    const type = ((refresh_time - now_time) < be_overdue)
    // ****
    if (type) {
      clearTimeout(setoutTimer)
      refreshStatus = true
      // 这个地方是更新token的接口， 目前用天气的接口做测试
      return request('/api/auth/jwt/refresh', {
        method: 'POST',
        headers: {
          Authorization: getToken(),
          RefreshToken: getRefresh()
        }
      }).then((response) => {
        refreshStatus = false
        setTokenInfo(response)
        return request(url, data)
      }).catch(res => {
        router.push({
          path: '/login'
        })
      })
    } else {
      clearTimeout(setoutTimer)
      setoutTimer = setTimeout(() => {
        request('/api/auth/jwt/refresh', {
          method: 'POST',
          headers: {
            Authorization: getToken(),
            RefreshToken: getRefresh()
          }
        }).then((response) => {
          setTokenInfo(response)
        }).catch(res => {
          router.push({
            path: '/login'
          })
        })
      }, end_token)
      return request(url, data)
    }
  }
}

export default httpService
