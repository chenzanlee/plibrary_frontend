/*
 @file 计划绑定
 */

import request from '@/http/http'

// 获取选择器的内容(内容需要自己过滤)  http://localhost:8080/api/bar_patrol/myBaseInfo/treeForSelect
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/bar_patrol/myBaseInfo/treeForSelect', {
    method: 'post',
    data: data
  })
}

// 信息维护接口
export function myEvcMcuInfo(data) {
  return request('/api/bar_patrol/myBpCarInspectPlan/getPageList', {
    method: 'post',
    data: data
  })
}

// 审核接口
export function review(data) {
  const url = '/api/bar_patrol/myBpCarInspectPlan/review?ids=' + data.ids

  return request(url, {
    method: 'post',
    data: data
  })
}

// 下发计划接口
export function handedout(data) {
  const url = '/api/bar_patrol/myBpCarInspectPlan/handedout?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 反审核接口
export function unreview(data) {
  const url = '/api/bar_patrol/myBpCarInspectPlan/unreview?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 新增

export function myEvcMcuInfoAdd(data) {
  return request('/api/bar_patrol/myBpCarInspectPlan/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/bar_patrol/myBpCarInspectPlan/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  return request('/api/bar_patrol/myBpCarInspectPlan/delete', {
    method: 'delete',
    params: data
  })
}

// 计划名称 新增 修改 用

export function getPlanList(data) {
  return request('/api/bar_patrol/myBpInspectPlan/list', {
    method: 'post',
    data: data
  })
}

// 分级加载数据
// /api/bar_patrol/myBaseInfo/getListDataForTree
export function getListDataForTree(data) {
  return request('/api/bar_patrol/myBaseInfo/getListDataForTree', {
    method: 'post',
    data: data
  })
}
