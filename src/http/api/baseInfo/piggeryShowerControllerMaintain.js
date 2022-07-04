/*
 @file 基础信息维护-猪舍喷淋控制器 信息维护
 */

import request from '@/http/http'

import { getConfigElement } from '@/utils/overtService'

const pageElement = getConfigElement('piggeryShowerControllerMaintain')
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

// 获取选择器的内容(内容需要自己过滤)  /api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2?isBuilding=false
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  const element = commonElement['getRegionAreaFieldRoomTypeUnitV2']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri + '?isBuilding=false', {
      method: element.method,
      params: data
    })
  }
}

// 获取选择器的内容(3级下拉树)
export function getRegionAreaFieldTree(data) {
  const element = commonElement['getRegionAreaFieldTree']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri + '?isBuilding=false', {
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

// 获取猪舍喷淋控制器列表 https://my.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/list
export function myEvcMcuInfo(data) {
  const element = pageElement['list']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// 猪舍类型的 四级数据加载 https://my.imuyuan.com/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeTree?isBuilding=false
export function getRegionAreaFieldRoomTypeTree(data) {
  const element = commonElement['getRegionAreaFieldRoomTypeTree']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri + '?isBuilding=false', {
      method: element.method,
      params: data
    })
  }
}

// 通道号部署单元 列表 api/unit_evc/myBaseFieldUnit/getUnitsUnderRoomType?areaId=-101&fieldId=-1001&regionId=-11&roomTypeId=13905
export function getUnitsUnderRoomType(data) {
  const element = commonElement['getUnitsUnderRoomType']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// 设备审核接口 https://dev.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/review?ids=66ko0dZVN89U4fWyVe4clm
export function review(data) {
  const element = pageElement['review']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    const url = '/api' + element.uri + '?ids=' + data.ids
    return request(url, {
      method: element.method,
      data: data
    })
  }
}

// 设备反审核接口
export function unreview(data) {
  const element = pageElement['unreview']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    const url = '/api' + element.uri + '?ids=' + data.ids
    return request(url, {
      method: element.method,
      data: data
    })
  }
}

// 获取设备条码列表 https://my.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/listEquipment
export function listEquipment(data) { // device_id
  const element = pageElement['listEquipment']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// 新增 https://dev.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/batchAdd

export function myEvcMcuInfoAdd(data) {
  const element = pageElement['batchAdd']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      data: data
    })
  }
}

// 修改 https://dev.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/update

export function myEvcMcuInfoUpdate(data) {
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

// 删除 https://dev.imuyuan.com/api/unit_evc/myPiggeryShowerDeviceInfo/delete?ids=6cg5r0XJmwNsuJyuIg5pDo
export function myEvcMcuInfoDelete(data) {
  const element = pageElement['delete']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    const url = '/api' + element.uri + '?ids=' + data.ids
    return request(url, {
      method: element.method,
      data: data
    })
  }
}

// 根据设备条码id 获取 api/unit_evc/myPiggeryShowerDeviceInfo/getBindInfoByPiggeryDevice?deviceId=4D5D203535555850501700330029
export function getBindInfoByPiggeryDeviceList(data) {
  const element = pageElement['getBindInfoByPiggeryDevice']
  if ((!element || !element.uri) && !uriLock) {
    authMsg()
  } else {
    return request('/api' + element.uri, {
      method: element.method,
      params: data
    })
  }
}

// 新增------
// areaId: "-101"
// areaName: "实验区"
// channel: 1
// deviceId: "4D5D203535555850501700330029"
// deviceName: "7bgdS28GdCQH3dpGwsx144"
// deviceVersionId: "7EYyS0R1vwcqgAUQ8UjnLs"
// deviceVersionName: "猪舍喷淋控制器v1"
// equipmentId: "49ps2ijNQ0WoSNctYOAYKn"
// equiptypeId: "7iqKm0XYydLzbQ2PSGxPlg"
// equiptypeName: "猪舍喷淋控制器"
// fieldId: "-1001"
// fieldName: "实验1场"
// qrCode: "-0KBMFYFL"
// regionId: "-11"
// regionName: "牧原总部"
// roomTypeId: "13909"
// roomTypeName: "怀孕舍"
// segmentId: "21254"
// segmentName: "空怀"
// unitId: "5vq6KIhKlKoba3MX8MjhpL"
// unitName: "2"
// {regionId: "-11", areaId: "-101", fieldId: "-1001", block: null, floor: null, segmentId: "13906",…}
// 1: {regionId: "-11", areaId: "-101", fieldId: "-1001", block: null, floor: null, segmentId: "13906",…}
// 2: {regionId: "-11", areaId: "-101", fieldId: "-1001", block: null, floor: null, segmentId: "13906",…}
