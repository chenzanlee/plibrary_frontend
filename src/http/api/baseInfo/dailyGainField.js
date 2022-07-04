/*
 @file 场区-育肥后备日龄日增重对照
 */

import request from '@/http/http'

// 获取列表内容
export function getPageList(data) {
  return request(`/api/feed_scheduling/myYyDailyGain/subsidiary/getPageList`, {
    method: 'get',
    params: data
  })
}

// 设备审核接口
export function review(data) {
  const url = '/api/feed_scheduling/myYyDailyGain/subsidiary/review?ids=' + data.ids
  return request(url, {
    method: 'post',
    data: data
  })
}
// 校验
export function selectOne(data) {
  return request('/api/feed_scheduling/myYyConservationNutrition/selectOne', {
    method: 'post',
    data: data
  })
}

// 新增

export function myEvcMcuInfoAdd(data) {
  return request('/api/feed_scheduling/myYyDailyGain/subsidiary/add', {
    method: 'post',
    data: data
  })
}

// 修改

export function myEvcMcuInfoUpdate(data) {
  return request('/api/feed_scheduling/myYyDailyGain/subsidiary/update', {
    method: 'put',
    data: data
  })
}

// 删除

export function myEvcMcuInfoDelete(data) {
  return request('/api/feed_scheduling/myYyDailyGain/subsidiary/delete?id=' + data.id, {
    method: 'delete'
    // data: data
  })
}
// 获取选择器的内容
export function regionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldRoomTypeUnitV2', {
    method: 'get',
    data: data
  })
}

/* 场区-育肥后备日龄日增重对照 */
