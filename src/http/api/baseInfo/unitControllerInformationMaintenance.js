// 单元控制器信息维护 页面
import request from '@/http/http'

import { getConfigElement } from '@/utils/overtService'

const pageElement = getConfigElement('unitControllerMaintain')
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

// 大区/区域/场区/猪舍类型/单元 接口 /api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2?isBuilding=true
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  const element = commonElement['getRegionAreaFieldRoomTypeUnitV2']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// 设备条码 api/unit_evc/myEvcBuildingUnitController/listBuildingUnitEquipments?
export function myEvcMcuInfo(data) {
  const element = pageElement['listBuildingUnitEquipments']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// api/unit_evc/myEvcBuildingUnitController/list?deviceId&floor=FLOOR_THREE&limit=20&mac&page=1&status=
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

// add https://dev.imuyuan.com/api/unit_evc/myEvcBuildingUnitController/add
export function add(data) {
  const element = pageElement['add']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// unreview /unit_evc/myEvcBuildingUnitController/unreview?ids=2VQ0CwvzaEYy7ciLxugUPS
export function unreview(data) {
  const element = pageElement['unreview']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// review /unit_evc/myEvcBuildingUnitController/review?ids=2VQ0CwvzaEYy7ciLxugUPS
export function review(data) {
  const element = pageElement['review']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// update https://dev.imuyuan.com/api/unit_evc/myEvcBuildingUnitController/update
export function update(data) {
  const element = pageElement['update']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// delete /api/unit_evc/myEvcBuildingUnitController/delete?ids=201JlikEITcDPvypvlhYHK
export function deleteObj(data) {
  const element = pageElement['delete']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}
