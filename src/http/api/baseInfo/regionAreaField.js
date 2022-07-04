/*
 @file 基础信息维护-猪舍喷淋控制器 信息维护
 */

import request from '@/http/http'

import { getConfigElement } from '@/utils/overtService'

const commonElement = getConfigElement('unit-evcDataInterface')
import {
  Message
} from 'element-ui'
let uriLock = false
function authMsg() {
  uriLock = true
  setTimeout(() => {
    uriLock = false
    Message.error('温馨提示:用户访问权限不足!')
  }, 2000)
  return
}

// 获取选择器的内容(3级下拉树)
export function getRegionAreaFieldTree(data) {
  const element = commonElement['getRegionAreaFieldTree']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// 获取选择器的内容(2级异步下拉树)
export function getRootTypeUnitTreeV2(data) {
  const element = commonElement['getRootTypeUnitTreeV2']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}
