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

export function getListDataForTree(data) {
  return request('/api/bar_patrol/myBaseInfo/getListDataForTree', {
    method: 'post',
    data: data
  })
}

// 设备信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/bar_patrol/myBpFieldUnitCameral/getPageListV2', {
    method: 'post',
    data: data
  })
}

// 搜索类型
export function myBaseInfo1701027(data) {
  return request('/api/bar_patrol/myBaseInfo/dict/1701027', {
    method: 'get',
    params: data
  })
}
export function myBaseInfo1701028(data) {
  return request('/api/bar_patrol/myBaseInfo/dict/1701028', {
    method: 'get',
    params: data
  })
}
export function myBaseInfo1701024(data) {
  return request('/api/bar_patrol/myBaseInfo/dict/1701024', {
    method: 'get',
    params: data
  })
}
export function myBaseInfo1701025(data) {
  return request('/api/bar_patrol/myBaseInfo/dict/1701025', {
    method: 'get',
    params: data
  })
}
// 设备型号接口
export function getEquipmentType(data) {
  return request('/api/bar_patrol/myBaseInfo/getEquipmentType', {
    method: 'post',
    data: data
  })
}

// 设备审核接口
export function review(data) {
  const url = 'api/bar_patrol/myBpFieldUnitCameral/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 设备反审核接口
export function unreview(data) {
  const url = 'api/bar_patrol/myBpFieldUnitCameral/unreview?ids=' + data.ids

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

// 巡栏小车下拉框
export function getUnitCarTypeList(data) {
  return request('api/bar_patrol/myBpFieldUnitCar/list', {
    method: 'post',
    data: data
  })
}

// 新增摄像头信息
export function addCarema(data) {
  return request('/api/bar_patrol/myBpFieldUnitCameral/add', {
    method: 'post',
    data: data
  })
}

// 删除摄像头
export function myEvcMcuInfoDelete(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCameral/delete?ids=' + data.ids
  return request(url, {
    method: 'delete',
    data: data
  })
}

// 摄像头修改 /bar_patrol/myBpFieldUnitCameral/update
export function updateCarema(data) {
  const url = '/api/bar_patrol/myBpFieldUnitCameral/update'
  return request(url, {
    method: 'put',
    data: data
  })
}
