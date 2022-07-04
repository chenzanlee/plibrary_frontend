/**
 *
 * @file 用户中心请求
 * @author author-name(李红波 15537053107)
 * @hideLoading 隐藏默认加载Loading
 */

import request from '@/http/http'
import { getToken, getRefresh } from '@/views/userManagement/common/auth/authStore'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request('/api/auth/jwt/token', {
    method: 'POST',
    data,
    hideLoading: true
  })
}

export function refreshToken() {
  return request('/api/auth/jwt/refresh', {
    method: 'POST',
    headers: {
      // eslint-disable-next-line no-undef
      Authorization: getToken(),
      // eslint-disable-next-line no-undef
      RefreshToken: getRefresh()
    }
  })
}

export function queryMenu() {
  return request('/api/admin/user/front/menus')
}

