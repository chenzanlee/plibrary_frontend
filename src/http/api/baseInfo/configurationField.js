/*
 @file 场区营养方案- 保育信息维护
 */

import request from '@/http/http'

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
// 列表
export function myEvcMcuInfo(data) {
  return request('/api/feed_scheduling/myYyConfiguration/subsidiary/getPageList', {
    method: 'get',
    params: data
  })
}

// 审核接口
export function review(data) {
  const url = '/api/feed_scheduling/myYyConfiguration/subsidiary/review?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}

// 新增

export function myEvcMcuInfoAdd(data) {
  return request('/api/feed_scheduling/myYyConfiguration/subsidiary/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/feed_scheduling/myYyConfiguration/subsidiary/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  return request('/api/feed_scheduling/myYyConfiguration/subsidiary/delete?id=' + data.ids, {
    method: 'delete'
    // data: data
  })
}

/* 场区营养方案- 保育信息维护 */
