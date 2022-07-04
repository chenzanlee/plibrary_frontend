/*
 @file 基础信息维护-设备参数模板
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}
// 大区、区域、场区
export function getTreeForRegionAreaField(data) {
  return request('/api/bar_patrol/myBaseInfo/getListDataForTree', {
    method: 'post',
    data: data
  })
}
// 获取选择器的内容
export function regionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    data: data
  })
}
// 设备信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/unit_evc/myEvcMcuInfo/list', {
    method: 'post',
    data: data
  })
}

// 设备审核接口
export function review(data) {
  const url = '/api/unit_evc/myEvcMcuInfo/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = '/api/unit_evc/myEvcMcuInfo/unreview?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 获取设备条码列表
export function listEquipment(data) {
  return request('/api/unit_evc/myEvcMcuInfo/listEquipment', {
    method: 'get',
    params: data
  })
}

// 新增

export function myEvcMcuInfoAdd(data) {
  return request('/api/unit_evc/myEvcMcuInfo/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/unit_evc/myEvcMcuInfo/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  return request('/api/unit_evc/myEvcMcuInfo/delete?ids=' + data.ids, {
    method: 'delete'
    // data: data
  })
}

/* 设备信息维护页面 */
