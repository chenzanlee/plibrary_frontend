/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelectV1', {
    method: 'post',
    data: data
  })
}

// 设备信息维护接口
export function myEvcMcuInfo(data) {
  // return request('/api/bar_patrol/myBpCarConfig/list', {
  return request('/api/bar_patrol/styConf/listPage', {
    method: 'post',
    data: data
  })
}

//

// 设备型号接口
export function getEquipmentType(data) {
  return request('/api/bar_patrol/myBaseInfo/getEquipmentType', {
    method: 'post',
    data: data
  })
}

// 设备审核接口
export function review(data) {
  const url = '/api/bar_patrol/styConf/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/bar_patrol/styConf/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备下发接口

export function handedout(data) {
  const url =
    '/api/bar_patrol/myBpFieldUnitCar/handedout?carNumbers=' + data.carNumbers

  return request(url, {
    method: 'post',
    data: data
  })
}

// 获取设备条码列表
export function listEquipment(data) {
  return request(
    '/api/unit_evc/myEvcMcuInfo/listEquipment?controllerType=BUILDING_UNIT_CONTROLLER',
    {
      method: 'post',
      data: data
    }
  )
}

// 新增

export function myEvcMcuInfoAdd(data) {
  return request('/api/bar_patrol/styConf/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/bar_patrol/styConf/update', {
    method: 'post',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  const url = '/api/bar_patrol/styConf/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

export function getWlwDictByCode() {
  return request(`/api/bar_patrol/myBaseInfo/getWlwDictByCode/1303001`, {
    method: 'get'
  })
}

export function getMyBaseInfoDict() {
  return request(`/api/bar_patrol/myBaseInfo/dict/1701026`, {
    method: 'get'
  })
}

export function getAyBaseInfoPostion(url, data) {
  return request(url.url, {
    method: 'post',
    data: data
  })
}

//  下发配置 /api/bar_patrol/myBpCarConfig/handedout
export function handleOutConfig(data) {
  return request('/api/bar_patrol/myBpCarConfig/handedout?ids=' + data.ids, {
    method: 'post',
    data: data
  })
}
