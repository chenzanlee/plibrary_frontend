/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}

// 设备信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/bar_patrol/myBpInspectPlan/list', {
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
  const url = '/api/bar_patrol/myBpInspectPlan/review?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/bar_patrol/myBpInspectPlan/unreview?ids=' + data.ids
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
  return request('/api/bar_patrol/myBpInspectPlan/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/bar_patrol/myBpInspectPlan/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  const url = '/api/bar_patrol/myBpInspectPlan/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

// 获取巡栏推送配置列表
export function getMyBpPushTargetConfigurationList(data) {
  const url = '/api/bar_patrol/myBpPushTargetConfiguration/pageList'
  return request(url, {
    method: 'post',
    data: data
  })
}
