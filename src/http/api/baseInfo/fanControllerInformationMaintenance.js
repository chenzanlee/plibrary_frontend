// 环控主控制器信息维护 页面
import request from '@/http/http'

import { getConfigElement } from '@/utils/overtService'

const pageElement = getConfigElement('roofSubControllerMaintain')
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

// 大区/区域/场区 三级接口
export function getRegionAreaFieldRoomTypeUnitV2(data) {
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

// 设备条码列表接口
export function myEvcMcuInfo(data) {
  const element = pageElement['listEquipment']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// 获取table列表 https://dev.imuyuan.com/api/unit_evc/myEvcBuildingRoofSubController/list?limit=20&page=1
export function getMyEvcMcuInfoList(data) {
  const element = pageElement['list']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// add https://dev.imuyuan.com/api/unit_evc/myEvcBuildingRoofSubController/add
export function add(data) {
  const element = pageElement['btn_add']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// update https://dev.imuyuan.com/api/unit_evc/myEvcBuildingRoofSubController/update
export function update(data) {
  const element = pageElement['btn_update']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// delete https://dev.imuyuan.com/api/unit_evc/myEvcBuildingRoofMainController/delete?ids=7dbcVSsFBxxWfPdTcSMeuJ
export function deleteObj(data) {
  const element = pageElement['btn_del']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// unreview https://dev.imuyuan.com/api/unit_evc/myEvcBuildingRoofSubController/unreview?ids=7dQAADFmjPo0ZHRVrtUWQy
export function unreview(data) {
  const element = pageElement['btn_unreview']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// review
export function review(data) {
  const element = pageElement['btn_review']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}
