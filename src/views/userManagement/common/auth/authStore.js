/**
 * token相关存储的信息
 * @file   localStorage
 * @author author-name(lhb 1301465186@qq.com)
 */

const TokenKey = 'MY-Admin-Token'
const RefreshKey = 'MY-Refresh-Token'
const ExpiresKey = 'MY-Refresh-Expires'
const AuthTimeKey = 'MY-Auth-Time'
const TokenWatchKey = 'token-watch'

import { lStorage } from '@/common/base/storage/baseStorage'

/**
 * 获取token
 *
 * @export
 * @returns
 */
export function getToken() {
  return lStorage.get(TokenKey)
}

/**
 * 存储token
 *
 * @export
 * @param {*} token 存储的值
 * @returns
 */
export function setToken(token) {
  return lStorage.set(TokenKey, token)
}

/**
 * 清空token及store信息
 *
 * @export
 */
export function removeToken() {
  return lStorage.clear()
}

/**
 * 获取token刷新值
 *
 * @export
 * @returns
 */
export function getRefresh() {
  return lStorage.get(RefreshKey)
}

/**
 * 存储的刷新token
 *
 * @export
 * @param {*} token 存储的值
 * @returns
 */
export function setRefresh(token) {
  return lStorage.set(RefreshKey, token)
}

/**
 * 存储的刷新的时间
 *
 * @export
 * @returns
 */
export function setAuthTime() {
  return lStorage.set(AuthTimeKey, Date.now())
}

/**
 * 获取刷新时间
 *
 * @export
 * @returns
 */
export function getAuthTime() {
  return parseInt(lStorage.get(AuthTimeKey), 10)
}

/**
 * 存储时间间隔值
 *
 * @export
 * @param {*} time
 * @returns
 */
export function setExpires(time) {
  return lStorage.set(ExpiresKey, time)
}

/**
 * 获取时间间隔值
 *
 * @export
 * @returns
 */
export function getExpires() {
  // console.log('获取的值',lStorage.get(ExpiresKey));
  return Number(lStorage.get(ExpiresKey))
}

/**
 * token 监听初始化
 *
 * @export
 * @returns
 */
export function setTokenWatch() {
  return lStorage.set(TokenWatchKey, 1)
}

/**
 * token 获取监听值
 *
 * @export
 * @returns
 */
export function getTokenWatch() {
  return localStorage[TokenWatchKey]
}

/**
 * token 启用监听
 *
 * @export
 * @returns
 */
export function tokenWatch() {
  // lStorage.set(TokenWatchKey,localStorage[TokenWatchKey]++)
  localStorage[TokenWatchKey]++
}
