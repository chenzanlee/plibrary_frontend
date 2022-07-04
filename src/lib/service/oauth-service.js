/**
 *
 * @file 权限服务
 * @author author-name(李红波 15537053107)
 */

import { getToken, getRefresh, getAuthTime, getExpires } from '@/views/userManagement/common/auth/authStore'
// import store from '@/store'
// import router from '@/router/index'

export default class OAuthService {
  constructor() {
    this.offsetSeconds = 600
  }
  // 当前token
  getAccessToken() {
    return getToken()
  }
  // 过期时间
  getExpires() {
    return getExpires()
  }
  // 更新的token
  getRefresh() {
    return getRefresh()
  }
  // 开始时间
  getAuthTime() {
    return getAuthTime()
  }
  hasValidAccessToken() {
    if (this.getAccessToken()) {
      const expires = this.getExpires()
      if (expires) {
        if (expires && parseInt(expires, 10) < new Date().getTime()) {
          return false
        }
        return true
      } else {
        return false
      }
    }
    return false
  }
  refreshToken() {
    const expires = this.getExpires()
    if (expires - new Date().getTime() < this.offsetSeconds * 1000) {
      return true
    }
  }
  refreshTokenService(config, aa) {
    return
    // store.dispatch('RefreshToken').then(res=>{

    // })
  }
}

// const oauthService = new OAuthService()
// export default oauthService
