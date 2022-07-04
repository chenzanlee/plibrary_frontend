/*
 @file 场区日志-控制指令日志
 */

import request from '@/http/http'

// 设备请求
export function myEvcOperationDynamicsRealTime(data) {
  return request('/api/unit_evc/myEvcOperationDynamicsRealTime/file/urls', {
    method: 'get',
    params: data
  })
}

// 获取选择器的内容(内容需要自己过滤)
export function getRegionAreaFieldRoomTypeUnitV2(data) {
  return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
    method: 'get',
    params: data
  })
}

// // 获取大区列表
// export function getRegionAreaFieldTree(data) {
//   return request('/api/unit_evc/myBaseFieldUnit/getRegionAreaFieldTree', {
//     method: 'get',
//     params: data
//   })
// }

// 根据单元获取栏位
export function getUnitColumnV2(data) {
  return request('/api/bar_patrol/statistics/getStyListByFieldIdAndSegmentId', {
    method: 'post',
    data: data
  })
}

export function dataReport(data) {
  return request('/api/unit_evc/myEvcOperationDynamicsRealTime/export', {
    method: 'get',
    params: data
  })
}
