/**
 * 用户相关存储的信息
 * @file   localStorage
 * @author author-name(lhb 1301465186@qq.com)
 */

const UserKey = 'MY-UserInfo'
const BytesKey = 'MY-Bytes'

import { lStorage } from '@/common/base/storage/baseStorage'

/**
 * 获取用户信息
 *
 * @export
 * @returns
 */
export function getInfo() {
  return lStorage.get(UserKey)
}

/**
 * 存储用户信息
 *
 * @export
 * @param {*} info 存储的值
 * @returns
 */
export function setInfo(info) {
  return lStorage.set(UserKey, info)
}

/**
 * 获取bytes
 *
 * @export
 * @returns
 */
export function getBytes() {
  return lStorage.get(BytesKey)
}

/**
 * 存储bytes
 *
 * @export
 * @param {*} bytes 存储的值
 * @returns
 */
export function setBytes(bytes) {
  return lStorage.set(BytesKey, bytes)
}

